// 弹窗表单类型：修改edit或新增add
declare type FormType = 'edit' | 'add';

// 分页类型
declare interface PageType {
  current: number; // 当前页码
  size: number; // 每页显示多少条
  total: number; // 总记录数
}