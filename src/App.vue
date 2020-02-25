<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-view></router-view>
  </div>
</template>


<script>
export default {
  data() {
    return {
      loginUri: true,
      preventHref: null //保存授权前的页面链接
    };
  },
  methods: {}
};
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
