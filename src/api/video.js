import request from '@/utils/request'
export default {

    // 1. 添加课时
    addVideo(video) {
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
        })
    },

    // 2. 删除课时
    deleteVideo(id) {
        return request({
            url: `/eduservice/video/deleteVideo/${id}`,
            method: 'delete'
        })
    },

    // 3. 修改课时信息
    updateVideo(video) {
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data: video
        })
    },

    // 4. 根据 id 查询小节
    getVideoInfo(id) {
        return request({
            url: `/eduservice/video/getVideoInfo/${id}`,
            method: 'get'
        })
    },


}