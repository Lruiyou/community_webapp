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

export function getQuestionList(params) {//首页获取问题列表
    return request({
        url: '/question',
        method: 'get',
        params
    })
}


export function getHotTopic() { //获取热门话题
    return request({
        url: '/question/hot',
        method: 'get',
    })
}

export function getQuestionDetails(params) { //获取问题详情
    return request({
        url: '',
        method: 'get',
        params
    })
}

