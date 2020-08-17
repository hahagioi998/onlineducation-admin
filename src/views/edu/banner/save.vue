<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="图片标题">
        <el-input v-model="banner.title"/>
      </el-form-item>
      <el-form-item label="图片地址">
        <el-input v-model="banner.imageUrl" :disabled="true" />
      </el-form-item>
      <el-form-item label="图片排序">
        <el-input-number v-model="banner.sort" controls-position="right" :min="0"/>
      </el-form-item>

      <el-form-item label="图片上传">
        <el-upload
            :action="BASE_API + '/eduoss/fileoss'"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>

      <!-- <el-form-item>
          <el-row>
            <el-button type="primary" v-if='isShow1' >主要按钮11</el-button>
            <el-button type="primary" v-if='isShow2' >主要按钮22</el-button>
            </el-row>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
// 引入 banner.js 文件
import banner from '@/api/banner'

export default {
    // 定义变量和初始值
    data() {
        return {
            // isShow1: false,
            // isShow2: true,

            banner: {},
            BASE_API: process.env.BASE_API, // 获取dev.env.js里面的地址
            saveBtnDisabled: false // 保证按钮是否禁用
        }
    },
    // 页面渲染之前执行, 调用 methods 里面定义的方法
    created() {
        this.init()
    },
    // 监听
    watch: {
        // 路由变化的方式, 路由发生变化, 就会执行
        $route(to, from) {
            this.init()
        }
    },

    // 创建具体的方法, 调用 teacher.js 定义的方法
    methods: {
      // 初始化
      init() {
        // 判断路径中是否有 id 值, 有表示修改
        if (this.$route.params && this.$route.params.id) {
          // 从路径中获取 id 值
          const id = this.$route.params.id
          this.getTeacherById(id)
        } else {
          // 没有表示添加
          this.teacher = {
            avatar: process.env.OSS_HEADIMG
          }
        }
      },

      // 添加或修改
      saveOrUpdate() {
        // 判断是修改还是添加, teacher 对象中是否有 id
        if (!this.teacher.id) {
          // 添加
          this.saveTeacher()
        } else {
          // 修改
          this.updateTeacherInfo()
        }
      },
      // 讲师添加的方法
      saveTeacher() {
        // teacherApi.addTeacher(this.teacher)
        // .then(response => {
        //   // 提示信息
        //   this.$message({
        //     type: 'success',
        //     message: '添加成功!'
        //   });
        //   // 回到列表页面, 路由跳转
        //   this.$router.push({path: '/teacher/tree'})
        // })
      },

      // 讲师修改的方法
      updateTeacherInfo() {
        // teacherApi.updateTeacher(this.teacher)
        // .then(response => {
        //   // 提示信息
        //   this.$message({
        //     type: 'success',
        //     message: '修改成功!'
        //   });
        //   // 回到列表页面, 路由跳转
        //   this.$router.push({path: '/teacher/table'})
        // })
      },
      
      // 根据讲师 id 获取讲师信息
      getTeacherById(id) {
        // teacherApi.getTeacherInfo(id)
        // .then(response => {
        //     this.teacher = response.data.teacher
        // })
      },
      
      // 关闭上传弹窗
    //   close() {
    //     this.imagecropperShow = false
    //     // 上传组件初始化
    //     this.imagecropperKey = this.imagecropperKey + 1
    //   },

    //   // 上传成功的方法
    //   cropSuccess(data) {
    //     this.imagecropperShow = false
    //     // 上传之后返回图片 url
    //     this.teacher.avatar = data.url
    //     this.imagecropperKey = this.imagecropperKey + 1
    //   }

    }
}
</script>