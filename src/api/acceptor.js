import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'
/**
 *
 * 导出资金流水
 */
export function exportTradeBill(param) {
  return request({
    url: config.URL_JAVA+'tradeBill/exportTradeBill',
    method: 'get',
    params: param,
    responseType: 'blob'
  })
}
/**
 *
 * 承兑人列表显示
 */
export function fetchList(param) {
  return request({
    url: config.URL_JAVA+'accepter/apply/list',
    method: 'get',
    params: param
  })
}

/**
   *
   * 承兑人 通过  不通过操作
   * /accepter/apply/review
   *
   */
export function acceptorReview(param) {
  return request({
    url: config.URL_JAVA+'accepter/apply/review',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
   * 承兑人管理列表显示
   */
export function acceptorList(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/list',
    method: 'get',
    params: param
  })
}

/**
   *
   * 编辑承兑人管理页面
   * /acceptor/apply/review
   *
   */
export function acceptorUpdate(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/update',
    method: 'post',
    data: param
  })
}

/**
   * 承兑人管理页面 暂停 启用
   * /acceptor/alterStatus
   */
export function acceptorAlterStatus(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/alterStatus',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
   * 移除承兑人管理
   *
   */
export function acceptorDelete(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/delete',
    method: 'post',
    params: param
  })
}

/**
   * 承兑人管理罚款
   */
export function acceptorPunish(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/punish',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 流水
 * queryChargeRecord
 */
/*
export function queryChargeRecord(param) {
  return request({
    //url: config.URL_JAVA+'tradeBill/queryTradeBill',
    url: config.URL_GO+'qapple/api/backend/bill/flow_bill/querylist',
    method: 'get',
    params: param
  })
}
*/
/**
 * 流水账单
 * bill/getFlowBill
 */
export function queryChargeRecord(param) {
  return request({
    url: config.URL_GO+'bill/getFlowBill',
    method: 'post',
    data: param
  })
}


/** 收款账户管理
 * paycard/qryPayCardInfo
 * getMoneyAcceptorManageList
 */
export function qryPayCardInfo(param) {
  return request({
    url: config.URL_JAVA + 'paycard/qryPayCardInfo',
    method: 'get',
    params: param
  })
}

/**承兑人分润列表
 * /v1/nc/api/backend/ShareProfit/list
 */
export function shareProfitList(param) {
  return request({
    url: config.URL_GO + 'ShareProfit/list',
    method: 'get',
    params: param
  })
}
/**设为已分润、设置额外分润、设为未分润
 * /v1/nc/api/backend/SetProfitStatus
 */
export function SetProfitStatus(param) {
  return request({
    url: config.URL_GO + 'SetProfitStatus',
    method: 'post',
    data: param
  })
}

/**分润详情显示
 * /v1/nc/api/backend/QueryProfitRate
 */
export function QueryProfitRate() {
  return request({
    url: config.URL_GO + 'QueryProfitRate',
    method: 'get'
  })
}
/**保存分润详情设置
 * /v1/nc/api/backend/setProfitRate
 */
export function setProfitRate(param) {
  return request({
    url: config.URL_GO + 'setProfitRate',
    method: 'post',
    data: param
  })
}


/**承兑人管理匹配设置
 * http://192.168.0.183:8000/v2/api/backend/acceptor/v2/get?id=122
 */
export function getMatchInfo(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/getMatchInfo',
    method:"get",
    params:param
  })
}

/**承兑人管理修改承兑人管理信息
 * /acceptor/v2/update
 */
export function updateMatchInfo(param) {
  return request({
    url: config.URL_JAVA+'acceptor/v2/updateMatchInfo',
    method: 'post',
    data: param
  })
}

/**收款账户管理 匹配设置 
 * /paycard/qryPayCardMatchInfo
*/
export function qryPayCardMatchInfo(param) {
  return request({
    url: config.URL_JAVA+'paycard/qryPayCardMatchInfo',
    // url: 'paycard/qryPayCardMatchInfo',
    method: 'get',
    params: param
  })
}

/**收款账户管理 修改匹配设置
 * /paycard/updatePayCardMatchInfo
 */
export function updatePayCardMatchInfo(param) {
  return request({
   // url: config.URL_JAVA+'paycard/updatePayCardMatchInfo',
    url: config.URL_JAVA + 'paycard/updatePayCardMatchInfo',
    method: 'post',
    data: param
  })
}
/**申请承兑人查询列表  getNeedReviewAccepterList */
export function getNeedReviewAccepterList(param){
  return request({
    url: config.URL_GO+'funding/backend/getNeedReviewAccepterList',
    method: 'post',
    data: param
  })
}


/**承兑人移除 removeAccepter */
export function removeAccepter(param){
  return request({
    url: config.URL_GO+'funding/backend/removeAccepter',
    method: 'post',
    data: param
  })
}

/**承兑人罚款 fineAccepter */
export function fineAccepter(param){
  return request({
    url: config.URL_GO+'funding/backend/fineAccepter',
    method: 'post',
    data: param
  })
}

/**承兑人申请 通过不通过 reviewAccepter */
export function reviewAccepter(param){
  return request({
    url: config.URL_GO+'funding/backend/reviewAccepter',
    method: 'post',
    data: param
  })
}

/**
 * 费率列表查询
 */
export function queryFundRateInfoList(param) {
  return request({
    url: config.URL_JAVA+'chargeRate/queryFundRateInfoList',
    method: 'get',
    params: param
  })
}
/**
 * 更新在现在黄台
 */
export function updateCardOpenStatus(param) {
  return request({
    url: config.URL_JAVA + 'paycard/updateCardOpenStatus',
    method: 'post',
    params: param
  })
}
/*
 * 费率更新
 */
export function updateFundRateInfo(param) {
  return request({
    url: config.URL_JAVA+'chargeRate/updateFundRateInfo',
    method: 'post',
    params: param
  })
}

/**
 * 承兑人反馈
 * /accepterFeedback/queryAccepterFeedbackList
 */
export function queryAccepterFeedbackList(param) {
  return request({
    url: config.URL_JAVA+'accepterFeedback/queryAccepterFeedbackList',
    method: 'get',
    params: param
  })
}

/**
 * 承兑人反馈 标记为已处理
 * /accepterFeedback/makeHandledFlag
 */
export function makeHandledFlag(param) {
  return request({
    url: config.URL_JAVA+'accepterFeedback/makeHandledFlag',
    method: 'post',
    params: param
  })
}

/**承兑人反馈 标记为备注 
 * /accepterFeedback/remark
*/
export function feedBackRemark(param) {
  return request({
    url: config.URL_JAVA+'accepterFeedback/remark',
    method: 'post',
    params: param
  })
}

/**费率设置
 * /v1/qapple/api/setting/feeRate/querylist
 */
export function feeQuerylist(param) {
  return request({
    url: config.URL_GO+'setting/feeRate/queryList',
    method: 'get',
    params:param
  })
}

/**费率设置
 * v1/qapple/api/setting/feeRate/setRate
 */
export function feeSetRate(param) {
  return request({
    url: config.URL_GO+'setting/feeRate/setRate',
    method: 'post',
    data:param
  })
}