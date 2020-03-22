import request from '@/service/request';

export function getNotificationCounts(params) {
    return request({
        url: '/notification/unread/counts',
        method: 'get',
        params
    })
}

export function getUnreadNotificationList(params) {
    return request({
        url: '/notification/unread/list',
        method: 'get',
        params
    })
}