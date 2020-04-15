import request from '@/service/request';

export function getNotificationCounts(params) {
    return request({
        url: '/notification/unread/counts',
        method: 'get',
        params
    })
}

export function getNotificationList(params) {
    return request({
        url: '/notification/unread/list',
        method: 'get',
        params
    })
}

export function updateNotificationStatus(params) {
    return request({
        url: '/notification/status',
        method: 'put',
        params
    })
}

export function deleteNotification(params) {
    return request({
        url: '/notification/delete',
        method: 'put',
        params
    })
}