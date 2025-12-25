import { getMenuUser } from '@/api/system/menu';
import { router } from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useViewRoutesStore } from '@/stores/viewRoutes';
import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import { dynamicRoutes, defaultRoutes } from '@/router';

/**
 * 获取 src/views 目录下的 .vue 全部文件, 排除其 components 目录下的子组件文件
 * import.meta.glob 参考: https://cn.vitejs.dev/guide/features.html#glob-import
 */
const modules: Record<string, RouteComponent> = import.meta.glob([
  '@/views/**/*.vue', 
  '!@/views/**/components/**'
]);

// 相对路径路由模块: 将 key本地路由组件路径 '/src/views' 或 './views' 都替换为 ''
const viewsModules: Record<string, RouteComponent> = Object.keys(modules).reduce((prevObj, currKey) => {
  Object.assign(prevObj, { [currKey.replace(/\/src\/views|.\/views/, '')]: modules[currKey] });
  return prevObj;
}, {});
// console.log('viewsModules', viewsModules);

/**
 * 根据后端返回路由数据, 进行动态路由控制
 * 1. 请求接口获取用户数据和权限数据
 */
export async function initBackEndRoutes() {
  // 1、判断用户是否登录, 未登录结束;
  const authStore = useAuthStore();
  if (!authStore.accessToken) return false;

  // 2、请求接口获取用户拥有的权限菜单(路由数据)
  try {
    const { data } = await getMenuUser();
    const { userInfo, menuList, buttonList } = data;

    // 3、没有任何菜单权限, 返回false
    if (!userInfo || !menuList || menuList.length <= 0) throw new Error('empty menu');
    authStore.setUserInfo(userInfo);
    authStore.setButtonList(buttonList);

    // 4、路由对象中 component 属性的字符串值, 从 viewsModules 中查找对应的动态导入路由组件方法
    dynamicRoutes[0].children = dynamicImportComponent(menuList);

    // 5、添加动态路由
    await addRouteHandle();
    // 6、将动态路由保存到pinia
    setDynamicRoutes();
    return true;
  } catch (e) {
    // mock/接口异常时，降级使用本地静态路由作为菜单，保证可以进入系统
    const fallbackMenus = dynamicRoutes[0].children || [];
    if (!authStore.userInfo) authStore.setUserInfo({} as any);
    authStore.setButtonList([]);
    authStore.setMenuList(fallbackMenus as any);
    return true;
  }
}

/**
 * 后端路由中 component 转换为动态导入路由组件
 * @param dynamicRoutes 后端返回的路由数组
 * @returns component 值已转换为动态导入路由组件方法
 */
export function dynamicImportComponent(dynamicRoutes: RouteRecordRaw[]) {
  if (!dynamicRoutes || dynamicRoutes.length <= 0) return;
  return dynamicRoutes.map((route) => {
    // 存在 component 值, 则查找对应动态导入组件方法
    const { component } = route;
    if (component) route.component = viewsModules[`${component}`] || viewsModules[`/${component}`];
    route.children && dynamicImportComponent(route.children);
    return route;
  });
}

/**
 * 添加动态路由, 使用 'router.addRoute'
 * @link 参考: https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html
 */
export function addRouteHandle() {
  // 1. 将默认路由401、404合并, 防止不在 layout 布局中; 不然会全屏显示401、404页面
  const layoutRouteChildren = [
    ...(dynamicRoutes[0].children || []), 
    ...defaultRoutes
  ];
  dynamicRoutes[0].children = layoutRouteChildren;

  // 2. 添加动态路由
  dynamicRoutes.forEach((route) => {
    router.addRoute(route);
  });
}

/**
 * 将动态路由保存到pinia状态中
 */
function setDynamicRoutes() {
  // 存储动态路由
  const authStore = useAuthStore();
  authStore.setMenuList(dynamicRoutes[0].children);
}

/**
 * 获取需要缓存的路由名称 `name` 存在到pinia
 * 用于: src/layout/LayoutMain/index.vue 文件中的 <keep-alive :includes="[xxx, xxx]" />
 */
export function setCacheRouteNames() {
  // 存储缓存路由 name
  const cacheRouteNames: string[] = [];

  const _getNames = (route: RouteRecordRaw) => {
    // 获取缓存路由的name值
    if (route.meta?.cache && route.name) cacheRouteNames.push(route.name as string);
    // 有子路由, 则递归获取name值
    if (route.children && route.children.length) {
      route.children.forEach(item => _getNames(item));
    }
  };

  _getNames(dynamicRoutes[0]);

  // 保存到 pinia
  const viewRoutesStore = useViewRoutesStore();
  viewRoutesStore.setCacheRouteNames(cacheRouteNames);
}