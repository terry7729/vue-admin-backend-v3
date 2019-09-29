import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'


export function qryAbnormalBill(param) {
  return request({
    url: config.URL_GO + 'funding/backend/abnormalBill/qryAbnormalBill',
    method: 'post',
    data: param
  })
}
/**
 * 查询一周的异常订单
 */
export function getAbnormalBillOfWeek(param) {
  return request({
    // url: config.URL_JAVA + 'AbnormalBill/qryAbnormalBillList',
    url: config.URL_GO + 'funding/backend/abnormalBill/qryAbnormalBillList',
    method: 'post',
    data: param
  })
}

/**修改标记
 * /AbnormalBill/updateHandlerStatus
 */
export function updateHandlerStatus(param) {
  return request({
    url: config.URL_JAVA + 'AbnormalBill/updateHandlerStatus',
    method: 'post',
    params: param
  })
}
/** 
 * 新建补单
 * POST funding/webBackend/abnormal/updateRepairTrade
 */
export function updateRepairTrade(param) {
  return request({
    url: config.URL_JAVA + 'trade/repairOrder',
    method: 'post',
    data: param
  })
}
/**查看补单
 * /trade/qryIMFastPayTrade
 */
export function qryIMFastPayTrade(param) {
  return request({
    url: config.URL_JAVA + 'trade/qryIMFastPayTrade',
    method: 'get',
    params: param
  })
}
/**异常单列表关联订单
 */
export function updateAbnormalBill(param) {
  return request({
    url: config.URL_JAVA + 'AbnormalBill/updateAbnormalBill',
    method: 'post',
    params: param
  })
}
