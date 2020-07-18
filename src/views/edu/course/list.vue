<template>
    <div class="app-container">
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="courseQuery.title" placeholder="课程名称"/>
        </el-form-item>
        <el-form-item>
            <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
            <el-option :value="'Draft'" label="已发布"/>
            <el-option :value="'Normal'" label="未发布"/>
            </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
            <el-date-picker
            v-model="courseQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
        </el-form-item>
        
        <el-form-item>
            <el-date-picker
            v-model="courseQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <!-- 表格 -->
        <el-table
        v-loading="listLoading"
        element-loading-text="数据加载中"
        :data="list"
        border
        fit
        highlight-current-row>
        <el-table-column
            label = "序号"
            width = "60"
            align = "center">
            <template slot-scope = "scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column prop="title" label="课程名称" />
        <el-table-column label="课程状态" >
            <template slot-scope="scope">
            {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
            </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" sortable/>
        <el-table-column prop="lessonNum" label="总课时" sortable/>
        <el-table-column prop="viewCount" label="浏览数量" sortable/>
        <el-table-column prop="gmtCreate" label="添加时间" width="180" sortable />
        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
            <router-link :to="'/course/info/' + scope.row.id">
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
            </router-link>
            <router-link :to="'/course/chapter/' + scope.row.id">
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
            </router-link>
            <el-button type="text" style="color: #F56C6C" size="mini" icon="el-icon-delete" @click="removeTeacherById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            background
            :current-page="page"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="getList" />
    </div>
</template>
<script>
// 引入 course.js 文件
import course from '@/api/course'

export default {
    // 定义变量和初始值
    data() {
        return {
            listLoading: true,
            list: null, // 接口返回数据集合
            page: 1, // 当前页
            limit: 5, // 每页记录数
            total: 0, // 总记录数
            courseQuery: {} // 条件封装的对象
        }
    },
    // 页面渲染之前执行, 调用 methods 里面定义的方法
    created() {
        this.getList()
    },
    // 创建具体的方法, 调用 teacher.js 定义的方法
    methods: {
        // 清空表单数据
        resetData() {
            this.courseQuery = {}
            this.getList()
        },
        // 讲师列表的方法
        getList(page = 1) {
            this.page = page
            course.pageCourseCondition(this.page, this.limit, this.courseQuery)
            // 请求成功
            .then(response => {
                // response: 接口返回的数据
                this.list = response.data.rows
                this.total = response.data.total
                this.listLoading = false
            })
        },
        // 讲师删除
        removeTeacherById(id) {
            this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // 消息类型，用于显示图标
                type: 'warning',
                // 是否使用圆角按钮
                roundButton: false
            }).then(() => {
                // 调用删除方法
                teacher.deleteTeacherById(id)
                .then(response => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                     });
                    this.getList()
                })
                .catch(error => {
                    console.log(error)
                })
                
            })
            
        }

    }

}
</script>