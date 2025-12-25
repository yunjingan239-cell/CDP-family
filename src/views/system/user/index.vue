<script setup lang="ts" name="SystemUser">
import useTablePage from '@/hooks/useTablePage';
import { ref, defineAsyncComponent } from 'vue';
import { getPageList, deleteById } from '@/api/system/user';
import { ElMessage } from 'element-plus';
// 补充类型（若未定义，需提前声明）
declare interface SysUserType {
  id: string;
  nickName: string;
  username: string;
  mobile?: string;
  email?: string;
  accountNonLocked: boolean;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  createTime?: string;
  roleIds?: string[];  // 用户角色ID数组
}
declare interface SysUserQuery {
  keyword?: string;
}

const UserEdit = defineAsyncComponent(() => import('@/views/system/user/components/user-edit.vue'));
const Password = defineAsyncComponent(() =>
  import('@/views/system/user/components/password.vue')
);
const emit = defineEmits([]);

const {
  tableListRef, editRef,
  loading, query, page, tableList,
  queryData,
  handleQuery,
  handleDelete,
  handleAdd,
  handleEdit: _handleEdit,
} = useTablePage<SysUserType, SysUserQuery>(
  { getPageList, deleteById },
  emit,
  undefined
);

// 重写 handleEdit 方法，确保传递正确的参数
function handleEdit(row: SysUserType) {
  try {
    console.log('开始编辑用户:', row);
    if (!editRef.value) {
      console.error('错误：editRef 未初始化');
      return;
    }
    // 确保传递完整的用户数据
    const userData = {
      id: row.id,
      nickName: row.nickName || '',
      username: row.username || '',
      mobile: row.mobile || '',
      email: row.email || '',
      accountNonLocked: row.accountNonLocked,
      accountNonExpired: row.accountNonExpired,
      credentialsNonExpired: row.credentialsNonExpired,
      createTime: row.createTime,
      roleIds: row.roleIds || []  // 确保 roleIds 存在
    };
    console.log('准备打开编辑对话框，数据:', userData);
    editRef.value.open('edit', '修改', userData);
  } catch (error) {
    console.error('编辑用户时发生错误:', error);
    // 可以在这里添加用户友好的错误提示
    ElMessage.error('打开编辑对话框时出错，请稍后重试');
  }
}

// 密码重置ref
const passwordRef = ref();
// 点击密码重置
function handlePwd(user: SysUserType) {
  passwordRef.value?.open(user);
}
</script>

<template>
  <div class="layout-padding">
    <!-- 条件查询 -->
    <el-form inline :model="query" label-suffix=":">
      <el-form-item>
        <el-input v-model.trim="query.keyword" clearable 
          placeholder="请输入用户帐号/昵称/手机号" style="width:300px;" />
      </el-form-item>
      <el-form-item>
        <el-button icon="ele-Search" type="primary" @click="handleQuery()">查询</el-button>
        <el-button icon="ele-Plus" type="success" @click="handleAdd()">新增用户</el-button>
      </el-form-item>
    </el-form>

    <!-- 用户列表表格 -->
    <el-table
      v-loading="loading"
      ref="tableListRef"
      :data="tableList"
      border
      stripe
    >
      <el-table-column fixed="left" align="center" prop="nickName" label="用户昵称" width="130" />
      <el-table-column align="center" prop="username" label="用户帐号" min-width="90" />
      <el-table-column align="center" prop="mobile" label="手机号" />
      <el-table-column align="center" prop="email" label="邮箱" />
      
      <!-- 帐号锁定状态 -->
      <el-table-column sortable align="center" prop="accountNonLocked" width="105" label="帐号锁定">
        <template #default="row">
          <el-tag v-if="row.accountNonLocked" effect="dark" type="success">正常</el-tag>
          <el-tag v-else effect="dark" type="danger">锁定</el-tag>
        </template>
      </el-table-column>
      
      <!-- 帐号过期状态 -->
      <el-table-column sortable align="center" prop="accountNonExpired" width="105" label="帐号过期">
        <template #default="row">
          <el-tag v-if="row.accountNonExpired" effect="dark" type="success">正常</el-tag>
          <el-tag v-else effect="dark" type="danger">过期</el-tag>
        </template>
      </el-table-column>
      
      <!-- 密码过期状态 -->
      <el-table-column sortable align="center" prop="credentialsNonExpired" width="105" label="密码过期">
        <template #default="row">
          <el-tag v-if="row.credentialsNonExpired" effect="dark" type="success">正常</el-tag>
          <el-tag v-else effect="dark" type="danger">过期</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column sortable align="center" prop="createTime" label="创建时间" width="195" />
      
      <!-- 操作列 -->
      <el-table-column fixed="right" header-align="center" align="left" label="操作" width="260">
        <template #default="row">
          <el-button @click="handlePwd(row)" link icon="ele-Key" type="primary">密码重置</el-button>
          <el-button @click="handleEdit(row)" link icon="ele-Edit" type="warning">修改</el-button>
          <el-popconfirm @confirm="handleDelete(row.id)" :title="`确定永久删除【${row.nickName}】账号？`" width="auto">
            <el-button link icon="ele-Delete" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
      
    </el-table>

    <!-- 新增/修改组件-->
    <UserEdit ref="editRef" @refresh="queryData"/>
    <!-- 密码重置 -->
    <Password ref="passwordRef"/>
  </div>
</template>

<style scoped>

</style>