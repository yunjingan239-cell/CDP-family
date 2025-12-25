<script setup lang="ts" name="SystemMenu">
import { ref, reactive, toRefs, defineAsyncComponent, onMounted } from 'vue';
import { getList, deleteById } from '@/api/system/menu';
import { ElMessage } from 'element-plus';
import { notify } from '@/utils/element';

const MenuEdit = defineAsyncComponent(() => import('@/views/system/menu/components/menu-edit.vue'));

// 修改菜单ref
const editRef = ref();
// 声明状态
const state = reactive({
  loading: false,
  query: {
    keyword: ''
  } as SysMenuQuery,
  tableList: [] as SysMenuType[]
});

// 转为ref后解构
const { query, loading, tableList } = { ...toRefs(state) };

onMounted(() => {
  queryData();
});

async function queryData() {
  try {
    state.loading = true;
    const { data } = await getList(state.query);
    state.tableList = data;
  } catch (error) {
    // console.log("error", error);
  } finally {
    state.loading = false;
  }
}

// 列表ref
const tableListRef = ref();

// 新增
function handleAdd(parentId?: string) {
  editRef.value.open('add', '新增', {parentId});
}

// 修改
function handleEdit(row: SysMenuType) {
  editRef.value.open('edit', '修改', row);
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

// 点击行: 展开/隐藏
const toggleRow = (row: SysMenuType) => {
  tableListRef.value.toggleRowExpansion(row);
};

</script>

<template>
  <div class="layout-padding">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" label-width="80px" label-suffix=":">
      <el-form-item label="菜单名称">
        <el-input v-model="query.keyword" placeholder="请输入菜单名称" clearable maxlength="30" />
      </el-form-item>
      <el-form-item>
        <el-button icon="ele-Search" type="primary" @click="queryData()">查询</el-button>
        <el-button icon="ele-Plus" type="success" @click="handleAdd()">新增菜单</el-button>
      </el-form-item>
    </el-form>

    <!-- row-key="id" 指定唯一标识的属性，其中数据要包含children才会被渲染为树状 -->
    <el-table class="w100" ref="tableListRef" border stripe row-key="id" :data="tableList" @row-click="toggleRow"
      v-loading="loading">
      <el-table-column header-align="center" align="left" label="菜单名称">
        <template #default="{ row }">
          <SvgIcon :name="row.meta?.icon || ''" />
          <span class="ml10">{{ row.meta?.title }}</span>
        </template>
      </el-table-column>

      <el-table-column header-align="center" align="left" prop="path" label="路由地址"
        show-overflow-tooltip></el-table-column>

      <el-table-column header-align="center" align="left" prop="component" label="组件路径"
        show-overflow-tooltip></el-table-column>

      <el-table-column header-align="center" align="left" prop="code" label="权限标识"></el-table-column>

      <el-table-column align="center" prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag effect="plain" :type="row.type == 1 ? 'primary' : 'success'">
            {{ row.type == 1 ? '菜单' : '按钮' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="sort" label="排序" width="100"></el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template #default="{ row }">
          <el-button v-if="row.type != '2'" link type="primary" icon="ele-Plus"
            @click.stop="handleAdd(row.id)">新增下级</el-button>
          <el-button link type="warning" icon="ele-Edit" @click.stop="handleEdit(row)">修改</el-button>
          <el-popconfirm width="auto" :title="`确定永久删除【${row.meta?.title}】吗？`" @confirm="handleDelete(row.id)">
            <template #reference>
              <!-- @click.stop防止点击展开 -->
              <el-button @click.stop icon="ele-Delete" link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
  <!-- 新增/修改组件 -->
  <MenuEdit ref="editRef" @refresh="queryData"/>
  
</template>

<style scoped></style>