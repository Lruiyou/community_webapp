<template>
  <div class="home">
    <Nav :path="path" @clearevent="clearUser" />
    <a-row class="common-main" type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
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
          <div style="word-break:break-word" v-html="questionInfo.htmlContent"></div>
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
            </div>
          </div>
          <div>
            <div class="reply">
              <h3>{{questionInfo.commentCount}}条评论</h3>
            </div>

            <!-- 评论区 -->
            <div v-for="(item,index) in comments" :key="item.id">
              <a-comment :author="item.author" :content="item.content" :datetime="item.datetime">
                <!-- <span slot="actions" @click="showTextarea(index,item.id)">回复</span> -->
                <img slot="avatar" :src="item.avatar" />
                <div slot="actions">
                  <span
                    style="margin-right:12px;cursor:pointer"
                    @click="showTextarea(index,item.id)"
                  >回复</span>
                  <span
                    style="cursor:pointer"
                    v-if="item.subComments !== null && item.subComments.length > 0"
                  >查看回复</span>
                </div>

                <!-- 二级评论 -->
                <a-comment
                  v-for="(item1) in item.subComments"
                  :key="item1.id"
                  :author="item1.author"
                  :content="item1.content"
                  :datetime="item1.datetime"
                >
                  <img slot="avatar" :src="item1.avatar" />
                  <!-- <span slot="actions" @click="showSubTextarea(index1,item1.id)">回复</span>
                  <div ref="showSubReply" style="display:none">
                    二级评论回复框
                    <a-form-item>
                      <a-textarea :rows="4" :value="value" :placeholder="'回复'+item1.author"></a-textarea>
                    </a-form-item>
                    <a-form-item>
                      <a-button
                        htmlType="submit"
                        :loading="submitting"
                        type="primary"
                        style="margin-right:8px"
                      >确定</a-button>
                      <a-button htmlType="submit" @click="showSubTextarea(index1,item1.id)">取消</a-button>
                    </a-form-item>
                  </div>-->
                </a-comment>
                <!-- 评论的回复框 -->
                <div ref="showReply" style="display:none">
                  <a-form-item>
                    <a-textarea :rows="4" :value="value" placeholder="回复Han Solo"></a-textarea>
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      htmlType="submit"
                      :loading="submitting"
                      type="primary"
                      style="margin-right:8px"
                    >确定</a-button>
                    <a-button htmlType="submit" @click="showTextarea(index,item.id)">取消</a-button>
                  </a-form-item>
                </div>
                <div class="pagination-div">
                  <el-pagination
                    small
                    layout="prev, pager, next"
                    :total="50"
                    v-if="item.subComments !== null && item.subComments.length > 0"
                  ></el-pagination>
                </div>
              </a-comment>
            </div>

            <!-- 分页 -->
            <div class="pagination-div">
              <el-pagination small background layout="prev, pager, next" :total="1000"></el-pagination>
            </div>

            <!-- 问题的回复框 -->
            <div>
              <a-comment>
                <!-- <a-avatar slot="avatar" :src="login_user.avatarUrl" alt="Han Solo" /> -->
                <a-avatar slot="avatar" v-if="login_user == null" icon="user" />
                <img slot="avatar" v-else :src="login_user.avatarUrl" />
                <div slot="content">
                  <a-form-item>
                    <a-textarea :rows="4" @change="handleChange" :value="value" placeholder="评论一下吧"></a-textarea>
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      htmlType="submit"
                      :loading="submitting"
                      @click="handleSubmit"
                      type="primary"
                    >确定</a-button>
                  </a-form-item>
                </div>
              </a-comment>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="0" :sm="0" :md="5" :lg="5" :xl="5">
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
import { getUser } from "../api/user";
import { getCookie } from "../utils/cookieUtils";
import {
  getQuestionDetails,
  getThumbupStatus,
  thumbUp,
  getRelativeQuestions
} from "@/api/question.js";

let moment = require("moment");
export default {
  name: "Question",
  data() {
    return {
      relativeList: [],
      path: null,
      questionInfo: {},
      user: null,
      like: 0,
      like_count: 0,
      login_user: null,
      comments: [
        {
          id: 1,
          author: "Han Solo",
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          content: "要显示为评论头像的元素 - 通常是 antd",
          subComments: [
            {
              id: 3,
              author: "哈喽",
              avatar:
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
              content: "要显示为评论头像的元素 - 通常是 antd"
            },
            {
              id: 4,
              author: "你好",
              avatar:
                "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
              content: "要显示为评论头像的元素 - 通常是 antd"
            }
          ]
        },
        {
          id: 2,
          author: "Han Solo",
          avatar:
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
          content: "要显示为评论头像的元素 - 通常是 antd",
          subComments: []
        }
      ]
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
    }
  },
  methods: {
    showTextarea(index, id) {
      console.log(id);
      const displayAttr = this.$refs.showReply[index].style.display;
      if (displayAttr === "none") {
        this.$refs.showReply[index].style.display = "block";
      } else {
        this.$refs.showReply[index].style.display = "none";
      }
    },
    showSubTextarea(index, id) {
      console.log(id, "id");
      const displayAttr = this.$refs.showSubReply[index].style.display;
      if (displayAttr === "none") {
        this.$refs.showSubReply[index].style.display = "block";
      } else {
        this.$refs.showSubReply[index].style.display = "none";
      }
    },
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
          this.getThumbupStatus({
            question_id: id,
            user_id: this.login_user.id
          });
        }
      });
    },
    getThumbupStatus(payload) {
      //获取用户点赞状态
      getThumbupStatus(payload).then(res => {
        if (res && res.data.code === 200) {
          this.like = res.data.data.status;
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
            user_id: user.id
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
      const {
        params: { id }
      } = this.$route;
      const user = this.$store.state.userInfo;
      if (!user) {
        this.$message.error("请登录后进行操作");
        return;
      }
      this.thumbUp({
        question_id: id,
        user_id: user.id
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
    }
  },
  created() {
    this.like = 0;
    this.path = this.$route.path;
    const {
      params: { id }
    } = this.$route;
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
  },
  components: {
    User,
    Relation,
    Nav
  }
};
</script>

<style lang="less" scoped>
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