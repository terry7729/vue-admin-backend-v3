import request from '@/utils/request'
import config from '../../env/config'

/**
 * 后台IM 查询最近3天的聊天列表
 */
export function getLastSessionGroupList(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/getLastSessionGroupList',
    method: 'get',
    params: params
  })
}
/**
 * 后台IM 查询工单详情
 */
export function qryIMRepairBillDetail(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/qryIMRepairBillDetail',
    method: 'get',
    params: params
  })
}
/**
 * 后台IM 修改金额
 */
export function updateIMAmount(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/updateIMAmount',
    method: 'post',
    params: params
  })
}
/**
 * 后台IM 修改会员号
 */
export function updateIMSubName(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/updateIMSubName',
    method: 'post',
    params: params
  })
}


/**
 * 后台IM 查询关联订单列表
 */
export function qryIMFastPayTrade(params) {
  return request({
    url: config.URL_JAVA + 'trade/qryIMFastPayTrade',
    method: 'get',
    params: params
  })
}
/**
 * 后台IM 修改订单号
 */
export function updateIMTandeId(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/updateIMTandeId',
    method: 'post',
    params: params
  })
}

/**
 * 后台IM 查询补单列表
 */
export function qryIMFastPayRepairTrade(params) {
  return request({
    url: config.URL_JAVA + 'trade/qryIMFastPayRepairTrade',
    method: 'get',
    params: params
  })
}
/**
 * 后台IM 新建普通补单
 */
export function IMRepairOrder(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/IMRepairOrder',
    method: 'post',
    data: params
  })
}
/**
 * 后台IM 新建关联补单
 */
export function relationRepairOrder(params) {
  return request({
    url: config.URL_JAVA + 'trade/repairOrder',
    method: 'post',
    data: params
  })
}
/**
 * 后台IM 修改补单号
 */
export function updateIMRepairTrade(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/updateIMRepairTrade',
    method: 'post',
    params: params
  })
}
/**
 * 通过用户名获取聊天的uid
 */
export function getUidByAccount(params) {
  return request({
    url: config.IM_UID_CONFIG + 'v1/nacaiim/getUidByAccount',
    method: 'post',
    data: params
  })
}
/**
 * 把聊天的人添加到对应的工单号聊天组里
 */
export function addUserToSessionList(params) {
  return request({
    url: config.URL_JAVA + 'repairBill/addUserToSessionList',
    method: 'post',
    params: params
  })
}

/**获取支付方式
 * qryPayCardMatchInfo
 */
export function qryPayCardMatchInfo(params) {
  return request({
    url: config.URL_JAVA + 'paycard/qryPayCardMatchInfo',
    method: 'get',
    params: params
  })
}
/**
 * 工单im里更新异常单号
 */
export function updateAbnormalBill(params) {
  return request({
    url: config.URL_JAVA + 'AbnormalBill/updateAbnormalBill',
    method: 'post',
    params: params
  })
}
