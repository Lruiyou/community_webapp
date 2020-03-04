export default function findImgSrc(htmlstr) {
    let srcArr = []
    let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
    let srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
    let imgArr = htmlstr.match(imgReg);
    imgArr.forEach(item => {
        let src = item.match(srcReg);
        srcArr.push(src[1]);
    })
    return srcArr;
}