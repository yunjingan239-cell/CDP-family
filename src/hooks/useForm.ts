import { ref, reactive, toRefs } from 'vue';
import { notify } from '@/utils/element';

interface Params {
  initData?: any; // 初始数据（一般用于新增时默认值）
  add?: Function;
  update?: Function;
}

type FormType = 'add' | 'edit';

function useForm<T = any>(params: Params, emit?: any, props?: any) {
  const { initData = {}, add = () => {}, update = () => {} } = params;

  // 表单ref
  const formRef = ref();

  // 定义状态
  const state = reactive({
    title: '新增',
    type: 'add' as FormType,
    visible: false,
    loading: false,
    formData: {} as T,
    oldFormData: {} as T
  });

  // 打开弹窗
  function open(type: FormType, title: string, data: any) {
    state.title = title;
    state.type = type;
    // 合并初始数据（深拷贝一份，不然会影响原数据）
    state.formData = JSON.parse(JSON.stringify({ ...initData, ...data }));
    // 当修改操作, 数据快照临时用
    state.oldFormData = Object.assign({}, state.formData);
    state.visible = true;
  }

  // 关闭窗口
  function close() {
    if (state.loading) return;
    formRef.value?.resetFields();
    state.visible = false;
  }

  // 提交表单校验
  function submitForm() {
    formRef.value?.validate((valid: any) => {
      if (!valid) return;
      submitData();
    });
  }

  // 提交表单数据给后端接口
  async function submitData() {
    try {
      state.loading = true;
      let res;
      if (state.type === 'edit') { // 修改
        res = await update(state.formData);
      } else { // 新增
        res = await add(state.formData);
      }
      state.loading = false;

      if (res.code !== 20000) return;

      notify('操作成功!', { type: 'success' });
      // 关闭窗口
      close();
      // 调用父组件重新加载数据事件
      emit && emit('refresh');
    } catch (error) {
    } finally {
      state.loading = false;
    }
  }

  return {
    formRef,
    ...toRefs(state),
    open,
    close,
    submitForm
  }
}

export { useForm };
export default useForm;