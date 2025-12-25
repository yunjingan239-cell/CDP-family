<script setup lang="ts" name="GoodsList">
import useTablePage from "@/hooks/useTablePage";
import { getPageList, deleteById } from "@/api/goods/list";
import { notify } from "@/utils/element";
import { updateStatus } from "@/api/goods/list";
import { defineAsyncComponent, ref, reactive } from 'vue';
import { pinyin } from 'pinyin-pro'; // 确保已安装并导入拼音库

// 定义emit（根据实际业务需求声明事件）
const emit = defineEmits(['update:data']);
const GoodsEdit = defineAsyncComponent(() => import('@/views/goods/components/goods-edit.vue'));

// 表单数据
const formData = reactive<FormData>({
  name: '',
  quickCode: ''
});

// 定义表单数据类型
interface FormData {
  name: string;
  quickCode?: string;
  [key: string]: any;
}

// 定义查询参数类型
interface QueryParams {
  keyword: string;
  status: number;
  [key: string]: any;
}

const {
  editRef,
  tableListRef,
  loading,
  query,
  page,
  tableList,
  queryData,
  handleQuery,
  handleDelete,
  handleEdit,
  handleAdd,
} = useTablePage<GoodsType, GoodsQuery>(
  { getPageList, deleteById }, // 第一个参数：接口对象
  emit, // 第二个参数：emit
  {} // 可选第三个参数：props（按需传入）
);

// 改变商品状态（上/下架）
async function changeStatus(row: GoodsType) {
  try {
    row.loading = true;
    const { id, status } = row;
    const newStatus = status === 0 ? 1 : 0;
    const { code } = await updateStatus({ id, status: newStatus });
    if (code !== 20000) return false; // 失败：停止切换
    notify('状态更新成功', { type: 'success' });
    return true;
  } catch (error) {
    return false; // 停止切换
  } finally {
    row.loading = false;
  }
}

// 中文快捷码（中文拼音首字母）
function setQuickCode() {
  // 使用 formData 中的 name 生成快捷码
  if (formData.name) {
    formData.quickCode = pinyin(formData.name, {
      toneType: 'none',
      pattern: 'first',
      type: 'array',
      nonZh: 'consecutive'
    }).join('').toUpperCase();
  }
}
</script>

<template>
  <div class="layout-padding">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" label-width="80px" label-suffix=":">
      <el-form-item label="名称/编码">
        <el-input v-model="formData.name" @change="setQuickCode" maxlength="30" clearable show-word-limit
          placeholder="请输入商品名称" />
      </el-form-item>

      <el-form-item label="商品状态">
        <el-select v-model="query.status" class="m-2" placeholder="请选择商品状态" clearable>
          <el-option label="已上架" :value="1" />
          <el-option label="已下架" :value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="ele-Search" type="primary" @click="handleQuery()">查询</el-button>
        <el-button icon="ele-Plus" type="success" @click="handleAdd()">新增商品</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表数据 -->
    <el-table ref="tableListRef" v-loading="loading" :data="tableList" border stripe>
      <el-table-column fixed="left" align="left" header-align="center" prop="name" label="商品名/编码" width="230"
        show-overflow-tooltip>
        <template #default="row">
          <div class="flex">
            <el-avatar shape="square" :size="50" :src="row.imageUrl" />
            <div class="ml5">
              <div class="rowName">{{ row.name }}</div>
              <el-link @click="handleEdit(row)" type="primary">{{ row.code }}</el-link>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="specsName" label="商品规格"></el-table-column>
      <el-table-column align="center" prop="categoryName" label="所属分类" min-width="110"
        show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="quickCode" label="快捷码" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="unitName" label="单位" width="70"></el-table-column>
      <el-table-column sortable align="center" prop="stockNum" label="库存" min-width="110"
        show-overflow-tooltip></el-table-column>
      <el-table-column sortable align="center" prop="price" label="销售价" width="130"></el-table-column>
      <el-table-column sortable align="center" prop="price" label="商品特价" min-width="110">
        <template #default="row">{{ row.discountPrice ? '¥' + row.discountPrice : '无' }}</template>
      </el-table-column>
      <el-table-column sortable align="center" prop="cost" label="成本价" width="130"></el-table-column>
      <el-table-column align="center" prop="createTime" label="入库时间" width="160"></el-table-column>
      <el-table-column align="center" prop="statusText" label="商品状态" width="110">
        <template #default="row">
          <!-- beforeChange属性，其触发的函数需要接收参数，则要以函数方式绑定 () => xxx()
    若返回 false 或者返回 Promise 且被 reject，则停止切换。
    -->
          <el-switch @click.stop inline-prompt v-model="row.status" :active-value="1" :inactive-value="0"
            active-text="已上架" inactive-text="已下架" :before-change="() => changeStatus(row)" :loading="row.loading" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template #default="row">
          <el-button link type="warning" icon="ele-Edit" @click.stop="handleEdit(row)">修改</el-button>
          <el-popconfirm width="auto" :title="`确定永久删除【${row.name}】吗？`" @confirm="handleDelete(row.id)">
            <template #reference>
              <el-button @click.stop icon="ele-Delete" link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增/修改组件 -->
    <GoodsEdit ref="editRef" @refresh="queryData" />
  </div>
</template>

<style lang="scss" scoped></style>