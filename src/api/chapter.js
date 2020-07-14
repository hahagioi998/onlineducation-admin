import request from '@/utils/request'
export default {
    // 1. 根据课程 id 获取章节和小节数据列表
    getAllChapterVideo(courseId) {
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },

    // 2. 添加章节
    addChapter(chapter) {
        return request({
            url: `/eduservice/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },

    // 3. 根据 id 查询章节
    getChapter(courseId) {
        return request({
            url: `/eduservice/chapter/getChapterInfo/${courseId}`,
            method: 'get'
        })
    },

    // 4. 修改章节信息
    updateChapter(chapter) {
        return request({
            url: `/eduservice/chapter/updateChapter`,
            method: 'post',
            data: chapter
        })
    },

    // 5. 删除章节
    deleteChapter(chapterId) {
        return request({
            url: `/eduservice/chapter/deleteChapter/${chapterId}`,
            method: 'delete'
        })
    },

}