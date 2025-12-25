import { notify, confirm } from '@/utils/element';
// 1. 仅类型导入用 `import type`，普通值导入保留原格式
import type { Ref, UnwrapRef } from 'vue';
import { ref, reactive, toRefs, onMounted, nextTick, unref } from 'vue';

// 补充 PageType 类型定义（原图中未显示，避免报错）
declare interface PageType {
  current: number;
  size: number;
  total: number;
}

interface Params {
  disableMounted?: boolean | Ref<boolean>; // 细化 Ref 泛型类型
  mustQuery?: any; // 查询条件，传递 reactive 创建的响应式变量，方便后面响应式改变
  getPageList: Function;
  deleteById: Function;
}

/**
 * 分页列表页面通用逻辑
 * @param params 参数见 Params
 * @param emit 父组件 defineEmits (必须要SF文件中定义)
 * @param props 父组件 defineProps (必须要SF文件中定义)
 * @returns
 */
function useTablePage<T = any, Q = any>(params: Params, emit: Function, props?: any) {
  // 列表ref
  const tableListRef = ref<HTMLElement>();
  // 修改弹框ref
  const editRef = ref<any>();

  // 声明状态
  const state = reactive({
    // 加载状态
    loading: false,
    // 查询条件
    query: {} as Q,
    // 分页参数
    page: {
      current: 1,
      size: 20,
      total: 0
    } as PageType,
    // 列表数据
    tableList: [] as T[],
  });

  onMounted(() => {
    // 禁用首次加载，方便组件中其他位置触发加载
    if (unref(params.disableMounted)) return;
    queryData();
  });

  /**
   * 分页条件查询列表数据
   */
  async function queryData() {
    // 返回promise方便后期扩展
    return new Promise((resolve, reject) => {
      state.loading = true;
      const query = params.mustQuery ?
        Object.assign({}, state.query, params.mustQuery) : state.query;
      params.getPageList && params.getPageList(query, state.page.current, state.page.size).then((resp: any) => {
        state.loading = false;
        const { records, total } = resp.data;
        // 列表查询前清空，不然有些地方可能会有问题。
        state.tableList = [];
        nextTick(() => {
          state.tableList = records;
          state.page.total = total;
        });
        resolve(resp);
      }).catch((error: Error) => {
        reject(error);
      }).finally(() => {
        state.loading = false;
      });
    });
  }

  /**
   * 条件查询: 将页码变为第1页查询列表数据
   */
  function handleQuery() {
    // 将页码变为第1页
    state.page.current = 1;
    queryData();
  }

  // 新增(调用时没有传递要加上小括号 `handleAdd()`)
  function handleAdd(parentId?: string) {
    editRef.value?.open('add', '新增', { parentId });
  }

  // 修改
  function handleEdit(row: T) {
    editRef.value?.open('edit', '修改', row);
  }

  // 删除
  async function handleDelete(id: string) {
    try {
      state.loading = true;
      if (params.deleteById) await params.deleteById(id);
      // 成功
      notify('删除成功', { type: 'success' });
      // 刷新列表
      handleQuery();
    } catch (error) {
      console.log('error', error)
    } finally {
      state.loading = false;
    }
  }

  return {
    ...toRefs(state), // state中所有状态属性都变成ref类型，所以操作时要加 .value
    editRef,
    tableListRef,
    queryData,
    handleQuery,
    handleDelete,
    handleAdd,
    handleEdit,
  }
}

export { useTablePage };
export default useTablePage;