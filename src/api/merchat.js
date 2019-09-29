import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'

/**
 *
 * 商家申请列表显示
 * merchant/list
 */
export function merchanApplytList(param) {
  return request({
    url: config.URL_JAVA + 'merchant/apply/list',
    method: 'get',
    params: param
  })
}

/**
 * 商家申请审核 通过 不通过
 * /merchant/apply/edit
 */
export function merchanApplytEdit(param) {
  return request({
    url: config.URL_JAVA + 'merchant/apply/edit',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 修改备注
 */
/*
export function updateRemark(param) {
  return request({
    url: config.URL_JAVA+'merchant/remark',
    method: 'post',
    data: Qs.stringify(param)
  })
}
*/
/**商家管理修改备注
 * order/statistics/merchant/updateMerchantRemark
 */
export function updateMerchantRemark(param) {
  return request({
    url: config.URL_GO + 'order/statistics/merchant/updateMerchantRemark',
    method: 'post',
    data: param
  })
}


/**
 *
 * 商家申请 获取秘钥
 * getMerchant
 */
export function getMerchant(param) {
  return request({
    url: config.URL_JAVA + 'manager/merchant/getMerchantByName',
    method: 'get',
    params: param
  })
}

/**
 * 商家管理列表
 * merchant/list
 */
/*
export function merchantManageList(param) {
  return request({
    url: config.URL_JAVA+'merchant/list',
    method: 'get',
    params: param
  })
}
*/
/**商家管理列表
 * order/statistics/merchant/queryMerchantList
 */
export function queryMerchantList(param) {
  return request({
    url: config.URL_GO + 'order/statistics/merchant/queryMerchantList',
    method: 'post',
    data: param
  })
}

/**
 * 查看密钥
 * /merchant/getMerchant
 */
export function getMerchantScreate(param) {
  return request({
    url: config.URL_JAVA + 'merchant/getMerchant',
    method: 'get',
    params: param
  })
}

/**
 * /merchant/edit  商家管理移除商家
 */
export function merchantEdit(param) {
  return request({
    url: config.URL_JAVA + 'merchant/edit',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 获取商家连接
 * /merchant/getPyUrl
 */
export function getPyUrl(param) {
  return request({
    url: config.URL_JAVA + 'merchant/getPyUrl?userName=' + param.userName,
    method: 'get',
    data: param
  })
}

/** 修改商家模式
 * /merchant/updateAutoChargeType
 */
/*
export function updateAutoChargeType(param) {
  return request({
    url: config.URL_JAVA+'merchant/updateAutoChargeType',
    method: 'post',
    data: Qs.stringify(param)
  })
}
*/
/**
 * 修改商家模式
 * order/statistics/merchant/updateMerchantChargeType
 */
export function updateMerchantChargeType(param) {
  return request({
    url: config.URL_GO + 'order/statistics/merchant/updateMerchantChargeType',
    method: 'post',
    data: param
  })
}


/**商家申请通过、不通过  reviewMerchant */
export function reviewMerchant(param) {
  return request({
    url: config.URL_GO + 'funding/backend/reviewMerchant',
    method: 'post',
    data: param
  })
}

/*商家申请列表 go */
export function getNeedReviewAccepterList(param) {
  return request({
    url: config.URL_GO + 'funding/backend/getNeedReviewMerchantList',
    method: 'post',
    data: param
  })
}


/************************* 黑名单操作 ********************/
export function queryBlacklist(param) {
  return request({
    url: config.URL_GO + 'funding/backend/sellBlackList/queryList',
    method: 'post',
    data: param
  })
}
export function addBlacklist(param) {
  return request({
    url: config.URL_GO + 'funding/backend/sellBlackList/addBlackName',
    method: 'post',
    data: param
  })
}
export function deleteBlacklist(param) {
  return request({
    url: config.URL_GO + 'funding/backend/sellBlackList/delBlackName',
    method: 'post',
    data: param
  })
}
export function queryMerchantSelectList(param) {
  return request({
    url: config.URL_GO + 'funding/backend/merchantInfo/queryMerchantSelectList',
    method: 'post',
    data: param
  })
}
// 商家配置通道
export function payMerchantChannelConfig(param) {
  return request({
    url: config.URL_GO + 'merchant/webMerchantPayChannelBlacklistConfig',
    method: 'post',
    data: param
  })
}