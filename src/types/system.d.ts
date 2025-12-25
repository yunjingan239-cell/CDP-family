/**
 * 系统管理 类型定义
 */

// 菜单查询条件
declare interface SysMenuQuery {
    keyword: string;
}

// 菜单实体类型
declare interface SysMenuType {
    id: string;
    parentId: string;
    type: '1' | '2'; // '1' 菜单, '2'按钮
    path: string;
    name: string;
    redirect: string;
    code: string;
    component: string; // 路由组件所在 src/views/ 下的相对路径
    meta: {
        title: string; // 菜单标题
        icon: string; // 菜单图标
        linkTo: string; // 外链地址
        cache: boolean; // 是否缓存
        hidden: boolean; // 是否左侧菜单中显示, true隐藏/false显示
        isBreadcrumb: boolean;
    };
    sort: number;
    remark: string;
    createTime: string;
    updateTime: string;
    children: SysMenuType[];
}


/** 角色管理相关数据类型 */
// 角色查询条件
declare interface SysRoleQuery {
  name: string; // 角色名称
}

// 角色实体类型
declare interface SysRoleType {
  id: string; // 角色id
  roleName: string; // 角色名称
  roleCode: string; // 角色编码
  status: boolean; // 角色状态
  remark: string; // 备注信息
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

/* * 用户管理相关数据类型  */
// 用户查询条件
declare interface SysUserQuery {
  keyword: string; // 搜索关键字
}

// 用户实体类型
declare interface SysUserType {
  id: string; // id
  username: string; // 用户帐号
  nickName: string; // 用户昵称
  mobile: string; // 手机号码
  email: string; // 邮箱地址
  imageUrl: string; // 头像
  remark: string; // 备注信息
  password: string; // 登录密码
  roleIds: string[]; // 拥有的角色ids
  accountNonExpired: boolean; // 帐号是否过期(true 未过期, false已过期)
  accountNonLocked: boolean; // 帐户是否被锁定(true 未过期, false已过期)
  credentialsNonExpired: boolean; // 密码是否过期(true 未过期, false已过期)
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 密码重置表单
declare interface PwdResetForm {
  userId: string; // 用户id
  newPassword: string; // 新密码
  repPassword: string; // 确认密码
}

// 密码重置表单
declare interface PwdResetForm {
  userId: string; // 用户id
  newPassword: string; // 新密码
  repPassword: string; // 确认密码
}