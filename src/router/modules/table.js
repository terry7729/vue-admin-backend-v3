/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/order',
  component: Layout,
  alwaysShow: true,
  permissions: 'Manager',
  redirect: '/order/complex-table',
  meta: {
    title: '交易管理',
    icon: 'table'
  },
  children: [
    {
      path: 'order-manage/:orderId',
      component: () => import('@/views/order/orderManage'),
      name: '订单管理',
      meta: { title: '订单管理' }
    },
    {
      path: 'paytype-manage',
      component: () => import('@/views/order/payTypeManage'),
      name: '支付通道',
      meta: { title: '支付通道' }
    },
    {
      path: 'change-account',
      component: () => import('@/views/order/changeAccount'),
      name: '切换账户记录',
      meta: { title: '切换账户记录' }
    },
    {
      path: 'cancle-record',
      component: () => import('@/views/order/cancleRecord'),
      name: '取消记录',
      meta: { title: '取消记录' }
    }
    /*
    {
      path: 'complaint-management',
      component: () => import('@/views/order/complaintManagement'),
      name: '申诉管理',
      meta: { title: '申诉管理' }
    },*/

  ]
}
export default tableRouter
