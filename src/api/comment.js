import request from '@/service/request'

export function getCommentById(params) {
    return request({
        url: '/comment/selectOne',
        method: 'get',
        params
    })
}

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

export function deleteComment(params) {
    return request({
        url: '/comment/delete',
        method: 'put',
        params
    })
}

