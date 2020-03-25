<template>
  <div class="home">
    <Nav :path="path" @clearevent="clearUser" />
    <a-row class="common-main" type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="14">
        <a-card>
          <div slot="title">
            <div>
              <span style="font-size:17px">{{questionInfo.title}}</span>
            </div>
            <div class="edit">
              <span style="margin-right:5px">发布于</span>
              {{questionInfo.createTime}}
            </div>
          </div>
          <div class="content-image" v-html="questionInfo.htmlContent"></div>
          <div class="tag-div">
            <div class="tags">
              <a-tag v-for="(item,index) in questionInfo.tag" :key="index">{{item}}</a-tag>
            </div>
            <div class="icon-div">
              <span class="space">
                <a-icon
                  type="like"
                  :theme="like === 1 ? 'filled' : 'outlined'"
                  style="margin-right:6px"
                  @click="handleThumbUp"
                />
                {{like_count}}
              </span>
              <span class="space">
                <a-icon type="eye" style="margin-right:6px" />
                {{questionInfo.viewCount}}
              </span>
              <span
                class="space"
                style="cursor:pointer"
                @click="handleEdit"
                v-if="login_user != null && questionInfo.creatorId == login_user.accountId"
              >
                <a-icon type="edit" style="margin-right:6px" />编辑
              </span>
            </div>
          </div>
          <div>
            <div class="reply">
              <h3>{{questionInfo.commentCount}}条评论</h3>
            </div>
            <!-- 问题的回复框 -->
            <div>
              <a-comment>
                <!-- <a-avatar slot="avatar" :src="login_user.avatarUrl" alt="Han Solo" /> -->
                <a-avatar slot="avatar" v-if="login_user == null" icon="user" />
                <img slot="avatar" v-else :src="login_user.avatarUrl" />
                <div slot="content">
                  <a-form-item>
                    <a-textarea
                      :rows="4"
                      v-model="commentContent"
                      placeholder="写下你的评论..."
                      :autosize="textSize"
                    ></a-textarea>
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      htmlType="submit"
                      shape="round"
                      :loading="submitting"
                      @click="handleSubmit"
                      type="primary"
                    >确定</a-button>
                    <a-button
                      style="margin-left:8px"
                      shape="round"
                      type="default"
                      @click="handleCancel"
                    >取消</a-button>
                  </a-form-item>
                </div>
              </a-comment>
            </div>
            <!-- 无评论时显示 -->
            <div v-if="questionInfo.commentCount == 0" class="no-commont-text">
              <h3>还没有人评论，快来抢占沙发</h3>
            </div>

            <!-- 评论区 :有评论时显示-->
            <Comment
              :commentData="commentData"
              v-if="questionInfo.commentCount > 0"
              @pageChangeFunc="handlePageChange"
            />

            <!-- 分页 -->
            <!-- <div class="pagination-div">
              <el-pagination small background layout="prev, pager, next" :total="1000"></el-pagination>
            </div>-->
          </div>
        </a-card>
      </a-col>
      <a-col :xs="0" :sm="0" :md="0" :lg="5" :xl="5">
        <div>
          <User :userData="user" />
        </div>
        <div style="margin-top:20px">
          <Relation :relation="relativeList" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import User from "@/components/User.vue";
import Relation from "@/components/Relation.vue";
import Nav from "@/components/Nav.vue";
import Comment from "@/components/Comment.vue";
import { getUser } from "../api/user";
import { getCookie, isExitCookie } from "../utils/cookieUtils";
import {
  getQuestionDetails,
  getThumbupStatus,
  thumbUp,
  getRelativeQuestions
} from "@/api/question.js";
import { getCommentList, createComment } from "../api/comment";
import { getReplyList } from "../api/reply";
//import * as CommentData from "../mock/mockdata";

let moment = require("moment");
export default {
  name: "Question",
  data() {
    return {
      textSize: { minRows: 4, maxRows: 6 },
      commentData: {}, //评论组件
      relativeList: [],
      path: null,
      questionInfo: {},
      user: null,
      like: 0,
      like_count: 0,
      login_user: null,
      commentContent: "", //评论框内容
      submitting: false
    };
  },
  watch: {
    $route(to) {
      this.like = 0;
      const {
        params: { id }
      } = to;
      let user = this.$store.state.userInfo;
      if (user) {
        this.login_user = user;
      } else {
        const cookie = getCookie("token");
        getUser({ token: cookie }).then(res => {
          if (res.data.code === 200) {
            this.login_user = res.data.data;
            this.$store.commit({
              type: "updateUser",
              userInfo: res.data.data
            });
          }
        });
      }
      this.getQuestionDetails({
        question_id: id,
        type: "details"
      });
      this.getRelated({
        question_id: id
      });
      this.getCommentList({
        question_id: id
      });
    }
  },
  methods: {
    /**
     * 点击编辑按钮,编辑问题
     */
    handleEdit() {
      //拿到问题的id
      const {
        params: { id }
      } = this.$route;
      this.$router.push({
        name: "Publish",
        query: { question_id: id, type: "edit" }
      });
    },
    /**
     * 获取回复列表
     */
    getReplyList(payload, comment) {
      getReplyList(payload).then(res => {
        if (res && res.data.code === 200) {
          this.commentData.comments.map(item => {
            const { replies } = res.data.data;
            if (item.id === comment.id) {
              item.reply.page = res.data.data.page;
              item.reply.replies = replies;
            }
          });
        }
      });
    },
    /**
     * 评论的分页
     */
    handlePageChange(page) {
      const {
        params: { id }
      } = this.$route;
      this.getCommentList({
        question_id: id,
        currentPage: page,
        pageSize: 5
      });
    },
    /**
     * 初始化时花获取问题详情
     */
    getQuestionDetails(payload) {
      const {
        params: { id }
      } = this.$route;

      getQuestionDetails(payload).then(res => {
        if (res && res.data.code === 200) {
          let { tag, createTime, likeCount, ...otherData } = res.data.data;
          this.like_count = likeCount;
          this.user = {
            creatorName: otherData.creatorName,
            avatar: otherData.avatar,
            githubUrl: otherData.githubUrl
          };
          this.questionInfo = {
            createTime: moment(createTime).format("YYYY-MM-DD HH:mm"),
            tag: JSON.parse(tag),
            ...otherData
          };

          //动态设置页面标题
          document.title = `${this.questionInfo.title} | Coder论坛`;

          if (isExitCookie("token")) {
            this.getThumbupStatus({
              question_id: id,
              user_id: this.login_user.accountId
            });
          }
        } else {
          document.title = "问题详情 | Coder论坛";
        }
      });
    },
    /**
     * 获取点赞状态
     */
    getThumbupStatus(payload) {
      //获取用户点赞状态
      getThumbupStatus(payload).then(res => {
        if (res && res.data.code === 200) {
          this.like = res.data.data.status;
        }
      });
    },
    /**
     * 获取评论列表
     */
    getCommentList(payload) {
      getCommentList(payload).then(res => {
        if (res && res.data.code === 200) {
          this.commentData = res.data.data;
        }
      });
    },
    thumbUp(payload) {
      //改变点赞状态
      const {
        params: { id }
      } = this.$route;
      const user = this.$store.state.userInfo;
      thumbUp(payload).then(res => {
        if (res && res.data.code === 200) {
          this.getThumbupStatus({
            question_id: id,
            user_id: user.accountId
          });
          this.getQuestionDetails({
            question_id: id,
            type: "thumbup"
          });
        }
      });
    },
    handleThumbUp() {
      //点赞操作
      if (!isExitCookie("token")) {
        this.$message.error("请登录后进行操作");
        return;
      }
      const {
        params: { id }
      } = this.$route;
      const user = JSON.parse(sessionStorage.getItem("user"));
      this.thumbUp({
        question_id: id,
        user_id: user.accountId
      });
    },
    clearUser() {
      //退出后清除用户信息
      this.login_user = null;
    },
    getRelated(payload) {
      //获取相关问题列表
      getRelativeQuestions(payload).then(res => {
        if (res && res.data.code === 200) {
          this.relativeList = res.data.data;
        }
      });
    },

    /**
     * 提交对问题的评论
     */
    handleSubmit() {
      if (!isExitCookie("token")) {
        //未登录，不能进行操作
        this.$message.error("请先登录");
        return;
      } else {
        if (this.commentContent) {
          this.submitting = true;
          //提交评论
          const {
            params: { id }
          } = this.$route; //问题id

          let user = this.$store.state.userInfo; //获取用户对象

          createComment({
            topicId: id,
            fromUid: user.accountId,
            content: this.commentContent,
            fromName: user.name,
            fromAvatar: user.avatarUrl
          }).then(res => {
            if (res && res.data.code === 200) {
              this.commentContent = "";
              this.submitting = false;
              if (this.commentData.page.total < 5) {
                this.commentData.comments.unshift(res.data.data);
              } else {
                this.commentData.comments.pop();
                this.commentData.comments.unshift(res.data.data);
              }

              this.getQuestionDetails({
                question_id: id,
                type: "details"
              });
            } else if (res && res.data.code === 402) {
              this.submitting = false;
              this.$message.error(res.data.data.msg);
            }
          });
        } else {
          this.$message.error("请输入评论内容");
        }
      }
    },
    handleCancel() {
      this.commentContent = "";
    }
  },
  created() {
    this.like = 0;
    this.path = this.$route.path;
    const {
      params: { id }
    } = this.$route;
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.login_user = user;
    } else {
      const cookie = getCookie("token");
      if (cookie) {
        getUser({ token: cookie }).then(res => {
          if (res.data.code === 200) {
            sessionStorage.setItem("user", JSON.stringify(res.data.data));
            this.login_user = res.data.data;
            this.$store.commit({
              type: "updateUser",
              userInfo: res.data.data
            });
          }
        });
      }
    }
    this.getQuestionDetails({
      question_id: id,
      type: "details"
    });
    this.getRelated({
      question_id: id
    });
    this.getCommentList({
      question_id: id
    });
  },
  components: {
    User,
    Relation,
    Nav,
    Comment
  }
};
</script>

<style lang="less" scoped>
.no-commont-text {
  height: 140px;
  text-align: center;
  padding-top: 60px;
  background-color: rgb(235, 235, 235);
}

.tag-div {
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding-top: 1rem;
}

.edit {
  font-size: 4px;
  margin-top: 5px;
}

.tags {
  width: 100%;
}

.icon-div {
  width: 100%;
  margin: 1rem 0 0 0;
}

.space {
  margin-right: 15px;
}

.reply {
  margin-top: 1.2rem;
  border-bottom: 1px solid rgb(232, 232, 232);
}

.pagination-div {
  display: flex;
  justify-content: flex-end;
}
</style>