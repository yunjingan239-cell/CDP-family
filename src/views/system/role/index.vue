<script setup lang="ts" name="SystemRole">
import { ref, reactive, toRefs, defineAsyncComponent, onMounted, nextTick } from 'vue';
import { getPageList, deleteById } from "@/api/system/role";
import { ElMessage } from 'element-plus';
import Permission from './components/permission.vue';

const RoleEdit = defineAsyncComponent(() => import('@/views/system/role/components/role-edit.vue'));
// 声明状态
const state = reactive({
  loading: false,
  page: {
    current: 1,
    size: 20,
    total: 0
  } as PageType, // 分页
  query: {
    name: ''
  } as SysRoleQuery,
  tablelist: [] as SysRoleType[],
});

// 转为ref后解构
const { query, loading, page, tablelist } = { ...toRefs(state) };

onMounted(() => {
  queryData();
});

// 查询列表数据
async function queryData() {
  try {
    state.loading = true;
    const { current, size } = state.page;
    const { data } = await getPageList(state.query, current, size);
    state.tablelist = []; // 清空
    nextTick(() => {
      state.tablelist = data.records || [];
      state.page.total = data.total || 0;
    });
  } catch (error: any) {
    ElMessage.error(error.message || '查询角色列表失败');
    console.error('查询角色列表出错:', error);
  } finally {
    state.loading = false;
  }
}


// 列表ref
const tableListRef = ref();

// 修改弹窗 ref
const editRef = ref();

//分配权限ref
const permissionRef = ref();

// 新增
function handleAdd() {
  editRef.value.open('add', '新增');
}

// // 修改
// function handleEdit(row: SysRoleType) {
//   editRef.value.open('edit', '修改', row);
// }
// 修改
function handleEdit(row: SysRoleType) {
  const { id, roleName, roleCode, status, remark } = row;
  editRef.value.open('edit', '修改', { 
    id, 
    roleName, 
    roleCode, 
    status, 
    remark 
  });
}

// 删除
async function handleDelete(id: string) {
  try {
    state.loading = true;
    await deleteById(id);
    // 成功
    ElMessage.success('删除成功！');
    // 刷新列表
    queryData();
  } catch (error) {
    // console.log('error', error)
  } finally {
    state.loading = false;
  }
}

// 打开分配权限窗口
function handlePermission(role: SysMenuType) {
  permissionRef.value.open(role);
}

/**
 * 条件查询: 将页码变为第1页查询列表数据
 */
function handleQuery() {
  // 将页码变为第1页
  state.page.current = 1;
  queryData();
}
</script>

<template>
  <div class="layout-padding">
    <el-table v-loading="loading" ref="tableListRef" :data="tablelist" border stripe>
      <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
      <el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
      <el-table-column align="center" prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column align="center" prop="status" label="角色状态">
        <template #default="row">
          <el-tag :type="row.status ? 'success' : 'warning'">
            {{ row.status ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="260">
        <template #default="row">
          <el-button link type="primary" icon="ele-Check" @click="handlePermission(row)">分配权限</el-button>
          <el-button link type="warning" icon="ele-Edit" @click="handleEdit(row)">修改</el-button>
          <el-popconfirm width="auto" :title="('确定删除此角色和所有权限吗?' as string)" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button icon="ele-Delete" link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <Mpage :page="page" @pageChange="queryData" />
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" label-width="80px" label-suffix=":">
      <el-form-item label="角色名称">
        <el-input v-model="query.name" placeholder="请输入角色名称" clearable maxlength="30" />
      </el-form-item>

      <el-form-item>
        <el-button icon="ele-Search" type="primary" @click="handleQuery()">查询</el-button>
        <el-button icon="ele-Plus" type="success" @click="handleAdd()" >新增角色</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 新增/修改组件 -->
  <RoleEdit ref="editRef" @refresh="queryData"/>
  <!-- 分配权限-->
  <Permission ref="permissionRef"/>
</template>

<style scoped></style>