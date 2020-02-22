<template>
  <div class="home">
    <a-row class="common-main" type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <a-card>
          <div slot="title">
            <div>
              <a-icon type="read" style="margin-right:5px;font-size:17px" />
              <span style="font-size:17px">问题的标题</span>
            </div>
            <div class="edit">
              <span style="margin-right:5px">发布于</span>2020-1-30
            </div>
          </div>
          <div style="min-height:200px">内容</div>
          <div class="tag-div">
            <div class="tags">
              <a-tag color="pink">pink</a-tag>
              <a-tag color="red">red</a-tag>
              <a-tag color="orange">orange</a-tag>
              <a-tag color="green">green</a-tag>
            </div>
            <div class="icon-div">
              <span class="space">
                <a-icon type="like-o" style="margin-right:6px" />444
              </span>
              <span class="space">
                <a-icon type="eye" style="margin-right:6px" />555
              </span>
            </div>
          </div>
          <div>
            <div class="reply">
              <h3>221条评论</h3>
            </div>

            <!-- 评论区 -->
            <div v-for="(item,index) in comments" :key="item.id">
              <a-comment
                :author="item.author"
                :avatar="item.avatar"
                :content="item.content"
                :datetime="item.datetime"
              >
                <!-- <span slot="actions" @click="showTextarea(index,item.id)">回复</span> -->
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
                  :avatar="item1.avatar"
                  :content="item1.content"
                  :datetime="item1.datetime"
                >
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
              </a-comment>
            </div>

            <!-- 分页 -->
            <div class="pagination-div">
              <a-pagination :defaultCurrent="2" :total="20" />
            </div>

            <!-- 问题的回复框 -->
            <div>
              <a-comment>
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
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
          <User />
        </div>
        <div style="margin-top:20px">
          <Relation />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import User from "@/components/User.vue";
import Relation from "@/components/Relation.vue";

export default {
  name: "Question",
  data() {
    return {
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
      console.log(id);
      console.log(this.$refs, "this.$refs");
      const displayAttr = this.$refs.showSubReply[index].style.display;
      if (displayAttr === "none") {
        this.$refs.showSubReply[index].style.display = "block";
      } else {
        this.$refs.showSubReply[index].style.display = "none";
      }
    }
  },
  components: {
    User,
    Relation
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