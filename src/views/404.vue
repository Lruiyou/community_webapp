<template>
  <div class="content">
    <a-row type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14">
        <img src="../assets/404.jpg" width="100%" height="100%" />
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" style="margin-top:1.5rem">
      <span class="back" @click="back">&lt;&lt;返回首页</span>
    </a-row>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.push("/");
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  margin: 20px;
}

.back {
  color: rgba(22, 190, 64, 0.89);
  cursor: pointer;
}
</style>

