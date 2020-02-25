<template>
  <div>
    <a-card class="content">
      <div slot="title">
        <a-icon type="snippets" style="margin-right:5px;font-size:17px" />
        <span style="font-size:17px">发起</span>
      </div>
      <div slot="extra">
        <a-button type="primary" style="margin-right:8px">确定</a-button>
        <a-button>取消</a-button>
      </div>
      <a-row type="flex">
        <a-col :span="24">
          <a-input placeholder="在这里输入问题标题" style="width:100%" allowClear></a-input>
        </a-col>
        <a-col :span="24" style="margin-top:20px">
          <el-upload></el-upload>
          <quill-editor
            ref="myTextEditor"
            v-model="content"
            :options="editorOption"
            @change="onEditorChange($event)"
          ></quill-editor>
        </a-col>
        <a-col :span="24" style="margin-top:30px">
          <a-tree-select
            showSearch
            style="width: 100%"
            :value="value"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            placeholder="请选择标签"
            allowClear
            multiple
            treeDefaultExpandAll
            @change="onChange"
            @search="onSearch"
            @select="onSelect"
          >
            <a-tree-select-node value="parent 1" title="parent 1" key="0-1" disabled>
              <a-tree-select-node value="leaf1" title="my leaf" key="random" />
              <a-tree-select-node value="f1" title="leaf" key="kl" />
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
import { toolbarOptions } from "../global/toolbarConfig";

export default {
  data() {
    return {
      value: undefined,
      name: "01-example",
      content: ``,
      editorOption: {
        placeholder: "在这里编辑问题描述",
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
    onChange(value) {
      console.log(value);
      this.value = value;
    },
    onSearch() {
      console.log(...arguments);
    },
    onSelect() {
      console.log(...arguments);
    },
    onEditorChange(event) {
      const content = event.html;
      console.log(content, "content");
    }
  },
  components: {
    quillEditor
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


