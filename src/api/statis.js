import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'
/**
 * 统计商家订单
 */
export function merchantStatisCount(param) {
    console.log(3333);
    return request({
        url: config.URL_GO + 'merchant/count',
        method: 'get',
        params: param
    })
}
/**
 * 统计商家订单
 */
export function merchantStatisList(param) {
    return request({
        url: config.URL_GO + 'merchant/querylist',
        method: 'get',
        params: param
    })
}
/**
 * 统计会员数据
 */
export function memberStatisList(param) {
    return request({
        url: config.URL_GO + 'merchantUser/querylist',
        method: 'get',
        params: param
    })
}
/**
 * 统计运营后台订单统计
 */
export function orderStatisList(param) {
    return request({
        url: config.URL_GO + 'trade/querylist',
        method: 'get',
        params: param
    })
}