<template>
  <div>
    <Nav :path="path" />
    <a-row class="common-main" type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <a-list
          class="common-left"
          itemLayout="vertical"
          size="large"
          :dataSource="questionList"
          :pagination="pagination"
        >
          <a-list-item slot="renderItem" slot-scope="item" key="item.id" style="margin-left:8px;">
            <template slot="actions">
              <span key="like-o">
                <a-icon type="like-o" style="margin-right: 8px" />
                {{item.likeCount}}
              </span>
              <span key="message">
                <a-icon type="message" style="margin-right: 8px" />
                {{item.commentCount}}
              </span>
              <span key="eye">
                <a-icon type="eye" style="margin-right: 8px" />
                {{item.viewCount}}
              </span>
              <span key="time">
                <span style="margin-right: 8px">{{item.createTime | timeFormat}}</span>
              </span>
            </template>
            <a-list-item-meta>
              <router-link slot="title" :to="'/question/'+item.id">{{item.title}}</router-link>
              <img
                slot="avatar"
                :src="item.avatar"
                height="30px"
                width="30px"
                style="border-radius:2px"
              />
            </a-list-item-meta>
            <div style="word-break:break-word">{{item.content}}</div>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :xs="0" :sm="0" :md="5" :lg="5" :xl="5">
        <a-affix :offsetTop="5">
          <div class="divBox">
            <h3 class="hotTitle">
              <span>热门话题</span>
            </h3>
            <div v-if="hotTopics.length === 0" class="no-data">
              <span>暂无数据</span>
            </div>
            <div class="hotBox" v-for="item in hotTopics" :key="item.id">
              <div class="hotText">
                <router-link
                  class="hotLink"
                  style="color:rgb(64, 64, 64)"
                  :to="'/question/'+item.id"
                >{{item.title}}</router-link>
              </div>
              <div class="hot">
                <a-icon type="fire" style="margin-right:5px" />
                <span style="margin-right:3px">{{item.heat}}</span>热度
              </div>
            </div>
          </div>
        </a-affix>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getQuestionList, getHotTopic } from "../api/question";
// @ is an alias to /src

// let moment = require("moment");
export default {
  name: "Home",
  components: {
    Nav
  },
  data() {
    return {
      path: null,
      questionList: [],
      hotTopics: [],
      pagination: {
        onChange: page => {
          this.getQuestions({
            currentPage: page,
            pageSize: 5
          });
        }
      }
    };
  },
  methods: {
    getQuestions(payload) {
      getQuestionList(payload).then(res => {
        if (res && res.data.code === 200) {
          const { questions, page } = res.data.data;
          this.pagination = { ...this.pagination, ...page };
          this.questionList = questions;
        }
      });
    },
    getHotTopic() {
      getHotTopic().then(res => {
        if (res && res.data.code === 200) {
          this.hotTopics = res.data.data;
        }
      });
    }
  },
  created() {
    this.path = this.$route.path;
    this.getQuestions({
      currentPage: 1,
      pageSize: 5
    });
    this.getHotTopic();
  }
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

.no-data {
  text-align: center;
  height: 100px;
  padding-top: 40px;
  border: 1px solid rgb(230, 230, 230);
}
</style>
