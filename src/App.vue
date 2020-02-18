<template>
  <div id="app">
    <a-affix :offsetTop="0">
      <div class="header">
        <a-row type="flex" justify="center">
          <a-col :xs="6" :sm="5" :md="5" :lg="5" :xl="5">
            <span class="header-logo">Coder论坛</span>
          </a-col>
          <a-col :xs="0" :sm="0" :md="10" :lg="8" :xl="8">
            <a-input-search style="width:300px" placeholder="在这里搜索话题" />
          </a-col>
          <a-col :xs="14" :sm="14" :md="6" :lg="6" :xl="6">
            <a-menu mode="horizontal">
              <a-menu-item key="home">
                <div>
                  <router-link to="/">
                    <a-icon type="home" />
                    <span>首页</span>
                  </router-link>
                </div>
              </a-menu-item>
              <a-menu-item key="notification">
                <a-icon type="notification" />
                <a-badge dot>
                  <span>通知</span>
                </a-badge>
              </a-menu-item>
              <a-sub-menu key="sub1">
                <span slot="title">
                  <!-- <a-icon type="login" />
                  <span>登录</span>-->
                  <a-avatar
                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    style="margin-bottom:0.7rem"
                  />
                </span>
                <a-menu-item key="my-publish">
                  <div>
                    <router-link to="/publish">
                      <a-icon type="form" />
                      <span style="margin-left:8px">发布问题</span>
                    </router-link>
                  </div>
                </a-menu-item>
                <a-menu-item key="my-question">
                  <div>
                    <a-icon type="profile" />
                    <span style="margin-left:8px">我的提问</span>
                  </div>
                </a-menu-item>
                <a-menu-item key="logout">
                  <!-- <div>
                    <a-icon type="github" />
                    <span style="margin-left:8px">Github登录</span>
                  </div> -->
                  <div>
                    <a-icon type="logout" />
                    <span style="margin-left:8px">退出登录</span>
                  </div>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-col>
        </a-row>
      </div>
    </a-affix>
    <router-link to="/"></router-link>
    <router-view></router-view>
  </div>
</template>


<script>
export default {};
</script>

<style lang="less">
.header {
  background-color: #fff;
  padding: 0.5rem;
  overflow: hidden;
  height: 3.2rem;
  border-bottom: 1px solid #cccccc;
}

.header-logo {
  color: #1e90ff;
  font-size: 1.4rem;
  text-align: left;
}

.router-link-active {
  color: rgb(89, 89, 89);
  text-decoration: none;
}

a {
  color: rgb(89, 89, 89);
  text-decoration: none;
}
</style>
