import request from '@/utils/request'
export default {
    // 获取所有 banner
    getPageBanner(page, limit) {
        return request({
            url: `/educms/bannerAdmin/pageBanner/${page}/${limit}`,
            method: 'get'
        })
    },

    // 添加 banner
    addBanner(banner) {
        return request({
            url: `/educms/bannerAdmin/addBanner`,
            method: 'post',
            data: banner
        })
    },

    // 修改 banner
    updateById(banner) {
        return request({
            url: `/educms/bannerAdmin/updateById`,
            method: 'put',
            data: banner
        })
    },

    // 删除 banner
    removeBanner(id) {
        return request({
            url: `/educms/bannerAdmin/removeBanner/${id}`,
            method: 'delete'
        })
    },

    // 查询 banner
    getBannerById(id) {
        return request({
            url: `/educms/bannerAdmin/getBannerById/${id}`,
            method: 'get'
        })
    },

}