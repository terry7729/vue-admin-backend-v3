import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'

/**
 * 订单管理
 */
/*
export function orderManageList(param) {
  return request({
    url: config.URL_JAVA+'trade/list',
    method: 'get',
    params: param
  })
}*/

// 账户列表显示
export function getQueryAccount(param) {
  return request({
    url: config.URL_JAVA+'manager/queryAccount',
    method: 'get',
    params: param
  })
}

// 禁用账户
export function disableAccount(param) {
  return request({
    url: config.URL_JAVA+'manager/ApiImplicitParam',
    method: 'post',
    data: Qs.stringify(param)
  })
}

// 启用账户
export function enableAccount(param) {
  return request({
    url: config.URL_JAVA+'manager/initiateAccount',
    method: 'post',
    data: Qs.stringify(param)
  })
}

// 创建后台管理账户
export function creatAccount(param) {
  return request({
    url: config.URL_JAVA+'manager/createAccount',
    method: 'post',
    data: Qs.stringify(param)
  })
}

// 重置密码
export function resetAccount(param) {
  return request({
    url: config.URL_JAVA+'manager/changepasswd',
    method: 'post',
    data: Qs.stringify(param)
  })
}
// 查询账户
export function queryAccount(param) {
  return request({
    url: config.URL_JAVA+'manager/queryAccount',
    method: 'get',
    params: param
  })
}

/**
 * 取消订单
 */
/*
export function cancelOrder(param) {
  return request({
    url: config.URL_JAVA+'trade/cancel?tradeId=' + param.tradeId + '&tradeType=' + param.tradeType + '&accepterName=' + param.accepterName + '&ordinaryName=' + param.ordinaryName,
    method: 'post'
  })
}*/

/**
 * 重新分配承兑人
 * manager/trade/reassignment
 */
export function startAcceptor(param) {
  return request({
    url: config.URL_JAVA+'trade/reassignment',
    method: 'post',
    data: Qs.stringify(param)
  })
}
/**
 * 重启订单
 * manager/trade/reboot
 */
export function reStartOrder(param) {
  return request({
    url: config.URL_JAVA+'trade/reboot',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 解除承兑人冻结
 * trade/unfreezeAccepterGAC
 */
export function unfreezeAccepterGAC(param) {
  return request({
    url: config.URL_JAVA+'trade/unfreezeAccepterGAC',
    method: 'post',
    data: Qs.stringify(param)
  })
}
/**
 * 日志列表
 * manager/log/list
 */
export function loglist(param) {
  return request({
    url: config.URL_JAVA+'log/list',
    method: 'get',
    params: param
  })
}

/**
 * 获取承兑人信息
 * trade/getAccepterTradeInfo
 */
export function queryPayCardInfoDetail(param) {
  return request({
    url: config.URL_JAVA+'acptPayCardInfo/queryPayCardInfoDetail',
    method: 'get',
    params: param
  })
}

/** 放行订单 */
export function dischargedTrade(param) {
  return request({
    url: config.URL_JAVA+'trade/dischargedTrade',
    method: 'post',
    data: Qs.stringify(param)
  })
}
/** 支付通道开关 */
export function payTypeSwitch(param) {
  return request({
    url: config.URL_JAVA+'matchManage/payment/channel/switch',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/** 支付通道列表 */
export function payTypeList(param) {
  return request({
    url: config.URL_JAVA+'matchManage/payment/channel/list',
    method: 'get',
    params: param
  })
}

/** 订单管理，切换账户记录 */
export function buyChangeList(param) {
  return request({
    url: config.URL_JAVA+'trade/buyChangeList',
    method: 'get',
    params: param
  })
}
/** 订单管理，取消记录 */
export function buyCancelList(param) {
  return request({
    url: config.URL_JAVA+'trade/buyCancelList',
    method: 'get',
    params: param
  })
}
export function exportCancelList(param) {
  return request({
    url: config.URL_JAVA+'trade/exportCancelList',
    method: 'get',
    params: param
  })
}
/**
/** 订单接口轮训
 * /broadcastMsg/checkMsgBusiNew
*/
export function checkMsgBusiNew(param) {
  return request({
    url: config.URL_JAVA+'broadcastMsg/checkMsgBusiNew',
    method: 'post',
    data: param
  })
}
/**
   *
   * 导出
   *
   */
  export function exportList(param) {
    return request({
      url: config.URL_JAVA+'trade/exportList',
      method: 'get',
      params: param,
      responseType: 'blob'
    })
  }
/** 
 * 新建补单
 * POST /trade/repairOrder
 */
export function repairOrder(param) {
  return request({
    url: config.URL_JAVA+'trade/repairOrder',
    method: 'post',
    data: param
  })
}
/**
 * GET /paycard/getPayCardInfo 获取卡信息
 */
export function getPayCardInfo(param) {
  return request({
    url: config.URL_JAVA+'paycard/getPayCardInfo',
    method: 'get',
    params: param
  })
}
/**
 * GET GET /merchant/getMerchant 获取发起人（商家）
 */
export function getMerchantList(param) {
  return request({
    url: config.URL_JAVA+'merchant/getMerchantList',
    method: 'get',
    params: param
  })
}
/**
 * /acceptor/v2/getAccepter 获取承兑人
 */
export function getAccepterList(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/getAccepterList',
    method: 'get',
    params: param
  })
}

/**放行  go */
export function passOrder(param){
  return request({
    url: config.URL_GO+'funding/backend/passOrder',
    method: 'post',
    data: param
  })
}

/**订单取消 go 
 * SellAccepterCancel
*/
export function SellAccepterCancel(param){
  return request({
    url: config.URL_GO+'SellAccepterCancel',
    method: 'post',
    data: param
  })
}

/**订单管理列表  go */
export function orderManageList(param){
  return request({
    url: config.URL_GO+'funding/backend/getOrderList',
    method: 'post',
    data: param
  })
}

/*取消订单 go */
export function cancelOrder(param){
  return request({
    url: config.URL_GO+'funding/backend/cancelOrder',
    method: 'post',
    data: param
  })
}
/**
 * 重启订单
 * @param {*} param 
 */
export function rebootOrder(param){
  return request({
    url: config.URL_GO + 'rebootOrder',
    method: 'post',
    data: param
  })
}

/**账户管理 go */
/*
export function getBankendUserList(param){
  return request({
    url: config.URL_GO+'ucenter/backend/getBackendUserListFrontend',
    method: 'post',
    data: param
  })
}*/

export function getBankendUserList(param){
  return request({
    url: config.URL_GO+'ucenter/backend/getBackendUserList',
    method: 'post',
    data: param
  })
}

/**账户管理 go 新增账户  */
export function addBackEndUser(param){
  return request({
    url: config.URL_GO+'ucenter/backend/addBackEndUser',
    method: 'post',
    data: param
  })
}

/**账户管理 禁用、启用 */
export function disableBackEndUserReq(param){
  return request({
    url: config.URL_GO+'ucenter/backend/disableBackEndUser',
    method: 'post',
    data: param
  })
}

/**账户管理 重置密码
 * go
 * resetBackEndUserPasswd
 */
export function resetBackEndUserPasswd(param){
  return request({
    url: config.URL_GO+'ucenter/backend/resetBackEndUserPasswd',
    method: 'post',
    data: param
  })
}
