// 引入包
const immsg = require('./msg_pb');
const Buffer = require('buffer/').Buffer;
const eio = require('engine.io-client');
const order = require('./byte_order');
const Base64 = require('js-base64').Base64;


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

// 定义im消息服务的实例
let saveIMService = null;

/**
 * im消息
 */
function IMService() {
    this.url = "ws://192.168.0.106:13890/ws";
    this.no = "andy1"
    this.accessToken = "token11";
    this.syncKey = 0;
    this.groupSyncKeys = {};
    this.uid = 0;
    this.device_id = this.guid();
    this.observer = null;
    this.socket = null;
    this.connectFailCount = 0;
    this.connectState = STATE_UNCONNECTED;
    this.seq = 0;
    this.stopped = true;
    this.roomID = 0;
    //发送消息
    this.messages = {};
    this.groupMessages = {};
    this.customerMessages = {};
    this.isSyncing = false;
    this.syncTimestamp = 0;
    this.nextSyncKey = 0;
    //心跳定时器
    this.pingTimer = null;
    //连接定时器
    this.conTimer = null;
}

/**
 * im消息服务启动
 */
IMService.prototype.start = function () {
    let _this = this;
    if (!_this.stopped) {
        console.log("im service already be started");
        return;
    }
    console.log("start im service");
    _this.stopped = false;
    _this.connect();
};

/**
 * im消息服务停止
 */
IMService.prototype.stop = function () {
    let _this = this;
    if (_this.stopped) {
        console.log("im service already be stopped");
        return;
    }
    console.log("stop im service");
    _this.stopped = true;
    if (_this.socket) {
        _this.socket.close();
        _this.socket = null;
    }
}
/**
 * im消息服务连接
 */
IMService.prototype.connect = function () {
    let _this = this;
    if (_this.stopped) {
        console.log('im service stopped')
        return
    }
    if (_this.socket != null) {
        console.log("socket be already exists")
        return
    }
    _this.connectState = STATE_CONNECTING;
    _this.callStateObserver();

    // 创建新的socket实例，并监听onopen，onclose，onmessage，onerror方法
    _this.socket = new WebSocket(_this.url)
    _this.socket.onopen = function (res) {
        _this.onOpen(res.data)
    }
    _this.socket.onclose = function (res) {
        _this.onClose(res.data)
    }
    _this.socket.onmessage = function (res) {
        _this.blobToBuffer(res.data, _this.onMessage)
    }
    _this.socket.onerror = function (res) {
        _this.onError(res.data)
    }
}
/**
 * im消息服务连接成功
 */
IMService.prototype.onOpen = function () {
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
    _this.connectState = IMService.STATE_CONNECTED;

}
/**
 * 消息通知
 */
IMService.prototype.onMessage = function (err, buf) {
    let _this = this;
    let len = order.ntohs(buf, 0);
    let cmd = order.ntohs(buf, 2);
    let bodybuf = buf.slice(4, buf.length)

    let bodyff = immsg.ImClientSendMsg.deserializeBinary(bodybuf);
    // console.log('接受到信息：', saveIMService.Utf8ArrayToStr(bodyff.getContent()));

    if (cmd == IM_CMD_LOGIN_RES) {
        //接收到IM 登录的回应消息
        let res = immsg.ImLoginRes.deserializeBinary(bodybuf);
        if (res.getCode() == 200) {
            //服务端返回了我的UID
            saveIMService.uid = res.getUid()
            console.log("login sucess,no=" + saveIMService.no + ",uid=" + saveIMService.uid + ",sid=" + res.getSessionid());

            //登录成功设置发送心跳
            saveIMService.pingTimer = setInterval(function () {
                saveIMService.sendHeartPing();
            }, 1000 * 6);
            let now = new Date().getTime() / 1000;
            saveIMService.startSync(now)
        }
        else {
            console.log("login failed,code=" + res.getCode() + ",error=" + res.getErrorinfo());
        }
    }
    else if (cmd == IM_CMD_GET_UNREAD_RES) {
        //读取未读消息的回应消息
        let res = immsg.ImGetUnreadMsgRes.deserializeBinary(bodybuf);
        console.log("IM_CMD_GET_UNREAD_RES,offset=" + res.getOffset() + ",ackOffset=" + res.getAckoffset())

        if (!saveIMService.isSyncing) {
            //不在同步中
            return;
        }
        //回应消息，回应本次同步会发送的消息，最小偏移和最大偏移（min-max)的范围
        if (saveIMService.syncKey == 0) {
            //本地是一个新装的客户端,或者清空了本地的缓存的数据，不知道上次的同步偏移,就使用服务端的偏移
            saveIMService.syncKey = res.getAckoffset();
        }
    }
    else if (cmd == IM_CMD_SYNC_BEGIN) {
        //收到了服务端发送的开始同步消息的通知
        let res = immsg.ImSyncBegin.deserializeBinary(bodybuf);
        console.log("IM_CMD_SYNC_BEGIN,offset=" + res.getOffset());
        let now = new Date().getTime() / 1000;

        if (res.getOffset() < saveIMService.syncKey) {
            //和本地的消息偏移不连续,本地没收到想要的偏移范围内的消息
            console.log("IM_CMD_SYNC_BEGIN,client syncKey error ,received new offset=" + res.getOffset());
            //启动新的同步
            return;
        }
        saveIMService.nextSyncKey = res.getOffset();
    }
    else if (cmd == IM_CMD_SYNC_END) {
        //收到了服务端发送的结束同步消息的通知
        let res = immsg.ImSyncEnd.deserializeBinary(bodybuf);
        console.log("IM_CMD_SYNC_END,offset=" + res.getOffset())
        if (!saveIMService.isSyncing) {
            //并不在消息同步状态中
            console.log("IM_CMD_SYNC_END,client syncKey error ,client has not been syncing status ,received  offset=" + res.getOffset());
            return
        }
        let now = new Date().getTime() / 1000;
        //设置非同步状态
        saveIMService.isSyncing = false
        if (res.getOffset() != saveIMService.syncKey) {
            //和本地的消息偏移不连续,本地没收到想要的偏移范围内的消息
            console.log("IM_CMD_SYNC_END,client syncKey error ,received new offset=" + res.getOffset());
            //启动新的同步
            saveIMService.startSync(now);
            return;
        }
        if (saveIMService.pendingSyncKey > res.getOffset()) {
            //在本次同步过程中，又收到了新的消息，需要启动再次同步
            saveIMService.pendingSyncKey = 0;
            saveIMService.startSync(now);
        }
    }
    else if (cmd == IM_CMD_CLIENT_SEND_IM) {
        if (!saveIMService.isSyncing) {
            //不在消息同步中,忽略消息
            return;
        }

        let now = new Date().getTime() / 1000;

        //收到了服务端发送的同步的聊天消息
        let res = immsg.ImClientSendMsg.deserializeBinary(bodybuf);
        let content = saveIMService.Utf8ArrayToStr(res.getContent())
        if (res.getFromuid() == saveIMService.uid) {
            //是我自己发出去的消息
            console.log("我发送出去的消息：" + content)
        }
        else {
            //是别人发给我的消息
            console.log("别人发送给我的消息：" + content)
        }

        let offset = res.getOffset();
        let next = res.getNextoffset();

        if ((next > 0) && (next <= offset)) {
            //服务端下发的偏移不合法  next 应该大于offset
            console.log("IM_CMD_CLIENT_SEND_IM,next and offset is invalid")
            saveIMService.sendImAckReadedMsg(self.syncKey);
            saveIMService.startSync(now);
            return;
        }

        if (saveIMService.syncKey > offset) {
            //收到的数据是旧数据，忽略
            return;
        }

        if ((saveIMService.nextSyncKey > 0) && (saveIMService.nextSyncKey <= saveIMService.syncKey)) {
            //本地的偏移非法应该 nextSyncKey >syncKey
            console.log("IM_CMD_CLIENT_SEND_IM,local nextSyncKey and syncKey is invalid ");
            saveIMService.nextSyncKey = 0;
            saveIMService.sendImAckReadedMsg(saveIMService.syncKey);
            saveIMService.startSync(now)
            return;
        }

        if (saveIMService.nextSyncKey == offset) {
            //刚好是需要接收的下一个消息的偏移
            saveIMService.syncKey = offset;
            saveIMService.nextSyncKey = next;
        }
        else {
            //消息偏移不连续，丢了包
            saveIMService.sendImAckReadedMsg(saveIMService.syncKey);
            saveIMService.startSync(now);
        }

    }
    else if (cmd == IM_CMD_NOTIFY_SYNC) {
        //收到了你有新消息的通知
        let req = immsg.ImSyncNotify.deserializeBinary(bodybuf);
        let newSyncKey = req.getOffset();

        let now = new Date().getTime() / 1000;
        let isSyncing = saveIMService.isSyncing && (now - saveIMService.syncTimestamp < 4);
        if (!isSyncing && saveIMService.syncKey < newSyncKey) {
            saveIMService.pendingSyncKey = 0;
            saveIMService.startSync(now);
        }
        else if (newSyncKey > saveIMService.pendingSyncKey) {
            saveIMService.pendingSyncKey = newSyncKey;
        }
    }

}
/**
 * im消息服务关闭
 */
IMService.prototype.onClose = function () {
    let _this = this;
    _this.socket = null;
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
}
/**
 * im消息服务连接失败
 */
IMService.prototype.onError = function (err) {
    let _this = this;

    _this.socket.close();
    _this.socket = null;
    _this.connectFailCount++;
    _this.connectState = STATE_CONNECTFAIL;
    _this.callStateObserver();

    if (_this.conTimer) {
        //当前有连接定时器 先杀掉
        clearTimeout(_this.conTimer);
        _this.conTimer = null
    }
    _this.conTimer = setTimeout(function () {
        _this.connect()
    }, _this.connectFailCount * 1000);

    //清除心跳计时器
    if (_this.pingTimer) {
        clearInterval(_this.pingTimer);
        _this.pingTimer = null;
    }
}
/**
 * im消息同步发送
 */
IMService.prototype.sendSync = function (syncKey) {
    let _this = this;
    let req = new immsg.ImGetUnreadMsg();
    req.setOffset(syncKey);
    _this.sendpb(IM_CMD_GET_UNREAD, req, false)
}
/**
 * im消息服务发送pb的包体
 */
IMService.prototype.sendpb = function (cmd, msg, nonpersistent) {
    let _this = this;
    if (_this.socket == null) {
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
    _this.socket.send(buf.buffer);
}
/**
 * im消息服务发送登录的消息
 */
IMService.prototype.sendLogin = function () {
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
}
/**
 * 发送消息同步的确认，我收到的消息的偏移
 */
IMService.prototype.sendImAckReadedMsg = function (offset) {
    let ack = new immsg.ImAckReadedMsg();
    ack.setAckoffset(offset);

    this.sendpb(IM_CMD_CLIENT_ACK, ack, false)
}
/**
 * 发送聊天消息,toUID 接收消息的用户id,msgType 发送的消息类型，默认传0，Content 发送的消息类容
 */
IMService.prototype.sendImmsg = function (toUID, msgType, content) {
    content = Base64.encode(content);
    let chat = new immsg.ImClientSendMsg();
    chat.setMsgtype(msgType)
    chat.setFromuid(this.uid)
    chat.setTouid(toUID)
    chat.setLen(content.length)
    chat.setContent(content)
    console.log('发送消息：', toUID, msgType, content);

    this.sendpb(IM_CMD_CLIENT_SEND_IM, chat, false)
}
/**
 * im消息状态观察
 */
IMService.prototype.callStateObserver = function () {
    let _this = this;
    if (_this.observer != null && "onConnectState" in _this.observer) {
        _this.observer.onConnectState(_this.connectState)
    }
}
/**
 * 创建guid
 */
IMService.prototype.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
/**
 * im消息的数据转换
 */
IMService.prototype.blobToBuffer = function (blob, cb) {
    if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
        throw new Error('first argument must be a Blob')
    }
    if (typeof cb !== 'function') {
        throw new Error('second argument must be a function')
    }
    let reader = new FileReader()
    function onLoadEnd(e) {
        reader.removeEventListener('loadend', onLoadEnd, false)
        if (e.error) cb(e.error)
        else {
            cb(null, Buffer.from(reader.result))
        }
    }
    reader.addEventListener('loadend', onLoadEnd, false)
    reader.readAsArrayBuffer(blob)

}
IMService.prototype.toUTF8Array = function (str) {
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
}
/**
 * utf8数组数据转字符串
 * @param {数组} array 
 */
IMService.prototype.Utf8ArrayToStr = function (array) {
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
}
/**
 * 发送心跳
 */
IMService.prototype.sendHeartPing = function () {
    let ping = new immsg.ImHeartPing();
    this.sendpb(IM_CMD_HEART_PING, ping, false)
}
/**
 * 启动消息同步
 */
IMService.prototype.startSync = function (now) {
    this.isSyncing = true
    this.sendSync(this.syncKey);
    this.syncTimestamp = now;
}

/**
 * 读取未读消息，进行消息同步
 */
IMService.prototype.sendGetUnread = function (buf) {
    let syncReq = new immsg.ImGetUnreadMsg()
    syncReq.setOffset();
    this.sendpb(IM_CMD_GET_UNREAD, syncReq, false)
}

/**
 * 创建im消息服务的实例
 */
function createIMService() {
    if (saveIMService && saveIMService instanceof IMService) {
        return saveIMService;
    } else {
        saveIMService = new IMService();
        saveIMService.start();
    }

}
/**
 * 发送消息
 * @param {发送的消息} msg 
 */
function sendMessage(msg) {
    saveIMService.sendImmsg(3806632400662823000, 0, msg)
}
// 导出im
export {
    createIMService,
    sendMessage
}






