<template>
  <div>
    <Nav @navevent="getKeyword" />
    <a-row type="flex" justify="center">
      <a-col class="main" :xs="24" :sm="24" :md="18" :lg="16" :xl="14">
        <a-list
          itemLayout="vertical"
          size="large"
          :dataSource="questionList"
          :pagination="pagination"
        >
          <a-list-item slot="renderItem" slot-scope="item" key="item.id" style="margin-left:8px">
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
            {{item.content}}
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { getQuestionList } from "../api/question";
export default {
  name: "Search",
  components: {
    Nav
  },
  data() {
    return {
      questionList: [],
      pagination: {
        onChange: page => {
          this.getQuestions({
            currentPage: page,
            pageSize: 5,
            search: sessionStorage.getItem("keyword")
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
    getKeyword(value) {
      this.getQuestions({
        currentPage: 1,
        pageSize: 5,
        search: value
      });
    }
  },
  created() {
    if (this.$route.query && this.$route.query.keyword) {
      this.getQuestions({
        currentPage: 1,
        pageSize: 5,
        search: this.$route.query.keyword
      });
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  margin-top: 0.6rem;
  background-color: #fff;
}
</style>