import request from '@/utils/request';

export function getUser(params) {
    return request({
        url: '/user',
        method: 'get',
        params
    })
}

