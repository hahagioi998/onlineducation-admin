<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
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
      <!-- 讲师头像：TODO -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 引入 teacher.js 文件
import teacherApi from '@/api/teacher'

export default {
    // 定义变量和初始值
    data() {
        return {
            teacher: {},
            saveBtnDisabled: false // 保证按钮是否禁用
        }
    },
    // 页面渲染之前执行, 调用 methods 里面定义的方法
    created() {
        // 判断路径中是否有 id 值
        if (this.$route.params && this.$route.params.id) {
            // 从路径中获取 id 值
            const id = this.$route.params.id
            this.getTeacherById(id)
        }
    },
    // 创建具体的方法, 调用 teacher.js 定义的方法
    methods: {
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
                this.$router.push({path: '/teacher/table'})
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
        }
    }
}
</script>