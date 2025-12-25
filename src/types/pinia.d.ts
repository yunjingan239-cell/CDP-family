/**
 * Pinia 状态类型定义
 */

// 布局配置信息
declare interface LayoutConfigState {
  isCollapse: boolean;
  globalTitle: string;
  isFullscreen: boolean; // ++++
  isDark: boolean; // +++
}
// 登录信息
declare interface LoginData {
  username: string;
  password: string;
}
// 认证用户信息
declare interface UserInfo {
  nickName: string;
  username: string;
  imageUrl: string;
}
// 用户认证信息
declare interface AuthState<T = any> {
  rememberData?: LoginData; // 记住我（登录数据）
  accessToken?: string; // 访问令牌
  userInfo?: UserInfo; // 登录用户信息 ++++++
  buttonList: string[]; // 路由菜单权限 ++++++
  menuList: T[]; // 路由菜单权限 ++++++
}
// 视图路由状态
declare interface ViewRoutesState {
  cacheRouteNames: string[]; // 要缓存路由的name
}