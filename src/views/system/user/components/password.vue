<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { notify } from '@/utils/element';
import { updatePassword } from '@/api/system/user';

// 表单ref
const formRef = ref();

// 声明状态
const state = reactive({
    visible: false,
    loading: false,
    user: {} as SysUserType, // 待重置用户
    formData: {} as PwdResetForm
});

const { visible, loading, user, formData } = { ...toRefs(state) };

// 暴露为公有的，父组件可直接修改和访问
defineExpose({ open });

// 打开窗口
function open(user: SysUserType) {
    state.user = user;
    state.formData.userId = user.id;
    state.visible = true;
}

// 关闭窗口
function close() {
    if (state.loading) return;
    formRef.value?.resetFields();
    state.visible = false;
}

// 校验再次输入的密码是否一致
const passwordValidator = (rule: any, value: string, callback: Function) => {
    if (!value) return callback(new Error('确认密码为必填项！'));
    // value 就是确认密码
    if (state.formData.newPassword !== value) {
        callback(new Error('两次输入密码不一致！'));
    } else {
        callback();
    }
}

// 确定
function submitForm() {
    formRef.value?.validate(async (valid: any) => {
        if (!valid) return false;
        try {
            // 发送请求提交数据
            state.loading = true;
            await updatePassword(state.formData);
            state.loading = false;
            notify('密码修改成功！', { type: 'success' });
            close();
        } catch (e) {
        } finally {
            state.loading = false;
        }
    });
}
</script>

<template>
    <el-dialog :title="`重置密码【${user.nickName}】`" center draggable v-model="visible" :before-close="close" width="400px"
        :close-on-click-modal="false" destroy-on-close>
        <div v-loading="loading">
            <el-form ref="formRef" :model="formData" label-width="85px" label-position="right" status-icon
                label-suffix=":">
                <el-form-item label="新密码" prop="newPassword" :rules="{
                    required: true,
                    pattern: /^[0-9a-zA-Z_]{6,30}$/, // 直接写正则表达式
                    message: '新密码必须为6-30位数字、字母、下划线！',
                    trigger: ['blur', 'change']
                }">
                    <el-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" maxlength="30"
                        clearable />
                </el-form-item>

                <el-form-item label="确认密码" prop="repPassword" :rules="{
                    required: true,
                    validator: passwordValidator,
                    trigger: 'blur'
                }">
                    <el-input type="password" v-model="formData.repPassword" placeholder="请输入确认密码" maxlength="30"
                        clearable />
                </el-form-item>
            </el-form>
        </div>

        <el-row justify="center" class="mt10">
            <el-button type="primary" @click="submitForm">确定</el-button>
            <el-button @click="close">取消</el-button>
        </el-row>
    </el-dialog>
</template>

<style lang="scss" scoped></style>