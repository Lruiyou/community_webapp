import request from '@/service/request';

export function publishQuestion(params) {//发布问题
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

export function editQuestion(params) { //编辑问题
    return request({
        url: '/question/edit',
        method: 'put',
        params,
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
        url: '/question/details',
        method: 'get',
        params
    })
}


export function getThumbupStatus(params) {//获取用户点赞状态
    return request({
        url: '/question/thumbup',
        method: 'get',
        params,
    })
}

export function thumbUp(params) {//用户点赞操作
    return request({
        url: '/question/thumbup',
        method: 'put',
        params
    })
}

export function getRelativeQuestions(params) {
    return request({
        url: '/question/relation',
        method: 'get',
        params
    })
}

