<template>
  <div>
    <Nav />
    <a-card class="content">
      <div slot="title">
        <a-icon type="snippets" style="margin-right:5px;font-size:17px" />
        <span style="font-size:17px">发起</span>
      </div>
      <div slot="extra">
        <a-button type="primary" style="margin-right:8px" @click="handleOK" :loading="published">确定</a-button>
        <a-popconfirm title="确认取消发布吗" @confirm="confirm" @cancel="cancel" okText="是" cancelText="否">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button>取消</a-button>
        </a-popconfirm>
      </div>
      <a-row type="flex">
        <a-col :span="24">
          <el-input v-model="title" placeholder="请输入问题标题" maxlength="20" show-word-limit clearable></el-input>
          <el-upload
            class="uploader"
            accept="image/jpeg, image/png"
            :multiple="false"
            action="http://localhost:8008/file/upload"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          ></el-upload>
        </a-col>
        <a-col :span="24" style="margin-top:20px">
          <quill-editor
            ref="myQuillEditor"
            v-model="html_content"
            :options="editorOption"
            @change="onEditorChange($event)"
          ></quill-editor>
        </a-col>
        <a-col :span="24" style="margin-top:30px">
          <a-tree-select
            showSearch
            style="width: 100%"
            v-model="tag"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            placeholder="请选择标签(最多5个)"
            allowClear
            multiple
            treeDefaultExpandAll
            @change="onTagChange"
          >
            <a-tree-select-node
              :value="item.node.value"
              :title="item.node.title"
              disabled
              v-for="item in tags"
              :key="item.title"
            >
              <a-tree-select-node
                :value="subitem.value"
                :title="subitem.title"
                v-for="subitem in item.subNode"
                :key="subitem.title"
                :disabled="tagSelect"
              />
            </a-tree-select-node>
          </a-tree-select>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>


<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import Nav from "@/components/Nav.vue";
import { toolbarOptions } from "../global/toolbarConfig";
import { tags } from "../global/tags";
import {
  publishQuestion,
  getQuestionDetails,
  editQuestion
} from "../api/question";
import findImgSrc from "../utils/findImgSrc";
import { isExitCookie } from "../utils/cookieUtils";

export default {
  components: {
    quillEditor,
    Nav
  },
  data() {
    return {
      published: false,
      tagSelect: false,
      name: "01-example",
      title: null,
      content: null,
      html_content: null,
      tag: [],
      fileUrls: [],
      tags: tags,
      editorOption: {
        placeholder: "在这里编辑问题描述",
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  methods: {
    /**
     * 图片还未上传成功的操作
     */
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (this.fileUrls.length >= 3) {
        this.$message.error("上传的图片不能超过3张");
        return false;
      }

      if (!isJPG && !isPNG) {
        this.$message.error("上传的图片要 JPG 或 PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
        return false;
      }
    },
    /**
     * 图片上传成功后的操作
     */
    uploadSuccess(res) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      //如果上传成功;
      if (res.code === 200 && res.data !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data.url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else if (res.code === 401) {
        this.$message.error(res.msg);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    uploadError() {
      this.$message.error("图片插入失败");
    },
    onEditorChange(event) {
      this.content = event.text;
      if (event.html.indexOf("img" != -1)) {
        let srcArr = findImgSrc(event.html);
        this.fileUrls = srcArr;
      }
    },
    onTagChange(value) {
      if (value.length >= 5) {
        this.tagSelect = true;
      } else {
        this.tagSelect = false;
      }
    },
    handleOK() {
      if (this.title == null) {
        this.$message({
          showClose: true,
          message: "问题标题不能为空",
          type: "error"
        });
        return;
      }

      if (this.html_content == null) {
        this.$message({
          showClose: true,
          message: "问题描述不能为空",
          type: "error"
        });
        return;
      }

      if (this.tag.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择标签，标签不能为空",
          type: "error"
        });
        return;
      }

      if (!isExitCookie("token")) {
        this.$router.push("/");
        this.$message.error("请先登录");
        return;
      }

      const user = this.$store.state.userInfo;

      if (user != null) {
        let type = this.$route.query.type;
        this.published = true;
        if (type === "create") {
          const params = {
            creator: user.accountId,
            creator_name: user.name,
            avatar: user.avatarUrl,
            github_url: user.githubUrl,
            title: this.title,
            content: this.content,
            html_content: this.html_content,
            tag: JSON.stringify(this.tag),
            file_url: JSON.stringify(this.fileUrls)
          };

          publishQuestion(params).then(res => {
            if (res && res.data.code === 200) {
              this.published = false;
              this.$message({
                showClose: true,
                message: "发布成功",
                type: "success"
              });
              this.$router.push("/");
            } else {
              this.published = false;
              this.$message({
                showClose: true,
                message: "出错啦",
                type: "error"
              });
            }
          });
        } else {
          const {
            query: { question_id }
          } = this.$route;
          const params = {
            id: question_id,
            title: this.title,
            content: this.content,
            html_content: this.html_content,
            tag: JSON.stringify(this.tag),
            file_url: JSON.stringify(this.fileUrls)
          };

          editQuestion(params).then(res => {
            this.published = false;
            this.$message({
              showClose: true,
              message: "发布成功",
              type: "success"
            });
            this.$router.push("/");
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请重新登录",
          type: "error"
        });
      }
    },
    confirm() {
      this.$router.push("/");
    },
    cancel() {}
  },
  created() {
    const {
      query: { question_id, type }
    } = this.$route;
    if (type === "edit") {
      //编辑问题
      getQuestionDetails({
        question_id,
        type
      }).then(res => {
        if (res && res.data.code === 200) {
          let {
            title,
            content,
            htmlContent,
            tag,
            fileUrl,
            ...otherData
          } = res.data.data;
          this.title = title;
          this.content = content;
          this.html_content = htmlContent;
          this.tag = JSON.parse(tag);
          this.fileUrls = JSON.parse(fileUrl);
        }
      });
    }
  }
};
</script>


<style lang="less" >
.ql-container {
  height: 400px;
}
.content {
  width: 70%;
  margin: 0.6rem auto;
}
</style>


