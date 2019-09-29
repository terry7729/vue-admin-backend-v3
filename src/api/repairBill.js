import request from '@/utils/request'
import config from '../../env/config'

/**
 * 点击查询按钮，根据标签和输入的查询条件查询工单列表
 */
export function qryRepairBillList(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/qryRepairBillList',
    method: 'get',
    params: param
  })
}

/**
 * 根据标签查询工单列表
 */
export function qryRepairBillListWithLabel(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/qryRepairBillListWithLabel',
    method: 'get',
    params: param
  })
}
/**
 * 新增工单
 */
export function addNewRepairBill(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/addNewRepairBill',
    method: 'post',
    data: param
  })
}
/**
 * 预先查询订单号
 */
export function getPreRepairBillNo(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/getPreRepairBillNo',
    method: 'get',
    params: param
  })
}
/**
 * 新增工单，查询工单受理人列表
 */
export function qryManagerForSelect(param) {
  return request({
    url: config.URL_JAVA + 'manager/qryManagerForSelect',
    method: 'get',
    params: param
  })
}
/**
 * 根据角色，查询用户列表
 */
export function getAccepterList(params) {
  return request({
    url: 'v3/api/accepter/matchcenter/basic/v2/qryAcceptorOnlineSelectList',
    method: 'get',
    params: params
  })
}
/**根据角色，查商家的列表
 * /funding/webBackend/getMerchantList
 */
export function getMerchantList() {
  return request({
    url: config.URL_GO + 'funding/webBackend/getMerchantList',
    method: 'post'
  })
}


/**
 * 上传图片
 */
export function addImgFile(param) {
  return request({
    url: config.URL_JAVA + 'image/addImgFile',
    method: 'post',
    data: param
  })
}
/**
 * 通过工单id，获得工单详情
 */
export function qryRepairBillDetail(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/qryRepairBillDetail',
    method: 'get',
    params: param
  })
}
/**
 * 更新工单的优先级
 */
export function updatePriority(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/updatePriority',
    method: 'post',
    params: param
  })
}
/**
 * 分配/转交工单
 */
export function handOverOrDistributeReceiver(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/handOverOrDistributeReceiver',
    method: 'post',
    params: param
  })
}
/**
 * 跟进工单
 */
export function traceBill(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/traceBill',
    method: 'post',
    params: param
  })
}
/**
 * 完结工单
 */
export function finishBill(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/finishBill',
    method: 'post',
    params: param
  })
}
/**
 * 重启工单
 */
export function rebootBill(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/rebootBill',
    method: 'post',
    params: param
  })
}
/**
 * 修改工单
 */
export function updateIMInfo(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/updateIMInfo',
    method: 'post',
    data: param
  })
}
/**
 * 增加工单类型
 */
export function addRepairBillType(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/addRepairBillType',
    method: 'post',
    data: param
  })
}
/**
 * 删除工单类型
 */
export function deleteRepairBillType(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/deleteRepairBillType',
    method: 'post',
    params: param
  })
}
/**
 * 获取工单类型
 */
export function getRepairBillType(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/getRepairBillType',
    method: 'get',
    params: param
  })
}
/**
 * 查询我受理的未读工单
 */
export function qryMyNotReadAcceptBill(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/qryMyNotReadAcceptBill',
    method: 'get',
    params: param
  })
}

/**
 * 查询商家和承兑人未受理订单数量
 */
export function qryNotDistBillForMerchant(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/qryNotDistBillForMerchant',
    method: 'get',
    params: param
  })
}
/**
 * 更新我受理的未读工单数量
 */
export function updateMyNotReadAcceptBill(param) {
  return request({
    url: config.URL_JAVA + 'repairBill/updateMyNotReadAcceptBill',
    method: 'post',
    params: param
  })
}

/**转交，分配获取用户名、昵称
 * funding/backend/getBackendUserList
 */
/*
export function getBackendUserList(param){
  return request({
    url: config.URL_GO+'ucenter/backend/getBackendUserListFrontend',
    method: 'post',
    data: param
  })
}
*/
export function getBackendUserList(param) {
  return request({
    url: config.URL_GO + 'ucenter/backend/getBackendUserList',
    method: 'post',
    data: param
  })
}
