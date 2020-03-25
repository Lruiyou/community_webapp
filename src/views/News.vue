<template>
  <div>
    <Nav />
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="0"
      class="infinite-list"
    >
      <a-row type="flex" justify="center">
        <a-col class="main" :xs="24" :sm="24" :md="18" :lg="16" :xl="14">
          <div class="container" v-if=" news.length > 0">
            <div class="comment" v-for="(item,index) in news" :key="index">
              <div class="info">
                <img class="avatar" :src="item.notifierAvatar" width="36" height="36" />
                <div class="right">
                  <div class="name">
                    {{item.notifierName}}
                    <span v-if="item.type == 1" class="type-text">回复了我的提问</span>
                    <span v-else class="type-text">回复了我的评论</span>
                  </div>
                  <div class="date">{{item.createTime | timeFormat}}</div>
                </div>
              </div>
              <div class="content">{{item.content}}</div>
              <div class="control">
                <span class="comment-reply" @click="showCommentInput(item)">
                  <i class="iconfont icon-comment"></i>
                  <span>回复</span>
                </span>
                <span class="comment-reply" v-if="item.type == 2" @click="handleShowReply(item)">
                  <i class="iconfont icon-like"></i>
                  <span style="margin-left: 12px;">查看对话</span>
                </span>
                <span class="comment-reply" @click="toAsk(item)">
                  <i class="iconfont icon-comment"></i>
                  <span style="margin-left: 12px;">前往问题</span>
                </span>
              </div>

              <div class="reply">
                <div class="item" v-if="item.type == 2 & item.parent != null">
                  <div class="reply-content">
                    <span class="from-name">{{item.parent.fromName}}</span>
                    <span>:</span>
                    <span class="to-name" v-if="item.parent.toName != null">@{{item.parent.toName}}</span>
                    <span>{{item.parent.content}}</span>
                  </div>
                  <div class="reply-bottom">
                    <span>{{item.parent.createTime | timeFormat}}</span>
                  </div>
                </div>
                <transition name="fade">
                  <div class="input-wrapper" v-if="showItemId === item.id">
                    <el-input
                      class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      :placeholder="placeholder"
                    ></el-input>
                    <div class="btn-control">
                      <span class="cancel" @click="cancel">取消</span>
                      <el-button class="btn" type="success" round @click="handleCommit(item)">确定</el-button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div v-else>
            <img src="../assets/nonews.jpg" />
          </div>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" v-if="more == false" style="margin-top:.5rem">
        <a-col :xs="24" :sm="24" :md="18" :lg="16" :xl="14">
          <div style="text-align:center">
            <span>没有更多数据了</span>
            <a-icon type="smile" theme="twoTone" />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template> 


<script>
import Nav from "../components/Nav";
import { getNotificationList } from "../api/notification";
import { getReplyById, createReply } from "../api/reply";
import { getCommentById } from "../api/comment";
export default {
  data() {
    return {
      inputComment: "",
      placeholder: "",
      showItemId: "",
      news: [],
      busy: false,
      page: 1,
      more: false //判断后端是否还有更多数据
    };
  },
  methods: {
    /**
     * 滚动加载
     */
    loadMore() {
      const {
        query: { uid }
      } = this.$route;
      if (this.more) {
        this.busy = true;
        getNotificationList({
          uid,
          currentPage: ++this.page,
          pageSize: 5
        }).then(res => {
          if (res && res.data.code === 200) {
            this.busy = false;
            let result = res.data.data.notificationList;
            this.more = res.data.data.page.more;
            if (result.length > 0) {
              result.forEach(item => {
                if (item.type == 2) {
                  item.parent = null;
                }
                this.news.push(item);
              });
            }
          } else {
            this.busy = false;
          }
        });
      }
    },
    /**
     * 回复成功的反馈
     */
    replySuccess() {
      this.$message.success("回复成功");
    },
    /**
     * 回复消息
     */
    handleCommit(item) {
      let user = this.$store.state.userInfo;
      createReply({
        topicId: item.outerId,
        commentId: item.commentId,
        replyId: item.replyId,
        fromUid: user.accountId,
        fromName: user.name,
        fromAvatar: user.avatarUrl,
        toUid: item.notifierId,
        toName: item.notifierName,
        toAvatar: item.notifierAvatar,
        content: this.inputComment
      }).then(res => {
        this.inputComment = "";
        if (res && res.data.code === 200) {
          this.replySuccess();
        }
      });
    },
    /**
     * 点击查看对话
     */
    handleShowReply(item) {
      if (item.commentId == item.parentId) {
        //回复的是评论,后端查评论表
        getCommentById({
          id: item.parentId
        }).then(res => {
          if (res && res.data.code === 200) {
            let result = res.data.data;
            this.news.forEach(item => {
              if (item.parentId === result.id) {
                item.parent = result;
              }
            });
          } else if (res && res.data.code === 403) {
            //评论不存在
            this.$message.error(res.data.msg);
          }
        });
      } else {
        //回复的是回复,后端查回复表
        getReplyById({
          id: item.parentId
        }).then(res => {
          if (res && res.data.code === 200) {
            let result = res.data.data;
            this.news.forEach(item => {
              if (item.parentId === result.id) {
                item.parent = result;
              }
            });
          } else if (res && res.data.code === 403) {
            //评论不存在
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    /**
     * 点击回复按钮显示输入框
     */
    showCommentInput(item) {
      this.placeholder = "回复 " + item.notifierName;
      this.showItemId = item.id;
    },
    /**
     * 取消输入
     */
    cancel() {
      (this.showItemId = ""), (this.inputComment = "");
    },
    /**
     * 跳转到问题详情页
     */
    toAsk(item) {
      this.$router.push({ name: "Question", params: { id: item.outerId } });
    },
    /**
     * 获取消息列表
     */
    getNotificationList(payload) {
      getNotificationList(payload).then(res => {
        if (res && res.data.code === 200) {
          let result = res.data.data.notificationList;
          this.more = res.data.data.page.more;
          result.forEach(item => {
            if (item.type == 2) {
              item.parent = null;
            }
            this.news.push(item);
          });
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

    this.getNotificationList({
      uid,
      currentPage: this.page,
      pageSize: 5
    });
  },
  components: {
    Nav
  }
};
</script>

<style lang="less" scoped>
.infinite-list {
  height: 550px;
  overflow-y: auto;
}

.type-text {
  color: rgb(156, 156, 156);
  font-size: 14px;
}

.main {
  margin-top: 0.6rem;
  background-color: #ffffff;
}

.pagination-div {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.container {
  padding: 0 10px;
  box-sizing: border-box;
}
.container .comment {
  display: flex;
  flex-direction: column;
  padding: 0px, 10px, 0px, 10px;
  border-bottom: 1px solid #e8e8e8;
}
.container .comment .info {
  display: flex;
  align-items: center;
  padding-top: 15px;
}
.container .comment .info .avatar {
  border-radius: 50%;
}
.container .comment .info .right {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.container .comment .info .right .name {
  font-size: 16px;
  color: #303133;
  margin-bottom: 5px;
  font-weight: 500;
}
.container .comment .info .right .date {
  font-size: 12px;
  color: #909399;
}
.container .comment .content {
  font-size: 16px;
  color: #303133;
  line-height: 20px;
  padding: 8px 6px;
  display: flex;
}
.container .comment .control {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #909399;
}
.container .comment .control .like {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}
.container .comment .control .like.active,
.container .comment .control .like:hover {
  color: #409eff;
}
.container .comment .control .like .iconfont {
  font-size: 14px;
  margin-right: 5px;
}
.container .comment .control .comment-reply {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.container .comment .control .comment-reply:hover {
  color: #333;
}
.container .comment .control .comment-reply .iconfont {
  font-size: 16px;
  margin-right: 5px;
}
.container .comment .reply {
  margin: 10px 0;
  border-left: 2px solid #dcdfe6;
}
.container .comment .reply .item {
  margin: 0 10px;
  padding: 10px 0;
}
.container .comment .reply .item .reply-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #303133;
}
.container .comment .reply .item .reply-content .from-name {
  color: #409eff;
}
.container .comment .reply .item .reply-content .to-name {
  color: #409eff;
  margin-left: 5px;
  margin-right: 5px;
}
.container .comment .reply .item .reply-bottom {
  display: flex;
  align-items: center;
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
}
.container .comment .reply .item .reply-bottom .reply-text {
  display: flex;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
}
.container .comment .reply .item .reply-bottom .reply-text:hover {
  color: #333;
}
.container .comment .reply .item .reply-bottom .reply-text .icon-comment {
  margin-right: 5px;
}
.container .comment .reply .write-reply {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #909399;
  padding: 10px;
  cursor: pointer;
}
.container .comment .reply .write-reply:hover {
  color: #303133;
}
.container .comment .reply .write-reply .el-icon-edit {
  margin-right: 5px;
}
.container .comment .reply .fade-enter-active,
.container .comment .reply fade-leave-active {
  transition: opacity 0.5s;
}
.container .comment .reply .fade-enter,
.container .comment .reply .fade-leave-to {
  opacity: 0;
}
.container .comment .reply .input-wrapper {
  padding: 10px;
}

.container .comment .reply .input-wrapper .btn-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
}
.container .comment .reply .input-wrapper .btn-control .cancel {
  font-size: 16px;
  color: #606266;
  margin-right: 20px;
  cursor: pointer;
}
.container .comment .reply .input-wrapper .btn-control .cancel:hover {
  color: #333;
}
.container .comment .reply .input-wrapper .btn-control .confirm {
  font-size: 16px;
}
</style>