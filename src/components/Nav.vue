<template>
  <div>
    <a-affix :offsetTop="0">
      <div class="header">
        <a-row type="flex" justify="center">
          <a-col :xs="6" :sm="5" :md="5" :lg="5" :xl="5">
            <span class="header-logo" style="cursor:pointer">Coder论坛</span>
          </a-col>
          <a-col :xs="0" :sm="0" :md="10" :lg="8" :xl="8">
            <a-input-search
              style="width:300px"
              placeholder="在这里搜索话题"
              @search="onSearch"
              @change="onChange"
              :defaultValue="inputValue"
            />
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
              <a-menu-item key="notification" v-if="userInfo !== null">
                <a-icon type="notification" />
                <a-badge dot>
                  <span>通知</span>
                </a-badge>
              </a-menu-item>
              <a-sub-menu key="sub1">
                <span slot="title" v-if="userInfo === null">
                  <a-icon type="login" />登录
                </span>
                <span slot="title" v-if="userInfo !== null">
                  <!-- <a-avatar :src="userInfo.avatarUrl" shape="square" style="margin-bottom:0.7rem" /> -->
                  <img
                    :src="userInfo.avatarUrl"
                    height="28px"
                    width="28px"
                    style="margin-bottom:0.7rem;border-radius:2px"
                  />
                </span>
                <a-menu-item key="login" v-if="userInfo == null">
                  <div @click="handleOAuth">
                    <a-icon type="github" />
                    <span style="margin-left:8px">Github登录</span>
                  </div>
                </a-menu-item>
                <a-menu-item key="my-publish" v-if="userInfo !== null">
                  <div>
                    <router-link :to="{path:'/publish',query:{type:'create'}}">
                      <a-icon type="form" />
                      <span style="margin-left:8px">发布问题</span>
                    </router-link>
                  </div>
                </a-menu-item>
                <a-menu-item key="my-question" v-if="userInfo !== null">
                  <div>
                    <a-icon type="profile" />
                    <span style="margin-left:8px">我的提问</span>
                  </div>
                </a-menu-item>
                <a-menu-item key="logout" v-if="userInfo !== null">
                  <div @click="handleLogout">
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
  </div>
</template>

<script>
import { isExitCookie, removeCookie, getCookie } from "../utils/cookieUtils";
import { OAuth_URL } from "../global/githubConfig";
import randomCode from "../utils/randomCode";
import { getUser } from "../api/user";
// import userStore from "../global/userStore";
export default {
  props: {
    path: {
      type: String
    }
  },
  data() {
    return {
      userInfo: null,
      inputValue: null
    };
  },
  methods: {
    handleOAuth() {
      const state = randomCode(16);
      window.location.href = OAuth_URL + `&state=${state}+${this.path}`;
    },
    handleLogout() {
      removeCookie("token");
      sessionStorage.removeItem("user");
      this.userInfo = null;
      this.$store.commit("removeUser");
      const url = window.location.href;
      if (url.indexOf("publish") != -1) {
        this.$router.push("/");
      }
      if (url.indexOf("question") != -1) {
        this.$emit("clearevent");
      }
    },
    onSearch(value) {
      let filterValue = null;
      if (!value) {
        return;
      }
      if (value.indexOf("\\") != -1) {
        filterValue = value.replace(/\\/g, "");
      } else {
        filterValue = value;
      }
      if (this.$route.name === "Search") {
        //子组件传值给父组件
        this.$emit("navevent", filterValue);
      }
      sessionStorage.setItem("keyword", filterValue);
      this.$router.push({ name: "Search", query: { keyword: filterValue } });
    },
    onChange(e) {
      sessionStorage.setItem("keyword", e.target.value);
    }
  },
  created() {
    const keyword = sessionStorage.getItem("keyword");
    if (keyword) {
      this.inputValue = keyword;
    }
    if (!isExitCookie("token")) {
      this.userInfo = null;
    } else {
      const cookie = getCookie("token");
      getUser({ token: cookie }).then(res => {
        if (res.data.code === 200) {
          this.userInfo = res.data.data;
          sessionStorage.setItem("user", JSON.stringify(res.data.data)); //保存用户id
          this.$store.commit({
            type: "updateUser",
            userInfo: res.data.data
          });
        }
      });
    }
  }
  //   handleLogout() {
  //     removeCookie("token");
  //     userStore.removeUserInfo();
  //     this.userInfo = null;
  //     const url = window.location.href;
  //     if (url.indexOf("publish") != -1) {
  //       this.$router.push("/");
  //     }
  //   }
  // },
  // created() {
  //   if (!isExitCookie("token")) {
  //     this.userInfo = null;
  //     userStore.removeUserInfo();
  //   } else {
  //     const user = userStore.getUserInfo();
  //     if (user == null) {
  //       const cookie = getCookie("token");
  //       getUser({ token: cookie }).then(res => {
  //         if (res.data.code === 200) {
  //           this.userInfo = res.data.data;
  //           userStore.saveUserInfo(this.userInfo);
  //         }
  //       });
  //     } else {
  //       this.userInfo = user;
  //     }
  //   }
};
</script>

<style lang="less" scoped>
</style>