import axios from 'axios';

const service = axios.create({
    baseURL: 'http://localhost:8008/',
    timeout: 50000
})

service.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        alert("请求超时，请重试")
    }
})

export default service;