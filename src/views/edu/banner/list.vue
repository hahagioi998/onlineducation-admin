<template>
    <div class="app-container">
        <!-- 表格 -->
        <el-table
        v-loading="listLoading"
        element-loading-text="数据加载中..."
        :data="list"
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
        <el-table-column prop="title" label="标题" width="120" />
        <el-table-column prop="imageUrl" label="图片地址" show-overflow-tooltip=true />
        <el-table-column prop="gmtCreate" label="添加时间" width="180" sortable/>
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
            <router-link :to="'/banner/edit/' + scope.row.id">
                <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
            </router-link>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeTeacherById(scope.row.id)">删除</el-button>
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
// 引入 banner.js 文件
import banner from '@/api/banner'

export default {
    // 定义变量和初始值
    data() {
        return {
            listLoading: true,
            list: null, // 接口返回数据集合
            page: 1, // 当前页
            limit: 3, // 每页记录数
            total: 0, // 总记录数
        }
    },
    // 页面渲染之前执行, 调用 methods 里面定义的方法
    created() {
        this.getList()
    },
    // 创建具体的方法, 调用 banner.js 定义的方法
    methods: {
        // 清空表单数据
        resetData() {
            this.getList()
        },
        // 讲师列表的方法
        getList(page = 1) {
            this.page = page
            banner.getPageBanner(this.page, this.limit)
            // 请求成功
            .then(response => {
                // response: 接口返回的数据
                this.list = response.data.items
                this.total = response.data.total
                this.listLoading = false
            })
        },
        // 讲师删除
        removeTeacherById(id) {
            // this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     // 消息类型，用于显示图标
            //     type: 'warning',
            //     // 是否使用圆角按钮
            //     roundButton: false
            // }).then(() => {
            //     // 调用删除方法
            //     teacher.deleteTeacherById(id)
            //     .then(response => {
            //         // 提示信息
            //         this.$message({
            //             type: 'success',
            //             message: '删除成功!'
            //          });
            //         this.getList()
            //     })
            //     .catch(error => {
            //         console.log(error)
            //     })
                
            // })


            
        }

    }

}
</script>