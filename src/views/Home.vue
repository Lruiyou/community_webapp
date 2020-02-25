<template>
  <div class="home">
    <Nav />
    <a-row class="common-main" type="flex" justify="center">
      <a-col class="common-left" :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <a-list itemLayout="vertical" size="large" :pagination="pagination" :dataSource="listData">
          <a-list-item slot="renderItem" slot-scope="item" key="item.title">
            <template slot="actions" v-for="{type, text} in actions">
              <span v-if="type==='发布时间'" :key="type">
                <span style="margin-right: 8px">{{type}}</span>
                <span>{{text}}</span>
              </span>
              <span :key="type" v-else>
                <a-icon :type="type" style="margin-right: 8px" />
                {{text}}
              </span>
            </template>
            <!-- <img
              slot="extra"
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />-->
            <a-list-item-meta>
              <router-link slot="title" to="/question">{{item.title}}</router-link>
              <a-avatar slot="avatar" :src="item.avatar" />
            </a-list-item-meta>
            {{item.content}}
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :xs="0" :sm="0" :md="5" :lg="5" :xl="5">
        <div class="divBox">
          <h3 class="hotTitle">
            <span>热门话题</span>
          </h3>
          <div class="hotBox">
            <div class="hotText">
              <a class="hotLink" style="color:rgb(64, 64, 64)">特别别的特别的特别的</a>
            </div>
            <div class="hot">
              <a-icon type="fire" style="margin-right:5px" />
              <span style="margin-right:3px">2113</span>热度
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
// @ is an alias to /src

let moment = require("moment");
const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    href: "/",
    title: `ant design vue part ${i}`,
    avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently."
  });
}
export default {
  name: "Home",
  components: {
    Nav
  },
  data() {
    return {
      listData,
      pagination: {
        onChange: page => {
          console.log(page);
        },
        pageSize: 5
      },
      actions: [
        { type: "like-o", text: "156" },
        { type: "message", text: "2" },
        { type: "eye", text: "7" },
        {
          type: "发布时间",
          text: moment(new Date().getTime()).format("YYYY-MM-DD HH:mm")
        }
      ]
    };
  },
  created() {}
};
</script>

<style lang="less" scoped>
.divBox {
  /* padding: 16px; */
  background-color: #fff;
  margin-left: 0.5rem;
  padding: 0.8rem;
  border-radius: 0.3rem;
  border-bottom: 1px solid #eee;
}

.hotTitle {
  font-size: 16px;
  padding-left: 6px;
  height: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #ec7259;
  font-size: 18px;
  font-weight: 500;
  height: 20px;
  line-height: 20px;
}

.hotBox {
  margin-bottom: 12px;
}

.hotText {
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hotLink {
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
}

.hotLink:hover {
  text-decoration: underline;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
}

.hot {
  font-size: 14px;
  color: #969696;
}
</style>
