// 商品条件查询类型
declare interface GoodsQuery {
  keyword: string; // 商品名称/编码/简码
  status: number; // 0下架, 1上架
}

// 商品实体类型
declare interface GoodsType {
  id: string;
  name: string;
  code: string;
  imageUrl: string; // 商品主图
  quickCode: string;
  specName: string;
  unitName: string;
  categoryId: string;
  categoryName: string;
  cost: number;
  stockNum: number;
  price: number;
  discountPrice: number;
  score: number;
  address: string;
  brand: string;
  status: number;
  sort: number;
  remark: string;
  goodsDetail: string; // 商品详情
  createTime: string;
  updateTime: string;
  loading?: boolean;
}
// 商品分类条件查询类型
declare interface GoodsCategoryQuery {
    name: string; // 分类名称
}

// 商品分类实体类型
declare interface GoodsCategoryType {
    id: string;
    name: string;
    status: boolean;
    sort: number;
    remark: string;
}