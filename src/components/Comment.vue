<!--评论模块-->
<template>
  <div class="container" v-if="commentData != null">
    <div class="comment" v-for="(item,index) in commentData.comments" :key="index">
      <div class="info">
        <img class="avatar" :src="item.fromAvatar" width="36" height="36" />
        <div class="right">
          <div class="name">{{item.fromName}}</div>
          <div class="date">{{item.createTime | timeFormat}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
        <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont icon-comment"></i>
          <span>回复</span>
        </span>
        <span class="comment-reply" v-if="item.replyCount > 0" @click="handleShowReply(item)">
          <i class="iconfont icon-like"></i>
          <span style="margin-left: 12px;">展开回复</span>
        </span>
      </div>

      <div class="reply">
        <div class="item" v-for="(reply,index) in item.reply.replies" :key="index">
          <div class="reply-content">
            <span class="from-name">{{reply.fromName}}</span>
            <span>:</span>
            <span class="to-name">@{{reply.toName}}</span>
            <span>{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{reply.createTime | timeFormat}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
          </div>
          <transition name="fade">
            <div class="input-wrapper" v-if="showItemId === reply.id">
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
                <el-button class="btn" type="success" round @click="commitReply(item,reply)">确定</el-button>
              </div>
            </div>
          </transition>
        </div>
        <div
          class="write-reply"
          v-if="item.reply.replies.length > 0"
          @click="showCommentInput(item)"
        >
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
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
              <el-button class="btn" type="success" round @click="commitComment(item)">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
      <div class="pagination-div" v-if="item.reply.page != null">
        <el-pagination
          small
          layout="prev, pager, next"
          :total="item.reply.page.total"
          :page-size="pagesize"
          @current-change="handleReplyCurrentChange($event,item)"
        ></el-pagination>
      </div>
    </div>
    <div class="pagination-div">
      <el-pagination
        small
        background
        :page-size="pagesize"
        layout="prev, pager, next"
        :total="commentData.page.total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { isExitCookie } from "../utils/cookieUtils";
import { getReplyList, createReply } from "../api/reply";
export default {
  props: {
    commentData: {
      type: Array,
      default: function() {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {
      placeholder: "",
      showReply: true,
      pagesize: 5,
      inputComment: "",
      showItemId: ""
    };
  },

  methods: {
    /**
     * 后端接口：获取回复列表
     */
    getReplyList(payload, comment) {
      getReplyList(payload).then(res => {
        if (res && res.data.code === 200) {
          const { replies, page } = res.data.data;
          this.commentData.comments.map(item => {
            if (item.id === comment.id) {
              item.reply.replies = replies;
              item.reply.page = page;
            }
          });
        }
      });
    },
    /**
     * 切换评论的页码，重新调接口
     */
    handleCurrentChange(page) {
      this.$emit("pageChangeFunc", page);
    },

    /**
     *  切换回复的页码，重新调接口
     */
    handleReplyCurrentChange(page, item) {
      this.getReplyList(
        {
          comment_id: item.id,
          currentPage: page
        },
        item
      );
    },

    /**
     * 点赞
     */
    likeClick(item) {
      if (item.isLike === null) {
        Vue.$set(item, "isLike", true);
        item.likeNum++;
      } else {
        if (item.isLike) {
          item.likeNum--;
        } else {
          item.likeNum++;
        }
        item.isLike = !item.isLike;
      }
    },

    /**
     * 展开回复
     */
    handleShowReply(item) {
      this.getReplyList(
        {
          comment_id: item.id
        },
        item
      );
    },

    /**
     * 点击取消按钮
     */
    cancel() {
      this.showItemId = "";
      this.inputComment = "";
    },

    /**
     * 提交评论
     */
    commitComment(comment) {
      if (!isExitCookie("token")) {
        this.$message.error("请登录后再评论");
        return;
      }
      if (!this.inputComment) {
        this.$message.error("请输入评论内容");
        return;
      }

      const {
        params: { id }
      } = this.$route; //问题id

      let user = this.$store.state.userInfo;

      createReply({
        topicId: id,
        commentId: comment.id,
        replyId: comment.id,
        fromUid: user.id,
        fromName: user.name,
        fromAvatar: user.avatarUrl,
        toUid: comment.fromUid,
        toName: comment.fromName,
        toAvatar: comment.fromAvatar,
        content: this.inputComment
      }).then(res => {
        if (res && res.data.code === 200) {
          this.inputComment = "";
          this.commentData.comments.forEach(item => {
            if (item.id === comment.id) {
              //找到回复的评论id
              if (!item.reply.page) {
                //没有展开
                item.reply.replies.unshift(res.data.data);
              } else {
                //已经展开了，直接调接口刷新
                this.getReplyList({ comment_id: comment.id }, comment);
              }
            }
          });
        }
      });
    },
    /**
     * 提交回复
     */
    commitReply(comment, reply) {
      if (!isExitCookie("token")) {
        this.$message.error("请登录后再评论");
        return;
      }
      if (!this.inputComment) {
        this.$message.error("请输入回复内容");
        return;
      }

      const {
        params: { id }
      } = this.$route; //问题id

      let user = this.$store.state.userInfo;

      createReply({
        topicId: id,
        commentId: comment.id,
        replyId: reply.id,
        fromUid: user.id,
        fromName: user.name,
        fromAvatar: user.avatarUrl,
        toUid: comment.fromUid,
        toName: comment.fromName,
        toAvatar: comment.fromAvatar,
        content: this.inputComment
      }).then(res => {
        if (res && res.data.code === 200) {
          this.inputComment = "";
          this.commentData.comments.forEach(item => {
            if (item.id === comment.id) {
              //找到回复的评论id
              if (!item.reply.page) {
                //没有展开
                item.reply.replies.unshift(res.data.data);
              } else {
                //已经展开了，直接调接口刷新
                this.showItemId = "";
                this.getReplyList({ comment_id: comment.id }, comment);
              }
            }
          });
        }
      });
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput(item, reply) {
      this.inputComment = "";
      if (reply) {
        this.placeholder = "@" + reply.fromName + " ";
        this.showItemId = reply.id;
      } else {
        this.placeholder = "回复 " + item.fromName;
        this.showItemId = item.id;
      }
    }
  },
  created() {}
};
</script>

<style scoped lang="less">
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
  padding: 10px 6px;
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
  border-bottom: 1px dashed #ebeef5;
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
