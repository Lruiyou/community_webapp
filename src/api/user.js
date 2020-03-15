import request from '@/service/request';

export function getUser(params) {
    return request({
        url: '/user',
        method: 'get',
        params
    })
}

