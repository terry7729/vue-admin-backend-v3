/**
 * 长链接
 */
import store from '@/store'
import { Message } from 'element-ui'
const CONFIG = require('../../env/config.js')
var lockReconnect = false// 避免重复连接
var reconnectflag = 0
export function webSocket(param) {
  const sparam = JSON.stringify(param)
  const socket = new WebSocket(CONFIG.WS_CONFIG)
  socket.onopen = function() {
    if (window.ws) {
      window.ws = null
      clearInterval(window.ws)
    }
    let flagdata = 0
    socket.send(sparam)
    window.ws = setInterval(function() {
      flagdata++
      const saveparam = {
        'username': param.username,
        'role': 'back',
        'type': 'heartbeat',
        'data': flagdata + ''
      }

      socket.send(JSON.stringify(saveparam))
    }, 10000)
  }
  socket.onerror = function() {
    socket.close()
    clearInterval(window.ws)
    window.ws = null
    reconnect(param)
  }
  socket.onclose = function(e) {
    socket.close()
    clearInterval(window.ws)
    window.ws = null
    reconnect(param)
    console.log('websocket close')
  }
  socket.onmessage = function(e) {
    const getMessage = JSON.parse(e.data)
    switch (getMessage.type) {
      case 'message':
        store.dispatch('listenMessage', getMessage)
        break
    }
  }
}
export function closeWebsocket() {
  const csocket = new WebSocket(CONFIG.WS_CONFIG)
  csocket.onclose = function() {
    csocket.close()
    clearInterval(window.ws)
    window.ws = null
  }
}

/**
 * websokect重连
 */

function reconnect(param) {
  reconnectflag++
  if (reconnectflag >= 3) {
    Message({
      message: '连接中断，请刷新重连',
      type: 'error',
      duration: 3 * 1000
    })
    return false
  } else {
    if (lockReconnect) return
    lockReconnect = true
    webSocket(param)
    lockReconnect = false
  }
}
