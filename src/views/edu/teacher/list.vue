<template>
    <div class="app-container">
        <!-- 表格 -->
        <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row>
        <el-table-column
            label = "序号"
            width = "70"
            align = "center">
            <template slot-scope = "scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column label="头衔" width="100">
            <template slot-scope="scope">
            {{ scope.row.level === 1 ? '特级讲师' : '高级讲师' }}
            </template>
        </el-table-column>
        <el-table-column prop="intro" label="资历" />
        <el-table-column prop="gmtCreate" label="添加时间" width="180" sortable/>
        <el-table-column prop="sort" label="排序" width="60" />
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
            <router-link :to="'/edu/teacher/edit/'+scope.row.id">
                <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
            </router-link>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
    </div>
</template>
<script>
// 引入 teacher.js 文件
import teacher from '@/api/teacher'

export default {
    // 定义变量和初始值
    data() {
        return {
            list: null, // 接口返回数据集合
            page: 1, // 当前页
            limit: 5, // 每页记录数
            total: 0, // 总记录数
            teacherQuery: {} // 条件封装的对象
        }
    },
    // 页面渲染之前执行, 调用 methods 里面定义的方法
    created() {
        this.getList()
    },
    // 创建具体的方法, 调用 teacher.js 定义的方法
    methods: {
        // 讲师列表的方法
        getList() {
            teacher.getTeacherListByPage(this.page, this.limit, this.teacherQuery)
            // 请求成功
            .then(response => {
                // response: 接口返回的数据
                this.list = response.data.rows
                this.total = response.data.total
            })
            // 请求失败
            .catch(error => {
                console.log(error)
            })
        }

    }

}
</script>