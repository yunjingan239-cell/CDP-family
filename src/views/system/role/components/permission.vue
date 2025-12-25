<!-- 分配权限 -->
<script setup lang="ts">
import { ref, reactive, toRefs, watch, nextTick } from 'vue';
import { getList } from '@/api/system/menu';
import { getMenuIdsByRoleId, saveRoleMenu } from '@/api/system/role';
// import { cdp, notify } from '@/utils/element';
import { notify } from '@/utils/element';

import type Node from 'element-plus/es/components/tree/src/model/node';

// 菜单树ref
const treeRef = ref();

// 全选/不选
function handleCheckAll() {
  state.checked = !state.checked;
  // 全选
  if (state.checked) treeRef.value.setCheckedNodes(state.menuList);
  // 取消全选
  else treeRef.value.setCheckedNodes([]);
}

// 展开/折叠
function handleExpand() {
  state.expandAll = !state.expandAll;
  // 改变每个节点的状态: 展开所有
  changeTreeNodeStatus(treeRef.value.store.root);
}

// 递归遍历 展开/折叠 子节点
function changeTreeNodeStatus(node: Node) {
  node.expanded = state.expandAll;
  for (let i = 0; i < node.childNodes.length; i++) {
    // 改变节点的自身expanded状态
    node.childNodes[i].expanded = state.expandAll;
    // 递归子节点
    if (node.childNodes[i].childNodes.length > 0) {
      changeTreeNodeStatus(node.childNodes[i]);
    }
  }
}

// 定义状态
const state = reactive({
  visible: false,
  loading: false,
  checked: false, // true全选
  expandAll: false, // true展开所有
  role: {} as SysRoleType, // 点击的角色
  menuIds: [] as string[], // 当前角色拥有权限id
  menuList: [], // 存储所有菜单
  submitting: false, // 正在提交中
});

const {
  visible, loading, checked, expandAll,
  role, menuIds, menuList, submitting
} = { ...toRefs(state) };

// 导出父组件访问
defineExpose({
  open
});

// 打开弹窗
// async function open(role: SysRoleType) {
//   state.visible = true;
//   state.role = role;
//   // 获取所有菜单
//   await loadMenuList();
// }

// 关闭窗口
function close() {
  if (state.submitting) return ('正在提交中,无法关闭窗口');
  state.menuIds = [];
  state.menuList = [];
  state.checked = false;
  state.expandAll = false;
  state.visible = false;
}

/**
 * 获取所有菜单
 */
async function loadMenuList() {
  try {
    state.loading = true;
    const { data } = await getList();
    state.menuList = data;
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

// 打开弹窗
async function open(role: SysRoleType) {
  state.visible = true;
  state.role = role;
  await loadMenuList();
  // 查询角色原有的菜单Ids +++++
  await loadRoleMenuIds();
  // 勾选角色原有的菜单项 +++++
  await checkedOldMenuNode();
}

/**
 * 查询当前角色所拥有的权限 +++++
 */
async function loadRoleMenuIds() {
  try {
    state.loading = true;
    // 查询当前拥有权限
    const { data } = await getMenuIdsByRoleId(state.role.id);
    state.menuIds = data;
  } catch (error) {
  } finally {
    state.loading = false;
  }
}

// 进行回显角色之前拥有的菜单Ids
function checkedOldMenuNode() {
  nextTick(() => {
    // 循环出每个菜单Id, 然后打开菜单中的节点对象
    const { menuIds } = state;
    menuIds.forEach((id) => {
      // 获取节点对象
      const node = treeRef.value.getNode(id);
      // 判断是否为子节点, 如果是子节点则勾选, 否则不勾选
      if (node && node.isLeaf) treeRef.value.setChecked(id, true);
    });
  });
}

// 提交数据
async function submitForm() {
  try {
    state.submitting = true;
    // 获取所有被选中的菜单id
    const checkedMenuIds = treeRef.value.getCheckedKeys();

    // 获取半选中（父节点）的菜单id
    const parentIds = treeRef.value.getHalfCheckedKeys();
    // 将选中的和父节点的菜单id组合成一个新数组 menuIds
    const menuIds = parentIds.concat(checkedMenuIds);
    // 调用保存角色权限菜单接口
    await saveRoleMenu(state.role.id, menuIds);

    notify('分配权限成功！', { type: 'success' });
    state.submitting = false; // 加上不然无法关闭窗口
    // 关闭窗口
    close();
  } catch (error) {
  } finally {
    state.submitting = false;
  }
}
</script>

<template>
  <el-drawer 
    :title="`分配【${role.roleName}】的权限`" 
    direction="rtl" 
    size="480px"
    v-model="visible" 
    :before-close="close"
  >
    <div v-loading="loading">
      <!-- 
        node-key 每个树节点用来作为唯一标识的属性
        show-checkbox 显示勾选框
        highlight-current 高亮当前点击节点
        data 数据集
        props 数据集合中渲染的各项属性名
        default-expand-all 是否展开所有
      -->
      <el-tree
        ref="treeRef"
        node-key="id"
        show-checkbox
        highlight-current
        :data="menuList"
        :default-expand-all="expandAll"
        :props="{children: 'children', label: 'meta'}"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <!-- 一、二级菜单显示自定义图标 -->
            <SvgIcon v-if="[1, 2].includes(node.level)" :name="data.meta.icon || 'ele-Menu'" />
            
            <!-- 三级菜单显示 菜单 或 按钮 图标 -->
            <el-icon v-else>
              <ele-Menu v-if="data.type == 1" />
              <ele-SwitchButton v-else-if="data.type == 2" />
            </el-icon>

            <span class="pl10">{{ data.meta.title }}</span>
          </span>
        </template>
      </el-tree>
    </div>

    <template #footer>
      <el-button @click="handleCheckAll">全选/不选</el-button>
      <el-button @click="handleExpand">展开/收起</el-button>
      <el-button @click="close">取消</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
.custom-tree-node {
  font-size: 14px;
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 8px;
}
</style>