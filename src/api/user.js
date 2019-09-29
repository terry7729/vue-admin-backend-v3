import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'

/**
 *
 * 用户信息列表
 * /queryUser
 */
export function queryUser(param) {
  return request({
    url: config.URL_JAVA+'user/queryUser',
    method: 'get',
    params: param
  })
}

/**
   * 用户信息冻结操作
   *
   */
export function alterUserStatus(param) {
  return request({
    url: config.URL_JAVA+'user/alterUserStatus',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 用户分组列表显示
 * /listUserClasses
 */
export function listUserClasses() {
  return request({
    url: config.URL_JAVA+'manager/listUserClasses',
    method: 'get'
  })
}

/**
 * 用户分组编辑
 */
export function editUserClasses(param) {
  return request({
    url: config.URL_JAVA+'manager/editUserClasses',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 客服聊天系统,获取会话中的列表
 * /support/getMessage
 */
export function getMessageimg() {
  return request({
    url: config.URL_JAVA+'msgcenter/chatOper/getClientList',
    method: 'post'
  })
}

/**
 * 客服聊天系统，发送消息
 * pushMessage
 */
export function pushMessage(param) {
  return request({
    url: config.URL_JAVA+'msgcenter/chatOper/sendChatMsg',
    method: 'post',
    data: Qs.stringify(param)
  })
}

/**
 * 客服聊天,获取用户信息
 */
export function findUserInformation(param) {
  return request({
    url: config.URL_JAVA+'manager/findUser',
    method: 'get',
    params: param
  })
}
/**
 * 具体聊天信息
 * getMessageFromUser
 */
export function getMessageFromUser(param) {
  return request({
    url: config.URL_JAVA+'msgcenter/chatOper/getLatestRecordFromUser',
    method: 'post',
    params: Qs.stringify(param)
  })
}
/**
 * 获取历史聊天记录
 * getHistoryMessage
 */
export function getHistoryMessage(param) {
  return request({
    url: config.URL_JAVA+'msgcenter/chatOper/getHistoryRecord',
    method: 'post',
    params: Qs.stringify(param)
  })
}

/**
 * 财务管理系统
 * 手续费记录
 */
export function queryChargeRecord(param) {
  return request({
    url: config.URL_JAVA+'chargeRecord/queryChargeRecord',
    method: 'get',
    params: param
  })
}

/**
 * 手续费记录 统计
 * /chargeRecord/stateAllChargeInfoByRange
 */
export function stateAllChargeInfoByRange(param) {
  return request({
    url: config.URL_JAVA+'chargeRecord/stateAllChargeInfoByRange',
    method: 'get',
    params: param
  })
}

/**用户信息 冻结 解冻
 * blacklist
 */
export function blacklist(param) {
  return request({
    url: config.URL_GO+'funding/backend/blacklist',
    method: 'post',
    data: param
  })
}

/**用户信息
 * getUsersInfo
 */
export function getUsersInfo(param) {
  return request({
    url: config.URL_GO+'funding/backend/getUsersInfo',
    method: 'post',
    data: param
  })
}

/**
 * 封禁记录
 */
export function riskRecordList(params) {
  return request({
    url: config.URL_JAVA+'forbid/recordList',
    method: 'get',
    params: params
  })
}
/**
 * 封禁记录解封
 */
export function riskRecordUnban(params) {
  return request({
    url: config.URL_JAVA+'forbid/unban',
    method: 'post',
    params: params
  })
}
