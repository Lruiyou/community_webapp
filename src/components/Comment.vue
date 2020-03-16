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
          <span>展开</span>
        </span>
      </div>

      <div class="reply">
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input
              class="gray-bg-input"
              v-model="inputComment"
              type="textarea"
              :rows="3"
              autofocus
              placeholder="写下你的评论"
            ></el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
      <!-- <div class="pagination-div">
        <el-pagination small layout="prev, pager, next" :total="50"></el-pagination>
      </div>-->
    </div>
    <div class="pagination-div">
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="commentData.page.total"
        @size-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

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
      inputComment: "",
      showItemId: ""
    };
  },
  methods: {
    /**
     * 切换评论的页码，重新调接口
     */
    handlePageChange(page) {
      this.$emit("pageChangeFunc", page);
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
      console.log(item, "item");
    },

    /**
     * 点击取消按钮
     */
    cancel() {
      this.showItemId = "";
    },

    /**
     * 提交评论
     */
    commitComment() {
      console.log(this.inputComment);
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前回复的评论
     */
    showCommentInput(item, reply) {
      if (reply) {
        this.inputComment = "@" + reply.fromName + " ";
      } else {
        this.inputComment = "";
      }
      this.showItemId = item.id;
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
  padding: 10px;
  border-bottom: 1px solid #f2f6fc;
}
.container .comment .info {
  display: flex;
  align-items: center;
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
  padding: 10px 0;
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
