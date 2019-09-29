import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '@/store'
import storagelib from '@/utils/auth'
import {
  closeWebsocket
} from '@/utils/webSocket'

const CONFIG = require('../../env/config.js')

// create an axios instance
const service = axios.create({
  baseURL: CONFIG.BASE_API, // api的base_url
  timeout: 30*10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'bearer ' + store.getters.token

      config.headers['lognToken'] = store.getters.token
      config.headers['X-Tk'] = store.getters.token
      config.headers['busiType'] = 'systemaccount'


    }
    // "Accept":"application/json, text/plain
    config.headers['Accept'] = 'application/json'

    return config
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    Promise.reject(error)
  }
)
// respone interceptor
service.interceptors.response.use(response => {
  // 601token失效异常  602被强制挤下线（如：单点登录）
  if (response.data.code == "601") {
    store.dispatch('LoginByUsername', { username: store.getters.loginParam.username, password: store.getters.loginParam.password,salt: store.getters.loginParam.salt }).then((res) => {})
    /*
    MessageBox.alert('抱歉，您的登录信息已经过期', '温馨提示', {
      confirmButtonText: '重新登陆',
      type: 'error',
      callback: action => {
        storagelib.del('token')
        storagelib.del('loginParam')
        storagelib.del('roles')
        storagelib.del('chatImmsgUid')
        sessionStorage.clear()
        location.reload()
        return Promise.reject('error')
      }
    })
    */
  } else {
    return response
  }
}, error => {
  error = JSON.parse(JSON.stringify(error))
  let errorMsg;
  if (error.response) {
    if (error.response.status == 500) {
      if (error.response.data.msgUI) {
        errorMsg = error.response.data.msgUI;
      } else {
        errorMsg = '抱歉，请求服务器异常';
      }
    } else if (error.response.status == 502) {
      if (error.response.data.msgUI) {
        errorMsg = error.response.data.msgUI;
      } else {
        errorMsg = '抱歉，请求数据异常';
      }
    } else {
      if (error.response.data.msgUI) {
        errorMsg = error.response.data.msgUI;
      } else {
        errorMsg = '抱歉，请求数据异常';
      }
    }
  } else {
    errorMsg = '网络异常，请稍后尝试';
  }
  Message({
    message: errorMsg,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(errorMsg);
})

export default service
