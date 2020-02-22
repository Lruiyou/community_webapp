<template>
  <div class="user-box">
    <div class="title-box">
      <h3>
        <span class="user-title">发起人</span>
      </h3>
    </div>
    <div class="user-div">
      <div>
        <div>
          <a-avatar
            shape="square"
            :size="100"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </div>
        <div>
          <h2>作者名</h2>
        </div>
      </div>
      <div class="user-info">
        <a-divider>社交账号</a-divider>
        <a-avatar :size="28" icon="github" class="account" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>


<style lang="less" scoped>
.user-box {
  background-color: #fff;
  margin-left: 0.5rem;
  padding: 0.3rem;
  border-radius: 0.3rem;
  border-bottom: 1px solid #eee;
}

.title-box {
  margin-top: 0.3rem;
  border-bottom: 1px solid rgb(232, 232, 232);
}

.user-title {
  font-size: 16px;
  padding-left: 12px;
  font-weight: 600;
  height: 20px;
  line-height: 20px;
}

.user-div {
  text-align: center;
  padding: 0.4rem;
}
.user-div div {
  margin-bottom: 1rem;
}
.user-info {
  font-size: 0.8rem;
  color: #999;
}
.account {
  background-color: #999;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
</style>