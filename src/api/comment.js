import request from '@/service/request'

export function getCommentList(params) {
    return request({
        url: '/comment',
        method: 'get',
        params
    })
}

export function createComment(params) {
    return request({
        url: '/comment',
        method: 'post',
        data: params,
    })
}

