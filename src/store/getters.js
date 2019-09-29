const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  listenList: state => state.app.listenList,

  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,

  token: state => state.user.token,
  loginParam: state => state.user.loginParam,

  // 工单中心
  accepterBillNum: state => state.repair.accepterBillNum,
  businessBillNum: state => state.repair.businessBillNum,
  myDealBillNum: state => state.repair.myDealBillNum,

  // immsg聊天
  immsgBoxShow: state => state.immsg.immsgBoxShow, // 聊天窗口是否显示
  immsgUnread: state => state.immsg.immsgUnread, // 所有未读的消息数量


}
export default getters
