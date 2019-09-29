import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import tableRouter from './modules/table'

/** note: submenu only apppear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: '首页',
      meta: {
        title: '首页',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
    path: '/user',
    component: Layout,
    permissions: 'Manager',
    redirect: '/user/userInfor',
    meta: {
      title: '用户管理',
      icon: 'tab'
    },
    children: [{
        path: 'user-infor',
        component: () => import('@/views/user/userInfor'),
        name: '用户信息',
        meta: {
          title: '用户信息'
        }
      },
      // {
      //   path: 'user-group',
      //   component: () => import('@/views/user/userGroup'),
      //   name: '用户分组',
      //   meta: { title: '用户分组' }
      // },
      {
        path: 'ip-riskmanage',
        component: () => import('@/views/user/riskManage'),
        name: '封禁记录',
        meta: {
          title: '封禁记录'
        }
      }
    ]
  },
  {
    path: '/acceptor',
    component: Layout,
    permissions: 'Manager',
    redirect: '/acceptor/appAcceptor',
    meta: {
      title: '承兑人管理',
      icon: 'tab'
    },
    children: [{
        path: 'app-acceptor',
        component: () => import('@/views/acceptor/appAcceptor'),
        name: '承兑人申请',
        meta: {
          title: '承兑人申请'
        }
      },
      {
        path: 'acceptor-management',
        component: () => import('@/views/acceptor/acceptorManagement'),
        name: '承兑人管理',
        meta: {
          title: '承兑人管理'
        }
      },
      {
        path: 'get-acceptor-management',
        component: () => import('@/views/acceptor/getMoneyAccountManager'),
        name: '收款账户管理',
        meta: {
          title: '收款账户管理'
        }
      },
      {
        path: 'acceptor-feed-book',
        component: () => import('@/views/acceptor/acceptorFeedBack'),
        name: '承兑人反馈',
        meta: {
          title: '承兑人反馈'
        }
      }

    ]
  },

  {
    path: '/merchant',
    component: Layout,
    permissions: 'Manager',
    redirect: '/merchant/merchatApply',
    meta: {
      title: '商家管理',
      icon: 'tab'
    },
    children: [{
        path: 'merchat-apply',
        component: () => import('@/views/merchant/merchatApply'),
        name: '商家申请',
        meta: {
          title: '商家申请'
        }
      },
      {
        path: 'merchant-manage',
        component: () => import('@/views/merchant/merchantManage'),
        name: '商家管理',
        meta: {
          title: '商家管理'
        }
      },
      {
        path: 'blacklist-manage',
        component: () => import('@/views/merchant/blacklistManage'),
        name: '商家黑名单',
        meta: {
          title: '商家黑名单'
        }
      }
    ]
  },
  tableRouter,
  {
    path: '/service',
    component: Layout,
    alwaysShow: true,
    permissions: 'Manager',
    redirect: '/service/repair-manage',
    meta: {
      title: '客服中心',
      icon: 'table'
    },
    children: [{
        path: 'repair-manage',
        component: () => import('@/views/repair/repairBill'),
        name: '工单中心',
        meta: {
          title: '工单中心'
        }
      },
      {
        path: 'abnormal-manage',
        component: () => import('@/views/order/exceptionOrder'),
        name: '异常报备',
        meta: {
          title: '异常报备'
        }
      }
    ]
  },
  {
    path: '/financial',
    component: Layout,
    alwaysShow: true,
    permissions: 'Manager',
    redirect: '/financial/waterOrder',
    meta: {
      title: '财务管理',
      icon: 'table'
    },
    children: [{
        path: 'water-order',
        component: () => import('@/views/financial/waterOrder'),
        name: '流水账单',
        meta: {
          title: '流水账单'
        }
      }, {
        path: 'fee-recorder',
        component: () => import('@/views/financial/feeRecorder'),
        name: '手续费记录',
        meta: {
          title: '手续费记录'
        }
      }, {
        path: 'fen-run',
        component: () => import('@/views/financial/FenRun'),
        name: '承兑人分润',
        meta: {
          title: '承兑人分润'
        }
      }, {
        path: 'fen-run-setting',
        component: () => import('@/views/financial/fenRunSetting'),
        name: '分润设置',
        meta: {
          title: '分润设置'
        }
      },
      {
        path: 'fenrun-detail/:timeperiod',
        component: () => import('@/views/financial/fenrunDetail'),
        name: '分润',
        meta: {
          title: '分润'
        },
        hidden: true
      },
      {
        path: 'pre-fenrun-detail/:id',
        component: () => import('@/views/financial/preFunRunDetail'),
        name: '预分润详情',
        meta: {
          title: '预分润详情'
        },
        hidden: true
      },
      {
        path: 'history-fenrun/:id',
        component: () => import('@/views/financial/historyFenRun'),
        name: '历史分润',
        meta: {
          title: '历史分润'
        },
        hidden: true
      },
      {
        path: 'history-fenrun-detail/:id',
        component: () => import('@/views/financial/historyFenRunDetail'),
        name: '分润详情',
        meta: {
          title: '分润详情'
        },
        hidden: true
      },
      {
        path: 'rate-setting',
        component: () => import('@/views/financial/rateSetting'),
        name: '费率设置',
        meta: {
          title: '费率设置'
        },
      },
    ]
  },
  // {
  //   path: '/statis',
  //   component: Layout,
  //   permissions: 'Manager',
  //   meta: {
  //     title: '数据统计',
  //     icon: 'tab'
  //   },
  //   children: [
  //     {
  //       path: 'merchant-statis',
  //       component: () => import('@/views/statis/merchantStatis'),
  //       name: '商家数据',
  //       meta: { title: '商家数据' }
  //     },
  //     {
  //       path: 'member-statis',
  //       component: () => import('@/views/statis/memberStatis'),
  //       name: '会员数据',
  //       meta: { title: '会员数据' }
  //     },
  //     {
  //       path: 'order-statis',
  //       component: () => import('@/views/statis/orderStatis'),
  //       name: '订单数据',
  //       meta: { title: '订单数据' }
  //     }
  //   ]
  // },
  {
    path: '/account',
    component: Layout,
    alwaysShow: true,
    redirect: '/account/accManage',
    permissions: 'Manager',
    meta: {
      title: '系统管理',
      icon: 'table'
    },
    children: [{
        path: 'account-manage',
        component: () => import('@/views/accountManage/accManage'),
        name: '账户管理',
        meta: {
          title: '账户管理'
        }
      },
      /*
      {
        path: 'role-manage',
        component: () => import('@/views/accountManage/roleManage'),
        name: '角色管理',
        meta: { title: '角色管理' },
      },*/
      {
        path: 'role-manage/role-edit',
        component: () => import('@/views/accountManage/roleEdit'),
        name: '角色编辑',
        meta: {
          title: '角色编辑'
        },
        hidden: true,
      },
      {
        path: 'role-manage/role-detail',
        component: () => import('@/views/accountManage/roleEdit'),
        name: '角色详情',
        meta: {
          title: '角色详情'
        },
        hidden: true,
      },
      {
        path: 'log',
        component: () => import('@/views/accountManage/log'),
        name: '操作日志',
        meta: {
          title: '操作日志'
        }
      }
    ]
  },

  {
    path: '/chat',
    component: Layout,
    alwaysShow: true,
    redirect: '/chat/index',
    permissions: 'customerService',
    meta: {
      title: '联系客服',
      icon: 'table'
    },
    children: [{
      path: 'index',
      component: () => import('@/views/chat/index'),
      name: '当前会话',
      meta: {
        title: '当前会话'
      }
    }]
  },
  // {
  //   path: '/immsg',
  //   permissions: 'Manager',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'immsg',
  //       component: () => import('@/views/websocket/immsg'),
  //       name: 'immsg消息',
  //       meta: { title: 'immsg消息', icon: 'tab', noCache: true }
  //     }
  //   ]
  // },

]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

]
