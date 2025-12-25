<!-- 编辑角色 -->
<script setup lang="ts" name="SystemRoleEdit">
import { ref, reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import { add, update } from "@/api/system/role";
import { notify } from "@/utils/element";

// 自定义自定义事件
const emit = defineEmits(['refresh']);

// 表单ref
const formRef = ref();

// 初始数据
const initData = { status: true };

const state = reactive({
  title: '新增',
  type: 'add' as FormType,
  visible: false,
  loading: false,
  formData: {} as SysRoleType
});

const { title, visible, loading, formData } = { ...toRefs(state) };

// 导出组件访问
defineExpose({
  open
});

/**
 * 打开窗口
 * @param type 编辑类型: edit 修改, add 新增
 * @param title 弹窗标题
 * @param data 渲染表单数据
 */
function open(type: FormType, title: string, data = {} as any) {
  state.title = title;
  state.type = type;
  // 合并初始数据(深度拷贝一份, 不然会影响原数据)
  state.formData = JSON.parse(JSON.stringify({ ...initData, ...data }));
  
  state.visible = true;
}

// 关闭窗口
function close() {
  if (state.loading) return;
  // 表单单空
  formRef.value.resetFields();
  state.visible = false;
}

// 提交表单
function submitForm() {
  formRef.value.validate((valid: any) => {
    if (!valid) return;
    submitData();
  });
}

async function submitData() {
  try {
    state.loading = true;
    let res;
    if (state.type === 'edit') {
      res = await update(state.formData);
    } else {
      res = await add(state.formData);
    }
    state.loading = false;

    if (res.code != 20000) return;
    notify('操作成功！', { type: 'success' });
    // 关闭窗口
    close();
    // 调用父组件重新加载数据事件
    emit('refresh');
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

</script>

<template>
    <el-dialog :title="`${title}角色`" center draggable v-model="visible" :before-close="close" width="800px"
        :close-on-click-modal="false" destroy-on-close>
        <div v-loading="loading">
            <el-form ref="formRef" :model="formData" label-width="85px" label-position="right" status-icon
                label-suffix=":">
                <el-form-item label="角色名称" prop="roleName"
                    :rules="{ required: true, message: '角色名称为必填项！', trigger: 'blur' }">
                    <el-input v-model="formData.roleName" maxlength="30" clearable show-word-limit
                        placeholder="请输入角色名称" />
                </el-form-item>

                <el-form-item label="角色编码" prop="roleCode"
                    :rules="{ pattern: /^[a-zA-Z0-9_-]{2,30}$/, message: '只允许输入2-30位英文/数字/下划线，', trigger: 'blur' }">
                    <el-input v-model="formData.roleCode" maxlength="30" clearable show-word-limit
                        placeholder="保证唯一性，建议以'ROLE_'开头" />
                </el-form-item>

                <el-form-item label="角色状态" prop="status"
                    :rules="{ required: true, message: '角色状态为必填项！', trigger: 'change' }">
                    <el-switch v-model="formData.status" inline-prompt active-text="启" inactive-text="停" />
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
                </el-form-item>
            </el-form>
        </div>

        <el-row justify="center" class="mt10">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submitForm">保存</el-button>
        </el-row>
    </el-dialog>
</template>

<style scoped></style>改错