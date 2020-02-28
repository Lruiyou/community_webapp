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
        <a-popconfirm
          title="取消后所填内容将不保存"
          @confirm="confirm"
          @cancel="cancel"
          okText="是"
          cancelText="否"
        >
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button>取消</a-button>
        </a-popconfirm>
      </div>
      <a-row type="flex">
        <a-col :span="24">
          <el-input v-model="title" placeholder="请输入问题标题" maxlength="20" show-word-limit clearable></el-input>
          <el-upload></el-upload>
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
import { publishQuestion } from "../api/question";
import userInfo from "../global/userStore";

let validTags = [];

tags.forEach(v1 => {
  v1.subNode.forEach(v2 => {
    validTags.push(v2.value);
  });
});

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
                  alert(1);
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
    onEditorChange(event) {
      this.content = event.text;
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
        this.$message.error("问题标题不能为空");
        return;
      }

      if (this.content == null) {
        this.$message.error("问题描述不能为空");
        return;
      }

      if (this.tag.length == 0) {
        this.$message.error("请选择标签，标签不能为空");
        return;
      }

      const user = userInfo.getUserInfo();

      if (user != null) {
        this.published = true;
        const params = {
          creator: user.accountId,
          github_url: user.githubUrl,
          title: this.title,
          content: this.content,
          html_content: this.html_content,
          tag: JSON.stringify(this.tag)
        };
        publishQuestion(params).then(res => {
          if (res.data.code === 200) {
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
        this.$message({
          showClose: true,
          message: "请重新登录",
          type: "error"
        });
      }
    },
    confirm() {},
    cancel() {}
  },
  created() {
    console.log(1);
  },
  mounted() {
    this.$refs.myQuillEditor.quill.enable(true);
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


