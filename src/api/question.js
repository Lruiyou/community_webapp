import request from '@/utils/request';

export function publishQuestion(params) {
    return request({
        url: '/question',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: 'post',
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
    })
}

export function getQuestionList(params) {
    return request({
        url: '/question',
        method: 'get',
        params
    })
}

