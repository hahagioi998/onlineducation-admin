<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="特级讲师"/>
          <el-option :value="2" label="高级讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
      <!-- 头衔缩略图 -->
      <pan-thumb :image="teacher.avatar+''"/>
      <!-- 文件上传按钮 -->
      <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
      </el-button>
      <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调
      -->
      <image-cropper
        v-show="imagecropperShow"
        :width="300"
        :height="300"
        :key="imagecropperKey"
        :url="BASE_API+'/eduoss/fileoss'"
        field="file"
        @close="close"
        @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
// 引入 teacher.js 文件
import teacherApi from '@/api/teacher'

export default {
    components: {ImageCropper, PanThumb},
    // 定义变量和初始值
    data() {
        return {
            teacher: {},
            imagecropperShow: false, // 上传弹窗组件是否显示
            imagecropperKey: 0, // 上传组件key值
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
            avatar: 'https://online-education-headimg.oss-cn-beijing.aliyuncs.com/public/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F%20.png'
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
        teacherApi.addTeacher(this.teacher)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          // 回到列表页面, 路由跳转
          this.$router.push({path: '/teacher/tree'})
        })
      },

      // 讲师修改的方法
      updateTeacherInfo() {
        teacherApi.updateTeacher(this.teacher)
        .then(response => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          // 回到列表页面, 路由跳转
          this.$router.push({path: '/teacher/table'})
        })
      },
      
      // 根据讲师 id 获取讲师信息
      getTeacherById(id) {
        teacherApi.getTeacherInfo(id)
        .then(response => {
            this.teacher = response.data.teacher
        })
      },
      
      // 关闭上传弹窗
      close() {
        this.imagecropperShow = false
        // 上传组件初始化
        this.imagecropperKey = this.imagecropperKey + 1
      },

      // 上传成功的方法
      cropSuccess(data) {
        this.imagecropperShow = false
        // 上传之后返回图片 url
        this.teacher.avatar = data.url
        this.imagecropperKey = this.imagecropperKey + 1
      }

    }
}
</script>