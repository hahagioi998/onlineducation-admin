import request from '@/utils/request'

export default {

    /**
     * 讲师列表(条件分页查询)
     * @param {*} current 当前页
     * @param {*} limit 每页记录数
     * @param {*} teacherQuery 条件查询对象
     */
    getTeacherListByPage(current, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // teacherQuery条件对象, 后端使用的是RequestBody获取数据的
            // data 表示把对象转换 json 进行传递到接口里面
            data: teacherQuery
        })
    }

    // 讲师添加

}