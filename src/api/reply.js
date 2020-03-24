import request from '@/service/request'

export function getReplyById(params) {
    return request({
        url: '/reply/selectOne',
        method: 'get',
        params
    })
}

export function createReply(params) {
    return request({
        url: 'reply',
        method: 'post',
        data: params
    })
}

export function getReplyList(params) {
    return request({
        url: '/reply',
        method: 'get',
        params
    })
}