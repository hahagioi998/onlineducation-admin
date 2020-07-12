<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      
      <!-- 课程简介-->
      <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      
      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/course'
import subject from '@/api/subject'
import Tinymce from '@/components/Tinymce'
export default {
  // 声明组件
  components: { Tinymce },

  data() {
    return {
      courseId: '',
      saveBtnDisabled: false, // 保存按钮是否禁用
      teacherList:[], // 所有讲师
      subjectOneList:[], // 所有课程的一级分类
      subjectTwoList:[], // 所有课程的二级分类
      courseInfo:{
        cover: process.env.OSS_CHAPTER
      },
      BASE_API: process.env.BASE_API, // 接口 API 地址
    }
  },
  // 路由跳转监听
  watch: {
    $route(to, from) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      // 获取路由中的参数值
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 根据id查询课程信息
        this.getCourseInfo()
      } else {
        // 初始化所有讲师
        this.getListTeacher()
        // 初始化一级分类
        this.getOneSubject()
        // 清空表单
        this.courseInfo = {}
      }
    },
    // 查询所有课程一级分类
    getOneSubject() {
      subject.getSubjectList()
      .then(response => {
        this.subjectOneList = response.data.data
      })
    },

    // 查询所有讲师
    getListTeacher() {
      course.getAllTeacher()
      .then(response => {
        this.teacherList = response.data.items
      })
    },

    // 保存/更新课程基本信息
    saveOrUpdate() {
      // 判断更新还是添加
      if (!this.courseInfo.id) {
        // 添加
        this.addCourse()
      } else {
        // 修改
        this.updateCourse()
      }
    },

    // 一级分类改变时, 改变二级分类的值
    subjectLevelOneChanged(value) {
      // value 就是一级分类的 id 值
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          // 把二级分类 id 清空
          // this.courseInfo.subjectId = ''
        }
      }
    },

    // 上传成功调用的方法
    handleAvatarSuccess(res, file) {
      // console.log(res)// 上传响应
      // console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },
    // 上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image.jpg')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传的文件不是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 根据课程id获取课程信息
    getCourseInfo() {
      course.getCourseInfoById(this.courseId)
      .then(response => {
        this.courseInfo = response.data.courseInfoVo
        // 1. 查询所有分类（一级分类+二级分类）
        subject.getSubjectList()
          .then(response => {
            // 获取所有一级分类
            this.subjectOneList = response.data.data
            // 2. 遍历一级分类
            for (let i = 0; i < this.subjectOneList.length; i++) {
              // 获取每一个一级分类
              var oneSubject = this.subjectOneList[i]
              // 比较当前 courseInfo 里面的一级分类 id 和所有的一级分类 id
              if (this.courseInfo.subjectParentId == oneSubject.id) {
                // 获取一级分类所有的二级分类
                this.subjectTwoList = oneSubject.children
              }
            }
          })
          //初始化所有讲师
          this.getListTeacher()
      })
    },

    // 添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo)
      .then(response => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '添加课程信息成功'
        })
        // 跳转到第二步
         this.$router.push({ path: `/course/chapter/${response.data.courseId}`})
      })
    },

    // 修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
      .then(response => {
        // 提示信息
        this.$message({
          type: 'success',
          message: '成功修改课程信息'
        })
        // 跳转到第二步
         this.$router.push({ path: `/course/chapter/${this.courseId}`})
      })
    }

  }
}
</script>
// scoped：只在当前页面有效
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>