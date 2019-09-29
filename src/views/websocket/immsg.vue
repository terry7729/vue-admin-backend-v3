<template>
  <div class="layout_container">
    <el-button @click="createImService()">登陆到IM服务器</el-button>
    <span v-if="imService">账户名：{{no}}，账户ID：{{uid}}</span>

    <!-- 聊天 -->
    <div class="chart_box">
      <div v-for="(item,index) in chatMessageList">
        <div class="other_box" v-if="item.type=='other'">
          <span>{{item.message}}</span>
        </div>
        <div class="my_box" v-if="item.type=='my'">
          <span>{{item.message}}</span>
        </div>
      </div>
    </div>

    <!-- 输入 -->
    <div class="send_box">
      <div>
        <el-input type="text" v-model="toId" placeholder="输入对方的ID聊天" style="width:600px;"></el-input>
      </div>
      <div>
        <el-input type="textarea" v-model="msg" style="width:600px;" rows="4"></el-input>
      </div>
      <el-button type="primary" @click="sendMessage()">发送消息</el-button>
    </div>
  </div>
</template>
<script>
// 引入im service需要的包
import { Buffer } from 'buffer'
import { Base64 } from 'js-base64'
import eio from 'engine.io-client'
import immsg from '@/utils/immsg/msg_pb.js'
import order from '@/utils/immsg/byte_order.js'
//定义IM消息用到的标识
const IM_CMD_HEART_PING = 301;
const IM_CMD_HEART_PONG = 302;
//登录
const IM_CMD_LOGIN = 303;
const IM_CMD_LOGIN_RES = 304;
//登出
const IM_CMD_LOGOUT = 305;
const IM_CMD_LOGOUT_RES = 306;
//服务端通知客户端消息
const IM_CMD_SEREVR_NOTIFY_MSG = 307;
const IM_CMD_SEREVR_NOTIFY_MSG_RES = 308;
//读取未读消息 ,进行消息同步
const IM_CMD_GET_UNREAD = 309;
const IM_CMD_GET_UNREAD_RES = 310;
//客户端确认消息
const IM_CMD_CLIENT_ACK = 313;
const IM_CMD_CLIENT_ACK_RES = 314;
//客户端向服务端发送聊天消息
const IM_CMD_CLIENT_SEND_IM = 315;
const IM_CMD_CLIENT_SEND_IM_RES = 316;
//服务端向客户端发送聊天消息
const IM_CMD_SERVER_SEND_IM = 317;
const IM_CMD_SERVER_SEND_IM_RES = 318;
//服务端通知客户端下线
const IM_CMD_NOTIFY_OFFLIEN = 319;
const IM_CMD_NOTIFY_OFFLIEN_RES = 320;
//通知客户端需要进行消息同步
const IM_CMD_NOTIFY_SYNC = 321;
const IM_CMD_SYNC_BEGIN = 322;
const IM_CMD_SYNC_END = 323;
const IM_MAX_PACKET_LEN = 60000;
// 连接状态
const STATE_UNCONNECTED = 1;
const STATE_CONNECTING = 2;
const STATE_CONNECTED = 3;

export default {
  data() {
    return {
      msg: '',
      toId: '',//对方的ID
      chatMessageList: [], // 聊天内容，包含历史消息

      // im实例
      imService: null,

      // im消息需要的参数
      url: "ws://192.168.0.185:13890/ws",
      no: "admin1",
      accessToken: "token2",

      syncKey: 0,
      groupSyncKeys: {},
      uid: null,
      device_id: this.createGuid(),
      observer: null,
      connectFailCount: 0,
      connectState: STATE_UNCONNECTED,
      seq: 0,
      stopped: true,
      roomID: 0,
      //发送消息
      messages: {},
      groupMessages: {},
      customerMessages: {},
      isSyncing: false,
      syncTimestamp: 0,
      nextSyncKey: 0,
      //心跳定时器
      pingTimer: null,
      //连接定时器
      conTimer: null,
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    createImService() {
      if ("WebSocket" in window) {
        this.startImService();
      } else {
        console.error("当前浏览器不支持WebSocket！")
      }
    },
    /**
     * 发送消息
     */
    sendMessage() {
      if (this.stopped || !this.imService) {
        this.$message({
          type: "info",
          message: "请先连接到IM服务器"
        })
        return;
      }
      this.chatMessageList.push({ type: "my", message: this.msg })
      this.sendImmsg(Number(this.toId), 0, this.msg)
    },
    /**
     * 启动im
     */
    startImService() {
      let _this = this;
      if (!_this.stopped) {
        console.log("im service already be started");
        return;
      }
      console.log("start im service");
      _this.stopped = false;
      _this.connectImService();
    },
    /**
     * 停止im
     */
    stopImService() {
      let _this = this;
      if (_this.stopped) {
        console.log("im service already be stopped");
        return;
      }
      console.log("stop im service");
      _this.stopped = true;
      if (_this.imService) {
        _this.imService.close();
        _this.imService = null;
      }
    },
    /**
     * 创建IMservice服务
     */
    connectImService() {
      let _this = this;
      if (_this.stopped) {
        console.log('im service stopped')
        return
      }
      if (_this.imService != null) {
        console.log("socket be already exists")
        return
      }
      _this.connectState = STATE_CONNECTING;
      _this.callStateObserver();

      // 创建新的socket实例，并监听onopen，onclose，onmessage，onerror方法
      _this.imService = new WebSocket(_this.url)
      _this.imService.onopen = function (res) {
        _this.onOpen(res.data)
      }
      _this.imService.onclose = function (res) {
        _this.onClose(res.data)
      }
      _this.imService.onmessage = function (res) {
        let reader = new FileReader()
        reader.readAsArrayBuffer(res.data);
        reader.onload = (e) => {
          _this.onMessage(null, Buffer.from(reader.result));
        }
      }
      _this.imService.onerror = function (res) {
        _this.onError(res.data)
      }
    },
    /**
     * im消息服务连接成功
     */
    onOpen() {
      let _this = this;
      // 登陆
      _this.sendLogin()
      if (_this.roomID > 0) {
        _this.sendEnterRoom(_this.roomID)
      }
      _this.isSyncing = true
      _this.syncTimestamp = 0;
      _this.pendingSyncKey = 0;
      _this.nextSyncKey = 0;
      _this.connectFailCount = 0;
      _this.seq = 0;
      _this.connectState = STATE_CONNECTED;
    },
    /**
 * im消息服务关闭
 */
    onClose() {
      let _this = this;
      _this.imService = null;
      _this.connectState = STATE_UNCONNECTED;
      _this.callStateObserver();

      for (let seq in _this.messages) {
        let msg = _this.messages[seq];
        if (_this.observer != null && "handleMessageFailure" in _this.observer) {
          _this.observer.handleMessageFailure(msg);
        }
      }
      _this.messages = {};

      for (let seq in _this.customerMessages) {
        let msg = _this.customerMessages[seq];
        if (_this.observer != null && "handleCustomerMessageFailure" in _this.observer) {
          _this.observer.handleCustomerMessageFailure(msg);
        }
      }
      _this.customerMessages = {};

      for (let seq in _this.groupMessages) {
        let msg = _this.groupMessages[seq];
        if (_this.observer != null && "handleGroupMessageFailure" in _this.observer) {
          _this.observer.handleGroupMessageFailure(msg);
        }
      }
      _this.groupMessages = {};
      if (_this.pingTimer) {
        //清除心跳计时器
        clearInterval(_this.pingTimer);
        _this.pingTimer = null;
      }
    },
    /**
     * im消息服务连接失败
     */
    onError(err) {
      let _this = this;
      _this.$message({
        type: "error",
        message: "连接IM服务器出现了错误"
      })
      _this.stopped = true;
      _this.imService.close();
      _this.imService = null;
      _this.connectFailCount++;
      _this.connectState = STATE_CONNECTFAIL;
      _this.callStateObserver();

      if (_this.conTimer) {
        //当前有连接定时器 先杀掉
        clearTimeout(_this.conTimer);
        _this.conTimer = null
      }
      _this.conTimer = setTimeout(function () {
        _this.connectImService()
      }, _this.connectFailCount * 1000);

      //清除心跳计时器
      if (_this.pingTimer) {
        clearInterval(_this.pingTimer);
        _this.pingTimer = null;
      }
    },
    /**
 * 消息通知
 */
    onMessage(err, buf) {
      let _this = this;
      let len = order.ntohs(buf, 0);
      let cmd = order.ntohs(buf, 2);
      let bodybuf = buf.slice(4, buf.length)
      let bodyff = immsg.ImClientSendMsg.deserializeBinary(bodybuf);

      if (cmd == IM_CMD_LOGIN_RES) {
        //接收到IM 登录的回应消息
        let res = immsg.ImLoginRes.deserializeBinary(bodybuf);
        if (res.getCode() == 200) {
          //服务端返回了我的UID
          _this.uid = res.getUid()
          console.log("login sucess,no=" + _this.no + ",uid=" + _this.uid + ",sid=" + res.getSessionid());

          //登录成功设置发送心跳
          _this.pingTimer = setInterval(function () {
            _this.sendHeartPing();
          }, 1000 * 60);
          let now = new Date().getTime() / 1000;
          _this.startSync(now)
        }
        else {
          console.log("login failed,code=" + res.getCode() + ",error=" + res.getErrorinfo());
        }
      }
      else if (cmd == IM_CMD_GET_UNREAD_RES) {
        //读取未读消息的回应消息
        let res = immsg.ImGetUnreadMsgRes.deserializeBinary(bodybuf);
        console.log("IM_CMD_GET_UNREAD_RES,offset=" + res.getOffset() + ",ackOffset=" + res.getAckoffset())

        if (!_this.isSyncing) {
          //不在同步中
          return;
        }
        //回应消息，回应本次同步会发送的消息，最小偏移和最大偏移（min-max)的范围
        if (_this.syncKey == 0) {
          //本地是一个新装的客户端,或者清空了本地的缓存的数据，不知道上次的同步偏移,就使用服务端的偏移
          _this.syncKey = res.getAckoffset();
        }
      }
      else if (cmd == IM_CMD_SYNC_BEGIN) {
        //收到了服务端发送的开始同步消息的通知
        let res = immsg.ImSyncBegin.deserializeBinary(bodybuf);
        console.log("IM_CMD_SYNC_BEGIN,offset=" + res.getOffset());
        let now = new Date().getTime() / 1000;

        if (res.getOffset() < _this.syncKey) {
          //和本地的消息偏移不连续,本地没收到想要的偏移范围内的消息
          console.log("IM_CMD_SYNC_BEGIN,client syncKey error ,received new offset=" + res.getOffset());
          //启动新的同步
          return;
        }
        _this.nextSyncKey = res.getOffset();
      }
      else if (cmd == IM_CMD_SYNC_END) {
        //收到了服务端发送的结束同步消息的通知
        let res = immsg.ImSyncEnd.deserializeBinary(bodybuf);
        console.log("IM_CMD_SYNC_END,offset=" + res.getOffset())
        if (!_this.isSyncing) {
          //并不在消息同步状态中
          console.log("IM_CMD_SYNC_END,client syncKey error ,client has not been syncing status ,received  offset=" + res.getOffset());
          return
        }
        let now = new Date().getTime() / 1000;
        //设置非同步状态
        _this.isSyncing = false
        if (res.getOffset() != _this.syncKey) {
          //和本地的消息偏移不连续,本地没收到想要的偏移范围内的消息
          console.log("IM_CMD_SYNC_END,client syncKey error ,received new offset=" + res.getOffset());
          //启动新的同步
          _this.startSync(now);
          return;
        }
        if (_this.pendingSyncKey > res.getOffset()) {
          //在本次同步过程中，又收到了新的消息，需要启动再次同步
          _this.pendingSyncKey = 0;
          _this.startSync(now);
        }
      }
      else if (cmd == IM_CMD_CLIENT_SEND_IM) {
        if (!_this.isSyncing) {
          //不在消息同步中,忽略消息
          return;
        }
        let now = new Date().getTime() / 1000;
        //收到了服务端发送的同步的聊天消息
        let res = immsg.ImClientSendMsg.deserializeBinary(bodybuf);
        let content = _this.Utf8ArrayToStr(res.getContent())
        if (res.getFromuid() == _this.uid) {
          //是我自己发出去的消息
          console.log("我发送出去的消息：" + content)
          this.chatMessageList.push({
            type: "my",
            message: content,
          })
        }
        else {
          //是别人发给我的消息
          console.log("别人发送给我的消息：" + content)
          this.chatMessageList.push({
            type: "other",
            message: content,
          })
        }

        let offset = res.getOffset();
        let next = res.getNextoffset();

        if ((next > 0) && (next <= offset)) {
          //服务端下发的偏移不合法  next 应该大于offset
          console.log("IM_CMD_CLIENT_SEND_IM,next and offset is invalid")
          _this.sendImAckReadedMsg(self.syncKey);
          _this.startSync(now);
          return;
        }

        if (_this.syncKey > offset) {
          //收到的数据是旧数据，忽略
          return;
        }

        if ((_this.nextSyncKey > 0) && (_this.nextSyncKey <= _this.syncKey)) {
          //本地的偏移非法应该 nextSyncKey >syncKey
          console.log("IM_CMD_CLIENT_SEND_IM,local nextSyncKey and syncKey is invalid ");
          _this.nextSyncKey = 0;
          _this.sendImAckReadedMsg(_this.syncKey);
          _this.startSync(now)
          return;
        }

        if (_this.nextSyncKey == offset) {
          //刚好是需要接收的下一个消息的偏移
          _this.syncKey = offset;
          _this.nextSyncKey = next;
        }
        else {
          //消息偏移不连续，丢了包
          _this.sendImAckReadedMsg(_this.syncKey);
          _this.startSync(now);
        }

      }
      else if (cmd == IM_CMD_NOTIFY_SYNC) {
        //收到了你有新消息的通知
        let req = immsg.ImSyncNotify.deserializeBinary(bodybuf);
        let newSyncKey = req.getOffset();

        let now = new Date().getTime() / 1000;
        let isSyncing = _this.isSyncing && (now - _this.syncTimestamp < 4);
        if (!isSyncing && _this.syncKey < newSyncKey) {
          _this.pendingSyncKey = 0;
          _this.startSync(now);
        }
        else if (newSyncKey > _this.pendingSyncKey) {
          _this.pendingSyncKey = newSyncKey;
        }
      }

    },
    /**
     * im消息同步发送
     */
    sendSync(syncKey) {
      let _this = this;
      let req = new immsg.ImGetUnreadMsg();
      req.setOffset(syncKey);
      _this.sendpb(IM_CMD_GET_UNREAD, req, false)
    },
    /**
     * im消息服务发送pb的包体
     */
    sendpb(cmd, msg, nonpersistent) {
      let _this = this;
      if (_this.imService == null) {
        console.log("this socket is null")
        return false;
      }
      //设置消息的头
      _this.seq++;
      let head = new proto.protoc.Head;
      head.setCmd(cmd)
      head.setSeq(_this.seq)
      msg.setHead(head)
      let body = msg.serializeBinary()
      let buf = Buffer(4 + body.length)
      //设置pb
      let pos = 0;
      order.htons(buf, pos, body.length);
      pos += 2;
      order.htons(buf, pos, cmd);
      pos += 2;

      for (let i = 0; i < body.length; i++) {
        buf[pos + i] = body[i]
      }

      let now = new Date().getTime() / 1000;
      _this.imService.send(buf.buffer);
    },
    /**
     * im消息服务发送登录的消息
     */
    sendLogin() {
      let _this = this;
      let login = new immsg.ImLogin()
      login.setNo(_this.no)
      login.setToken(_this.accessToken)
      login.setTimestamp(0)
      login.setDevid("sssss")
      login.setRole("back-aa")
      login.setPlatformId(1)

      console.log('当前的websocket信息：', _this);

      _this.sendpb(IM_CMD_LOGIN, login, false)
    },
    /**
     * 发送消息同步的确认，我收到的消息的偏移
     */
    sendImAckReadedMsg(offset) {
      let ack = new immsg.ImAckReadedMsg();
      ack.setAckoffset(offset);

      this.sendpb(IM_CMD_CLIENT_ACK, ack, false)
    },
    /**
     * 发送聊天消息,toUID 接收消息的用户id,msgType 发送的消息类型，默认传0，Content 发送的消息类容
     */
    sendImmsg(toUID, msgType, content) {
      content = Base64.encode(content);
      let chat = new immsg.ImClientSendMsg();
      chat.setMsgtype(msgType)
      chat.setFromuid(this.uid)
      chat.setTouid(toUID)
      chat.setLen(content.length)
      chat.setContent(content)
      console.log('发送消息：', toUID, msgType, content);
      this.msg = '';// 清空文本框发送的消息

      this.sendpb(IM_CMD_CLIENT_SEND_IM, chat, false)
    },
    /**
     * im消息状态观察
     */
    callStateObserver() {
      let _this = this;
      if (_this.observer != null && "onConnectState" in _this.observer) {
        _this.observer.onConnectState(_this.connectState)
      }
    },
    /**
     * im消息状态观察
     */
    callStateObserver() {
      let _this = this;
      if (_this.observer != null && "onConnectState" in _this.observer) {
        _this.observer.onConnectState(_this.connectState)
      }
    },
    /**
     * 生成guid
     */
    createGuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    /**
     * im消息的数据转换
     */
    blobToBuffer(blob) {
      if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
        throw new Error('first argument must be a Blob')
      }
      console.log(blob);
      let reader = new FileReader()
      reader.readAsArrayBuffer(blob);
      reader.onload = (e) => {
        console.log(reader);
        return Buffer.from(reader.result);
      }

    },
    /**
     * 字符串转utf8array
     */
    toUTF8Array(str) {
      var utf8 = [];
      for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
            0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
          utf8.push(0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    },
    /**
     * utf8数组数据转字符串
     * @param {数组} array 
     */
    Utf8ArrayToStr(array) {
      let out, i, len, c;
      let char2, char3;

      out = "";
      len = array.length;
      i = 0;
      while (i < len) {
        c = array[i++];
        switch (c >> 4) {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(((c & 0x0F) << 12) |
              ((char2 & 0x3F) << 6) |
              ((char3 & 0x3F) << 0));
            break;
        }
      }
      return out;
    },
    /**
     * 发送心跳
     */
    sendHeartPing() {
      let ping = new immsg.ImHeartPing();
      this.sendpb(IM_CMD_HEART_PING, ping, false)
    },
    /**
     * 启动消息同步
     */
    startSync(now) {
      this.isSyncing = true
      this.sendSync(this.syncKey);
      this.syncTimestamp = now;
    },

    /**
     * 读取未读消息，进行消息同步
     */
    sendGetUnread(buf) {
      let syncReq = new immsg.ImGetUnreadMsg()
      syncReq.setOffset();
      this.sendpb(IM_CMD_GET_UNREAD, syncReq, false)
    },

  }
}
</script>
<style scoped>
.layout_container {
  margin-right: 10px;
  padding: 20px;
}
.chart_box {
  height: 400px;
  max-height: 400px;
  width: 600px;
  margin: 10px 0px;
  border: solid 1px #eee;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.chart_box .other_box {
  padding: 6px 12px;
}
.chart_box .other_box span {
  margin: 6px;
  margin-left: 40px;
  padding: 12px;
  width: 350px;
  font-size: 13px;
  color: #fff;
  float: left;
  border-radius: 20px;
  background: #19be6b;
  position: relative;
}
.chart_box .other_box span::before {
  content: "对方";
  position: absolute;
  left: -45px;
  top: -2px;
  height: 40px;
  width: 40px;
  border-radius: 100px;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  background: #ed4014;
}
.chart_box {
  padding: 6px 12px;
}
.chart_box .my_box span {
  margin: 6px;
  padding: 12px;
  margin-right: 40px;
  width: 350px;
  float: right;
  font-size: 13px;
  color: #fff;
  border-radius: 20px;
  background: #5cadff;
  position: relative;
}
.chart_box .my_box span::before {
  content: "我";
  position: absolute;
  right: -45px;
  top: -2px;
  height: 40px;
  width: 40px;
  border-radius: 100px;
  line-height: 40px;
  text-align: center;
  font-size: 12px;
  background: #808695;
}
.send_box {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #eee;
  width: 600px;
  margin: 10px 0px;
}
</style>
