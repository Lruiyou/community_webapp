<template>
  <div>
    <Nav />
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
import { getUserQuestions } from "@/api/question";
export default {
  data() {
    return {
      questionList: [],
      pagination: {
        onChange: page => {
          const {
            query: { uid }
          } = this.$route;
          this.getUserQuestions({
            uid,
            currentPage: page,
            pageSize: 5
          });
        }
      }
    };
  },
  methods: {
    getUserQuestions(payload) {
      getUserQuestions(payload).then(res => {
        if (res && res.data.code === 200) {
          const { questions, page } = res.data.data;
          this.pagination = { ...this.pagination, ...page };
          this.questionList = questions;
        } else if (res && res.data.code === 405) {
          this.$router.push("/");
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  created() {
    const {
      query: { uid }
    } = this.$route;
    this.getUserQuestions({ uid });
  },
  components: {
    Nav
  }
};
</script>

<style lang="less" scoped>
.main {
  margin-top: 0.6rem;
  background-color: #fff;
}
</style>