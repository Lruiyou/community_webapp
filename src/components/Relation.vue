<template>
  <div class="relation-box">
    <div class="title-box">
      <h3>
        <span class="relation-title">相关问题</span>
      </h3>
    </div>
    <div>
      <a class="a-item" target="_blank" href="http://www.baidu.com">
        <div class="entry-title">京东 PC 首页 2019 改版前端总</div>
        <div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg" class="icon" />
            <span class="count">729</span>
          </div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/comment.a7c8341.svg" class="icon" />
            <span class="count">729</span>
          </div>
        </div>
      </a>

      <a class="a-item" target="_blank" href="http://www.baidu.com">
        <div class="entry-title">京东 PC 首页 2019 改版前端总</div>
        <div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg" class="icon" />
            <span class="count">729</span>
          </div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/comment.a7c8341.svg" class="icon" />
            <span class="count">729</span>
          </div>
        </div>
      </a>

      <a class="a-item" target="_blank" href="http://www.baidu.com">
        <div class="entry-title">京东 PC 首页 2019 改版前端总</div>
        <div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg" class="icon" />
            <span class="count">729</span>
          </div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/comment.a7c8341.svg" class="icon" />
            <span class="count">729</span>
          </div>
        </div>
      </a>

      <a class="a-item" target="_blank" href="http://www.baidu.com">
        <div class="entry-title">京东 PC 首页 2019 改版前端总</div>
        <div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg" class="icon" />
            <span class="count">729</span>
          </div>
          <div class="entry-meta">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/comment.a7c8341.svg" class="icon" />
            <span class="count">729</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>


<script>
export default {
  name: "Relation"
};
</script>


<style lang="less" scoped>
.relation-box {
  background-color: #fff;
  margin-left: 0.5rem;
  padding: 0.3rem 0 0 0;
  border-radius: 0.3rem;
  border-bottom: 1px solid #eee;
}

.title-box {
  margin-top: 0.3rem;
  border-bottom: 1px solid rgb(232, 232, 232);
}

.relation-title {
  font-size: 16px;
  padding-left: 12px;
  font-weight: 600;
  height: 20px;
  line-height: 20px;
}

a {
  color: #909090;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  background-color: rgb(252, 252, 252);
}

.a-item {
  background-color: transparent;
  display: block;
  padding: 0.4rem 0.8rem;
}

.entry-title {
  color: #333;
}

.entry-meta {
  display: inline-block;
  margin-right: 1.5rem;
  font-size: 1.1rem;
  color: #c2c2c2;
}

/* .icon{
    vertical-align: sub;
} */

.count {
  font-size: 14px;
  margin-left: 0.2rem;
}
</style>