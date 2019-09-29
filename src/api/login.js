import request from '@/utils/request'
import Qs from 'qs'
import config from '../../env/config'
// 登陆
export function loginByUsername(mobile_no, passwd,salt) {
  const data = {
    mobile_no,
    passwd,
    salt
  }
  console.log(data,'-------data-----')
  return request({
   // url: config.URL_JAVA+'manager/checkAccount',
    url: config.URL_GO+'ucenter/login/backendno',
    method: 'post',
    data: data
    // data: Qs.stringify(data)
  })
}
/**
 * 登出
 */
export function logout(param) {
  return request({
    url: config.URL_JAVA+'logout',
    method: 'get',
    params: param
  })
}

export function getUserInfo(token) {
  return request({
    url: config.URL_JAVA+'user/info',
    method: 'get',
    params: { token }
  })
}

// 重置密码
export function updatePassword(param) {
  // console.log(param, '-----param')
  return request({
    url: config.URL_JAVA+'manager/upPasswd',
    method: 'post',
    data: Qs.stringify(param)
  })
}


/**重置密码
 * modifyBackEndUserPasswd
 */
export function modifyBackEndUserPasswd(param) {
  return request({
    url: config.URL_GO+'ucenter/backend/modifyBackEndUserPasswd',
    method: 'post',
    data: param
  })
}



