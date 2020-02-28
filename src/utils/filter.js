export function timeFormat(timestamp) {
    let arrTimestamp = (timestamp + '').split('');
    for (let start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = '0';
        }
    }
    timestamp = arrTimestamp.join('') * 1;

    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    //let halfamonth = day * 15;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }

    // 计算差异时间的量级
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;

    // 数值补0方法
    let zero = function (value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    // 使用
    if (monthC > 1) {
        // 超过1月，直接显示年月日
        return (function () {
            let date = new Date(timestamp);
            return date.getFullYear() + '-' + zero(date.getMonth() + 1) + '-' + zero(date.getDate()) + ' ' + zero(date.getHours()) + ':' + zero(date.getMinutes());
        })();
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';
}