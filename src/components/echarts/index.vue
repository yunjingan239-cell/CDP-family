<!-- WangEditor.vue -->
<template>
  <div class="editor-container">
    <Toolbar class="editor-toolbar" :editor="editorRef" :mode="mode" />
    <Editor 
      class="editor-area"
      :style="{ height }"
      v-model="state.editorVal"
      :defaultConfig="state.editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import '@wangeditor/editor/dist/css/style.css';
import { reactive, shallowRef, watch, onBeforeUnmount, nextTick } from 'vue';
import type { IDomEditor } from '@wangeditor/editor';
import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
import { uploadImg } from '@/api/common/media';

// 组件 props 类型定义
interface Props {
  mode?: 'default' | 'simple'; // 编辑器模式
  disable?: boolean; // 是否禁用
  placeholder?: string; // 内容提示信息
  height?: string; // 编辑器高度
  text?: string; // 内容文本（用于 editor.getText()）
  modelValue?: string; // 内容HTML代码（双向绑定）
}

// 定义 props 及默认值
const props = withDefaults(defineProps<Props>(), {
  mode: 'default',
  disable: false,
  placeholder: '请输入内容...',
  height: '399px',
  text: '',
  modelValue: ''
});

// 定义事件（用于双向绑定）
const emit = defineEmits(['update:text', 'update:modelValue']);

// 编辑器实例（必须用 shallowRef 避免响应式嵌套）
const editorRef = shallowRef<IDomEditor>();
const state = reactive({
  editorVal: props.modelValue, // 编辑器内容（双向绑定）
  editorConfig: { // 编辑器配置
    placeholder: props.placeholder,
    MENU_CONF: {} as any
  }
});

// 配置图片上传逻辑
state.editorConfig.MENU_CONF['uploadImage'] = {
  // 自定义上传：file=选中的文件，insertFn=插入图片的回调
  async customUpload(file: File, insertFn: Function) {
    const form = new FormData();
    form.append('file', file);
    // 附加参数（标识图片来源）
    form.append('data', JSON.stringify({ sourceType: 'goods_img' }));
    // 调用上传接口
    const { data } = await uploadImg(form);
    // 上传成功，插入图片到编辑器
    insertFn(data);
  }
};

// 编辑器创建时，记录实例
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

// 编辑器内容变化时，触发双向绑定更新
const handleChange = (editor: IDomEditor) => {
  emit('update:modelValue', editor.getHtml()); // 传递HTML内容
  emit('update:text', editor.getText()); // 传递纯文本内容
};

// 监听父组件传递的 modelValue，同步到编辑器
watch(() => props.modelValue, (val) => {
  state.editorVal = val;
});

// 监听禁用状态变化，同步编辑器
watch(() => props.disable, (bool) => {
  nextTick(() => {
    const wangEditor = editorRef.value;
    if (!wangEditor) return; // 避免空值调用
    bool ? wangEditor.disable() : wangEditor.enable();
  });
}, { immediate: true });

// 组件销毁前，销毁编辑器（避免内存泄漏）
onBeforeUnmount(() => {
  const wangEditor = editorRef.value;
  if (!wangEditor) return; // 确保实例存在
  wangEditor.destroy();
});
</script>

<style lang="scss" scoped>
.editor-container {
  .editor-toolbar {
    border-radius: 3px 3px 0 0;
    border: 1px solid var(--el-border-color-light) !important;
  }
  .editor-area {
    border: 1px solid var(--el-border-color-light) !important;
    border-radius: 0 0 3px 3px;
  }
}
</style>