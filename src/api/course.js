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

    // 5. 课程最终发布确认信息
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get',
        })
    },

    // 6. 课程最终发布
    publishCourse(courseId) {
        return request({
            url: `/eduservice/course/publishCourse/${courseId}`,
            method: 'post',
        })
    },

}