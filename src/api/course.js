import request from '@/utils/request'
export default {
    // 1. 添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/addCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },

    // 2. 获取所有讲师
    getAllTeacher() {
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get'
        })
    },

    // 3. 获取课程基本信息 by 课程 id
    getCourseInfoById(id) {
        return request({
            url: `/eduservice/course/getCourseInfo/${id}`,
            method: 'get'
        })
    },

    // 4. 修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url: '/eduservice/course/updateCourseInfo',
            method: 'post',
            data: courseInfo,
        })
    },

}