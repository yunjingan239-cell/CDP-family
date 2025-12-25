<!-- 编辑菜单 -->
<script setup lang="ts" name="SystemMenuEdit">
import { ref, reactive, toRefs } from 'vue';
import { getMenuSelect, add, update } from '@/api/system/menu';
import { ElMessage } from 'element-plus';

// 定义自定义事件
const emit = defineEmits(['refresh']);

// 表单ref
const formRef = ref();

// 初始数据
const initData = { type: '1', sort: 1, meta: { hidden: false, cache: true } };

// 声明状态
const state = reactive({
    title: '新增',
    type: 'add' as FormType,
    visible: false,
    loading: false,
    menuList: [],
    formData: {} as SysMenuType
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
 * @param data 初始表单数据
 */
function open(type: FormType, title: string, data = {} as any) {
    state.title = title;
    state.type = type;
    // 合并初始数据(深度拷贝一份，不然会影响原数据)
    state.formData = JSON.parse(JSON.stringify({ ...initData, ...data }));
    state.visible = true;
    loadMenuSelect();
}

// 查询所有菜单项（不加载按钮）++++++
async function loadMenuSelect() {
    // 调用接口获取菜单列表
    const { code, data } = await getMenuSelect();
    // 接口返回状态码非20000时，终止执行
    if (code !== 20000) return;
    // 将接口返回的菜单数据赋值给状态变量，用于下拉选择器渲染
    state.menuList = data;
}

// 关闭窗口
function close() {
    if (state.loading) return;
    // 表单清空
    formRef.value?.resetFields();
    state.visible = false;
}

async function submitData() {
  try {
    state.loading = true;
    let res;
    
    if (state.type === 'edit') {
      res = await update(state.formData);
    } else {
      // 新增
      res = await add(state.formData);
    }

    if (!res || res.code !== 20000) {
      ElMessage.error(res?.message || '操作失败');
      return false;
    }
    
    ElMessage.success('操作成功！');
    // 调用父组件重新加载数据事件
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待状态更新
    emit('refresh');
    // 关闭窗口
    close();
    return true;
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error('操作失败，请重试');
  } finally {
    state.loading = false;
  }
}

// 提交表单
async function submitForm() {
  try {
    const valid = await formRef.value?.validate();
    if (!valid) return;
    
    // 校验通过，如果是按钮('2'): 把对应不需要的把它清空
    if (state.formData.type === '2') {
      state.formData.path = '';
      state.formData.name = '';
      state.formData.component = '';
      state.formData.redirect = '';
      state.formData.meta.icon = '';
      state.formData.meta.hidden = false;
      state.formData.meta.cache = false;
    }
    
    const success = await submitData();
    if (success) {
      // 确保状态更新完成
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('表单提交出错:', error);
    ElMessage.error('表单提交出错，请重试');
  }
}

</script>

<template>
    <el-drawer :title="title + '菜单'" v-model="visible" :before-close="close" directions="rtl" size="650px">
        <el-form v-loading="loading" ref="formRef" :model="formData" label-width="85px" label-position="right"
            status-icon label-suffix=":">
            <!-- 上级菜单 -->
            <el-form-item label="上级菜单" prop="parentId">
                <!-- checkStrictly: true 父子不互相关联, emitPath: false 只返回该节点的值 -->
                <el-cascader v-model="formData.parentId" :options="state.menuList"
                    :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'title' }" clearable
                    placeholder="请选择上级菜单" class="w100" />
            </el-form-item>

            <!-- 菜单类型 -->
            <el-form-item label="菜单类型" prop="type" :rules="{ required: true, message: '请选择菜单类型', trigger: 'change' }">
                <el-radio v-model="formData.type" label="1" border>菜单</el-radio>
                <el-radio v-model="formData.type" label="2" border>按钮</el-radio>
            </el-form-item>

            <!-- 菜单名称 -->
            <el-form-item label="菜单名称" prop="meta.title" :rules="{ required: true, message: '请输入菜单名称', trigger: 'blur' }">
                <el-input v-model="formData.meta.title" placeholder="请输入菜单名称" maxlength="10" show-word-limit></el-input>
            </el-form-item>

            <!-- 权限标识（仅按钮类型显示） -->
            <template v-if="formData.type == '2'">
                <el-form-item label="权限标识" prop="code">
                    <el-input v-model="formData.code" placeholder="请输入权限标识" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </template>

            <!-- 路由相关字段（仅菜单类型显示） -->
            <template v-else>
                <el-form-item label="路由地址" prop="path">
                    <el-input v-model="formData.path" placeholder="路由地址path值" maxlength="200"
                        show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="路由名称" prop="name">
                    <el-input v-model="formData.name" placeholder="路由名称" maxlength="50" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="组件路径" prop="component">
                    <el-input v-model="formData.component" placeholder="路由组件相对路径" maxlength="300"
                        show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="菜单图标" prop="meta.icon">
                    <el-input v-model="formData.meta.icon" placeholder="请输入图标名 ele- 开头" maxlength="10"
                        show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="重定向" prop="redirect">
                    <el-input v-model="formData.redirect" placeholder="路由重定向地址redirect值" maxlength="200"
                        show-word-limit></el-input>
                </el-form-item>

                <el-row>
                    <el-col :span="12">
                        <!-- 是否隐藏 -->
                        <el-form-item label="是否隐藏" prop="meta.hidden"
                            :rules="{ required: true, message: '请选择', trigger: 'change' }">
                            <el-radio-group v-model="formData.meta.hidden">
                                <el-radio :label="false">不隐藏</el-radio>
                                <el-radio :label="true">隐藏</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <!-- 是否缓存 -->
                        <el-form-item label="是否缓存" prop="meta.cache"
                            :rules="{ required: true, message: '请选择', trigger: 'change' }">
                            <el-radio-group v-model="formData.meta.cache">
                                <el-radio :label="false">不缓存</el-radio>
                                <el-radio :label="true">缓存</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>

            <!-- 排序 -->
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="formData.sort" :min="1" :max="10000" style="width: 300px"></el-input-number>
            </el-form-item>

            <!-- 备注 -->
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" maxlength="50"
                    show-word-limit></el-input>
            </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <template #footer>
            <el-row justify="center" class="mt10">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submitForm()">保存</el-button>
            </el-row>
        </template>
    </el-drawer>

</template>

<style scoped></style>