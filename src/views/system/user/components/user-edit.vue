<script setup lang="ts" name="SystemUserEdit">
import useForm from '@/hooks/useForm';
import { ref, computed, watch, onMounted } from 'vue';
import { update, add, checkExist } from '@/api/system/user';
import { getRoleList } from '@/api/system/role';
import { isMainAccount, isMobile } from "@/utils/validate";

// 定义自定义事件
const emit = defineEmits(['refresh']);

// 角色选项
const roleOptions = ref<Array<{ value: string, label: string }>>([]);

// 获取角色列表
const fetchRoles = async () => {
  try {
    const res = await getRoleList();
    roleOptions.value = res.data.map((item: any) => ({
      value: item.id,
      label: item.roleName || item.name
    }));
  } catch (error) {
    console.error('获取角色列表失败:', error);
  }
};

// 初始化数据
const initData = {
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  roleIds: [] // 添加roleIds字段
};

const {
  formRef,
  title, type, visible, loading,
  formData, oldFormData,
  open,
  close,
  submitForm
} = useForm<SysUserType>({ initData, update, add }, emit);

defineExpose({
  open
});

// 修改时, 禁用密码输入框
const disabled = computed(() => type.value === 'edit');

// 组件挂载时获取角色列表
onMounted(() => {
  fetchRoles();
});

// 当对话框打开时获取角色列表
watch(visible, (val) => {
  if (val) {
    fetchRoles();
  }
});

// 校验用户帐号
const usernameValidator = async (rule: any, value: string, callback: Function) => {
  if (!value || value === "") {
    return callback(new Error('用户帐号为必填项！'));
  }
  if (!isMainAccount(value)) {
    return callback(new Error('帐号必须为6-30位数字、字母、下划线！'));
  }

  if (oldFormData.value.username !== value) {
    const { data } = await checkExist({ username: value });
    if (data) return callback(new Error('用户帐号已经被注册，请更换一个！'));
  }
  callback();
}

// 校验手机号
const mobileValidator = async (rule: any, value: string, callback: Function) => {
  if (!value || value === "") {
    return callback();
  }
  if (!isMobile(value)) {
    return callback(new Error('手机号码格式不正确！'));
  }

  if (oldFormData.value.mobile !== value) {
    const { data } = await checkExist({ mobile: value });
    if (data) return callback(new Error('手机号码已经被注册，请更换一个！'));
  }
  callback();
}
</script>

<template>
  <!-- draggable可拖拽 -->
  <el-dialog :title="`${title}用户`" draggable center v-model="visible" :before-close="close" width="720px"
    :close-on-click-modal="false" destroy-on-close>
    <div v-loading="loading">
      <el-form ref="formRef" :model="formData" label-width="95px" label-position="right" status-icon label-suffix=":">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName"
              :rules="{ required: true, message: '用户昵称不能为空', trigger: 'change' }">
              <el-input v-model="formData.nickName" placeholder="请输入用户昵称" style="width:100%" maxlength="30" clearable
                show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户帐号" prop="username"
              :rules="{ required: true, validator: usernameValidator, trigger: 'blur' }">
              <el-input v-model.trim="formData.username" maxlength="30" placeholder="请输入4~30位用户帐号" clearable
                show-word-limit />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile" :rules="{ validator: mobileValidator, trigger: 'blur' }">
              <el-input v-model.trim="formData.mobile" maxlength="20" placeholder="请输入手机号码" clearable
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录密码" prop="password" :rules="{
              required: true, pattern: /^[0-9a-zA-Z_]{6,30}$/,
              message: '密码必须为6-30位数字、字母、下划线！', trigger: 'blur'
            }">
              <el-input :disabled="disabled" v-model="formData.password" type="password" maxlength="30" clearable
                show-word-limit placeholder="请输入6-30位登录密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配角色" prop="roleIds">
              <el-select-v2 v-model="formData.roleIds" :options="roleOptions" placeholder="请选择角色" multiple filterable
                class="w100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model.trim="formData.email" maxlength="30" placeholder="请输入电子邮箱" clearable
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帐号锁定" prop="accountNonLocked"
              :rules="{ required: true, message: '请选择', trigger: 'change' }">
              <!-- 未锁定, 已锁定 -->
              <el-radio-group v-model="formData.accountNonLocked">
                <el-radio :label="true" border>未锁定</el-radio>
                <el-radio :label="false" border>已锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="帐号过期" prop="accountNonExpired"
              :rules="{ required: true, message: '请选择', trigger: 'change' }">
              <!-- 未过期, 已过期 -->
              <el-radio-group v-model="formData.accountNonExpired">
                <el-radio :label="true" border>未过期</el-radio>
                <el-radio :label="false" border>已过期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码过期" prop="credentialsNonExpired"
              :rules="{ required: true, message: '请选择', trigger: 'change' }">
              <!-- 未过期, 已过期 -->
              <el-radio-group v-model="formData.credentialsNonExpired">
                <el-radio :label="true" border>未过期</el-radio>
                <el-radio :label="false" border>已过期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注信息" prop="remark">
              <el-input type="textarea" v-model.trim="formData.remark" maxlength="100" placeholder="请输入备注信息" clearable
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="center" class="mt10">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<style scoped></style>