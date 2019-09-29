<template>
  <div class="immsg_chat_container">
    <!-- 连接失败提示 -->
    <span class="im_reload" v-if="imConnectError" style="position:absolute;top:20px;background:#f39595;display:inline-block;padding:6px 12px;font-size:12px;border-radius:2px;right:40%;">{{imConnectError}}</span>

    <!-- 和商家聊天 -->
    <div class="merchant" v-if="currentChat==0">
      <div class="chat_box">
        <!-- 工单内容的图片拼加到最上面 -->
        <div class="other_box clearfix" v-if="repairBillObj.content">
          <div class="chat_time clearfix"></div>
          <div class="chat">
            <div class="chat_logo"><img src="../../assets/img/immsg_merchant.png" /></div>
            <div class="chat_content">
              <div>{{repairBillObj.creatorAccount}}创建了工单</div>
              <div>{{repairBillObj.content}}</div>
              <div style="padding-top:5px;" v-if="repairBillObj.absoluteImgUrlList&&repairBillObj.absoluteImgUrlList.length>0">
                <span v-for="item in repairBillObj.absoluteImgUrlList">
                  <img :src="item" style="max-width:80px;margin-right:10px;" @click="openLookBigImgModal(item)">
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="chat_list" v-for="(item,index) in chatMessageList">
          <!-- 对方留言的 -->
          <div class="other_box clearfix" v-if="item.type=='leave'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="chat">
              <div class="chat_logo"><img src="../../assets/img/immsg_merchant.png" /></div>
              <div class="chat_content">
                <span v-if="item.sendType=='text'">{{item.msg}}</span>
                <span v-if="item.sendType=='image'" style="display:inline-block;max-width:320px;">
                  <img :src="item.msg" style="max-width:100%;" @click="openLookBigImgModal(item.msg)" />
                </span>
              </div>
            </div>
          </div>
          <!-- 对方 -->
          <div class="other_box clearfix" v-if="item.type=='other'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="chat">
              <div class="chat_logo"><img src="../../assets/img/immsg_merchant.png" /></div>
              <div class="chat_content">
                <span v-if="item.sendType=='text'">{{item.msg}}</span>
                <span v-if="item.sendType=='image'" style="display:inline-block;max-width:320px;">
                  <img :src="item.msg" style="max-width:100%;" @click="openLookBigImgModal(item.msg)" />
                </span>
              </div>
            </div>
          </div>
          <!-- 系统发送的 -->
          <div class="system_box" v-if="item.type=='system'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="system_content"><i class="el-icon-document" style="margin-right:3px;" /><span v-html="item.msg"></span></div>
          </div>
          <!-- 我发送的 -->
          <div class="my_box clearfix" v-if="item.type=='my'">
            <div class="chat_time">{{renderTime(item.sendTime)}}</div>
            <div class="chat">
              <span @click="trySendMessage(item,index)" v-if="item.sendFail"><i class="el-icon-warning" style="color:#F56C6C;font-size:16px;position:relative;margin-top:20px;margin-right:10px;cursor:pointer;" /></span>
              <div class="chat_content">
                <span v-if="item.sendType=='text'">{{item.msg}}</span>
                <span v-if="item.sendType=='image'" style="display:inline-block;max-width:320px;">
                  <img :src="item.msg" style="max-width:100%;" @click="openLookBigImgModal(item.msg)" />
                </span>
              </div>
              <div class="chat_logo"><img src="../../assets/img/immsg_kefu.png" /></div>
            </div>
          </div>
        </div>
      </div>
      <div class="send_box" v-if="repairBillObj.billStatus==1">
        <textarea placeholder="请输入聊天的内容（↵发送，ctrl↵换行，⌘↵换行，粘贴可直接发送图片）" v-model="msg" v-if="repairBillObj.merchantName||repairBillObj.submitUser" @keydown="enterSendForMerchant($event)" @focus="isChatFocus=true;" @blur="isChatFocus=false;"></textarea>
        <!-- 发送按钮 -->
        <div class="send_btn_box">
          <button class="send_btn" @click="openFinishBill()">完结工单</button>
          <button class="send_btn" @click="sendMerchantMessage(msg)" v-if="repairBillObj.merchantName||repairBillObj.submitUser">发送</button>
        </div>
      </div>
      <div class="send_box" v-if="repairBillObj.billStatus==2" style="text-align:center;padding:30px;">
        <button class="send_btn" @click="openRebootBill()">重启工单</button>
      </div>
    </div>

    <!-- 和承兑人聊天 -->
    <div class="acceptor" v-if="currentChat==1">
      <div class="chat_box">
        <!-- 工单内容的图片拼加到最上面 -->
        <div class="other_box clearfix" v-if="repairBillObj.content">
          <div class="chat_time clearfix"></div>
          <div class="chat">
            <div class="chat_logo"><img src="../../assets/img/immsg_acceptor.png" /></div>
            <div class="chat_content">
              <div>{{repairBillObj.creatorAccount}} 创建了工单</div>
              <div>{{repairBillObj.content}}</div>
              <div style="padding-top:5px;" v-if="repairBillObj.absoluteImgUrlList&&repairBillObj.absoluteImgUrlList.length>0">
                <span v-for="item in repairBillObj.absoluteImgUrlList">
                  <img :src="item" style="max-width:80px;margin-right:10px;" @click="openLookBigImgModal(item)">
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- 聊天的消息 -->
        <div class="chat_list" v-for="(item,index) in chatMessageList">
          <!-- 对方留言的 -->
          <div class="other_box clearfix" v-if="item.type=='leave'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="chat">
              <div class="chat_logo"><img src="../../assets/img/immsg_acceptor.png" /></div>
              <div class="chat_content">
                <span v-if="item.sendType=='text'">{{item.msg}}</span>
                <span v-if="item.sendType=='image'" style="display:inline-block;max-width:320px;">
                  <img :src="item.msg" style="max-width:100%;" @click="openLookBigImgModal(item.msg)" />
                </span>
              </div>
            </div>
          </div>
          <!-- 对方 -->
          <div class="other_box clearfix" v-if="item.type=='other'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="chat">
              <div class="chat_logo"><img src="../../assets/img/immsg_acceptor.png" /></div>
              <div class="chat_content">
                <span v-if="item.sendType=='text'">{{item.msg}}</span>
                <span v-if="item.sendType=='image'" style="display:inline-block;max-width:320px;">
                  <img :src="item.msg" style="max-width:100%;" @click="openLookBigImgModal(item.msg)" />
                </span>
              </div>
            </div>
          </div>
          <!-- 系统发送的 -->
          <div class="system_box" v-if="item.type=='system'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="system_content"><i class="el-icon-document" style="margin-right:3px;" /><span v-html="item.msg"></span></div>
          </div>
          <!-- 我发送的 -->
          <div class="my_box clearfix" v-if="item.type=='my'">
            <div class="chat_time clearfix">{{renderTime(item.sendTime)}}</div>
            <div class="chat">
              <span @click="trySendMessage(item,index)" v-if="item.sendFail"><i class="el-icon-warning" style="color:#F56C6C;font-size:16px;position:relative;margin-top:20px;margin-right:10px;cursor:pointer;" /></span>
              <div class="chat_content">
                <span v-if="item.sendType=='text'">{{item.msg}}</span>
                <span v-if="item.sendType=='image'" style="display:inline-block;max-width:320px;">
                  <img :src="item.msg" style="max-width:100%;" @click="openLookBigImgModal(item.msg)" />
                </span>
              </div>
              <div class="chat_logo"><img src="../../assets/img/immsg_kefu.png" /></div>
            </div>
          </div>
        </div>
      </div>
      <div class="send_box" v-if="repairBillObj.billStatus==1">
        <textarea placeholder="请输入聊天的内容（↵发送，ctrl↵换行，⌘↵换行，粘贴可直接发送图片）" v-model="msg" v-if="repairBillObj.accepterName" @keydown="enterSendForAcceptor($event)" @focus="isChatFocus=true;" @blur="isChatFocus=false;"></textarea>
        <!-- 发送按钮 -->
        <div class="send_btn_box">
          <button class="send_btn" @click="openFinishBill()">完结工单</button>
          <button class="send_btn" @click="sendAcceptorMessage(msg)" v-if="repairBillObj.accepterName">发送</button>
        </div>
      </div>
      <div class="send_box" v-if="repairBillObj.billStatus==2" style="text-align:center;padding:30px;">
        <button class="send_btn" @click="openRebootBill()">重启工单</button>
      </div>
    </div>

    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="860px" append-to-body>
      <div style="text-align:center;">
        <img :src="lookBigImgUrl" style="max-width:100%;" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入im服务需要的包
import { Buffer } from 'buffer'
import { Base64 } from 'js-base64'
import eio from 'engine.io-client'
import immsg from '@/utils/immsg/msg_pb.js'
import order from '@/utils/immsg/byte_order.js'
// 引入vuex
import { mapGetters } from 'vuex'
// 引入请求
import config from '../../../env/config.js'
import { addImgFile } from '@/api/repairBill.js'


/**************** 定义IM消息用到的标识 *****************/
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
const IM_CMD_PULL_MSG = 311
const IM_CMD_PULL_MSG_RES = 312
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
//历史消息
const IM_CMD_HISTORY_MSG = 326
const IM_CMD_HISTORY_MSG_RES = 327
//客户端拉取消息
// 连接状态
const STATE_UNCONNECTED = 1;
const STATE_CONNECTING = 2;
const STATE_CONNECTED = 3;
const STATE_CONNECTFAIL = 4;
//超时时间
const ACK_TIMEOUT = 3;
//心跳超时时间
const HEART_TIME_OUT = 30 * 1000;


export default {
  name: "chat",
  props: ["merchantChatObj", "acceptorChatObj", "repairBillObj", "currentChat"],
  data() {
    const loginParam = JSON.parse(localStorage.getItem("loginParam"));
    const token = localStorage.getItem("token");
    return {
      /**************** im接口数据 *****************/
      imService: null,
      // im消息需要的参数
      url: config.IM_SERVER_CONFIG,
      no: loginParam.accountname,
      accessToken: token,
      syncKey: 0,
      minGotOffset: 4299999999,
      groupSyncKeys: {},
      uid: null,
      device_id: "web_" + this.createGuid(),
      observer: {
        handleMessageFailure: function () { },
        handleCustomerMessageFailure: function () { },
        handleGroupMessageFailure: function () { },
      },
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
      //收到包的总数
      recvPacketNum: 0,
      //检查心跳包的次数
      checkHeartCount: 0,
      //连接定时器
      conTimer: null,
      pullFlag: false, // 拉取标记
      imConnectError: '',// im断开重连提示


      /**************** 工单和聊天的数据 *****************/
      msg: '',
      chatMessageList: [], // 当前窗口聊天的消息列表
      failMessageList: [], // 发送失败的消息id列表
      allChatMessageList: [],// 聊天内容，包含所有接收到的历史消息
      isChatFocus: false, // 聊天窗口是否focus，只有focus才可以粘贴发送图片
      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: '',
    }
  },
  computed: {
    ...mapGetters(['loginParam'])
  },
  watch: {
    merchantChatObj() {
      this.renderChatMessage();
      this.scrollToBottom();
    },
    acceptorChatObj() {
      this.renderChatMessage();
      this.scrollToBottom();
    },
    currentChat() {
      this.renderChatMessage();
      this.scrollToBottom();
    }
  },
  created() { },
  mounted() {
    // 创建im服务器
    this.createImService();

    // 只有光标在聊天 窗口内才可以粘贴发送图片
    document.addEventListener('paste', event => {
      if (this.isChatFocus) {
        this.contentPasteImage(event);
      }
    })
  },
  methods: {
    /**
     * 收到新消息
     */
    setNewChatMessage(content) {
      this.allChatMessageList.push(content);
      if (content.includes("repairBillNo")) {
        let obj = this.parseContent(content);
        this.$emit("countImmsgChatUnRead", obj.repairBillNo);
        // 判断如果是当前聊天窗口的新消息，就追加到当前聊天的数组里
        if (obj.repairBillNo == this.repairBillObj.repairBillNo) {
          this.renderCurrentChatMessage(obj);
        }
      }
    },
    /**
     * 拉取历史消息
     */
    setHistoryChatMessage(content) {
      this.allChatMessageList.unshift(content);
    },
    /**
     * 切换工单聊天窗口，从历史数据中获取信息并解析
     */
    renderChatMessage() {
      let myUid = localStorage.getItem("chatImmsgUid");// 我的uid
      let merchantUid = this.merchantChatObj.uid; // 商家的uid
      let acceptorUid = this.acceptorChatObj.uid;// 承兑人的uid
      let repairBillNo = this.merchantChatObj.repairBillNo; // 当前聊天的工单号
      // 先解析留言内容
      this.renderLeaveMessage();
      // 商家的聊天解析
      if (this.currentChat == 0) {
        let chatMessageList = [];
        this.allChatMessageList.forEach((v, i) => {
          if (v && v.includes("repairBillNo")) {
            let obj = this.parseContent(v);
            if (obj.repairBillNo == repairBillNo) {
              // 我发送给当前聊天人的信息
              if (obj.fromUid == myUid && obj.toUid == merchantUid) {
                chatMessageList.push({
                  type: "my",
                  msgId: obj.msgId,
                  msg: obj.msg,
                  sendFail: obj.sendFail,
                  sendType: obj.sendType,
                  sendTime: obj.sendTime,
                })
              }
              // 当前聊天人发送给我的信息
              if (obj.fromUid == merchantUid && obj.toUid == myUid) {
                chatMessageList.push({
                  type: "other",
                  msg: obj.msg,
                  sendType: obj.sendType,
                  sendTime: obj.sendTime,
                })
              }
              // 系统发送给我的消息
              if (obj.type && obj.type == "system" && obj.toUid == myUid) {
                chatMessageList.push({
                  type: "system",
                  msg: obj.msg,
                  sendType: obj.sendType,
                  sendTime: obj.sendTime,
                })
              }
            }
          }
        })
        this.chatMessageList = this.chatMessageList.concat(chatMessageList);
      }
      // 承兑人的聊天解析
      if (this.currentChat == 1) {
        let chatMessageList = [];
        this.allChatMessageList.forEach((v, i) => {
          if (v && v.includes("repairBillNo")) {
            let obj = this.parseContent(v);
            if (obj.repairBillNo == repairBillNo) {
              // 我发送给当前聊天人的信息
              if (obj.fromUid == myUid && obj.toUid == acceptorUid) {
                chatMessageList.push({
                  type: "my",
                  msgId: obj.msgId,
                  msg: obj.msg,
                  sendFail: obj.sendFail,
                  sendType: obj.sendType,
                  sendTime: obj.sendTime,
                })
              }
              // 当前聊天人发送给我的信息
              if (obj.fromUid == acceptorUid && obj.toUid == myUid) {
                chatMessageList.push({
                  type: "other",
                  msg: obj.msg,
                  sendType: obj.sendType,
                  sendTime: obj.sendTime,
                })
              }
              // 系统发送给我的消息
              if (obj.type && obj.type == "system" && obj.toUid == myUid) {
                chatMessageList.push({
                  type: "system",
                  msg: obj.msg,
                  sendType: obj.sendType,
                  sendTime: obj.sendTime,
                })
              }
            }
          }
        })
        this.chatMessageList = this.chatMessageList.concat(chatMessageList);
      }
    },
    /**
     * 解析别人发送给我的消息，包括系统和普通聊天消息
     */
    renderCurrentChatMessage(obj) {
      let chatMessageList = [];
      let myUid = localStorage.getItem("chatImmsgUid");// 我的uid
      let merchantUid = this.merchantChatObj.uid; // 商家的uid
      let acceptorUid = this.acceptorChatObj.uid;// 承兑人的uid
      // 商家发送给我的信息，可以接收文字，图片等
      if (this.currentChat == 0) {
        if (obj.fromUid == merchantUid && obj.toUid == myUid) {
          chatMessageList.push({
            type: "other",
            msg: obj.msg,
            sendType: obj.sendType,
            sendTime: obj.sendTime,
          })
        }
        // 系统发送给我的消息
        if (obj.type && obj.type == "system" && obj.toUid == myUid) {
          chatMessageList.push({
            type: "system",
            msg: obj.msg,
            sendType: obj.sendType,
            sendTime: obj.sendTime,
          })
        }
        this.chatMessageList = this.chatMessageList.concat(chatMessageList);
      }
      // 承兑人发送给我的信息，可以接收文字，图片等
      if (this.currentChat == 1) {
        if (obj.fromUid == acceptorUid && obj.toUid == myUid) {
          chatMessageList.push({
            type: "other",
            msg: obj.msg,
            sendType: obj.sendType,
            sendTime: obj.sendTime,
          })
        }
        // 系统发送给我的消息
        if (obj.type && obj.type == "system" && obj.toUid == myUid) {
          chatMessageList.push({
            type: "system",
            msg: obj.msg,
            sendType: obj.sendType,
            sendTime: obj.sendTime,
          })
        }
        this.chatMessageList = this.chatMessageList.concat(chatMessageList);
      }
      // 接收到新消息，会自动滚动到底部
      this.scrollToBottom();
    },
    /**
     * 解析留言的内容
     */
    renderLeaveMessage() {
      let chatMessageList = [];
      if (this.repairBillObj.messageList && this.repairBillObj.messageList.length > 0) {
        this.repairBillObj.messageList.forEach((v, i) => {
          chatMessageList.push(this.parseContent(v.leaveMessage));
        })
      }
      this.chatMessageList = chatMessageList;
    },

    /**
     * im发送消息操作
     */
    renderTime(str) {
      if (!str) return;
      let formatDate = function (date) {
        let y = date.getFullYear();
        let m = (Number(date.getMonth()) + 1) > 9 ? (Number(date.getMonth()) + 1) : ("0" + (Number(date.getMonth()) + 1));
        let d = Number(date.getDate()) > 9 ? Number(date.getDate()) : ("0" + Number(date.getDate()));
        return y + "-" + m + "-" + d;
      }
      // 当前时间
      let currentDate = formatDate(new Date(str));
      // 今天时间
      let nowDate = formatDate(new Date());
      // 昨天时间
      let zuoDate = new Date();
      zuoDate.setDate(zuoDate.getDate() - 1);
      zuoDate = formatDate(zuoDate);

      if (currentDate == nowDate) {
        let j = new Date(str);
        let hours = Number(j.getHours()) > 9 ? Number(j.getHours()) : "0" + Number(j.getHours());
        let minutes = Number(j.getMinutes()) > 9 ? Number(j.getMinutes()) : "0" + Number(j.getMinutes());
        return hours + ":" + minutes;
      } else if (currentDate == zuoDate) {
        let z = new Date(str);
        let hours = Number(z.getHours()) > 9 ? Number(z.getHours()) : "0" + Number(z.getHours());
        let minutes = Number(z.getMinutes()) > 9 ? Number(z.getMinutes()) : "0" + Number(z.getMinutes());
        return "昨天" + hours + ":" + minutes;
      } else {
        let cyear = currentDate.substring(0, 4);
        let nyear = nowDate.substring(0, 4);
        if (cyear == nyear) {
          let c = new Date(currentDate);
          let month = c.getMonth() + 1 > 9 ? c.getMonth() + 1 : "0" + (c.getMonth() + 1);
          let day = c.getDate();
          return month + "-" + day;
        } else {
          return currentDate;
        }
      }
    },
    getDefaultTime(date = new Date()) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let digit = function (str, num = 1) {
        str = str.toString();
        return str[1] ? str : '0' + str;
      }
      return [year, month, day].map(digit).join("-") + " " + [hour, minute, second].map(digit).join(":");
    },
    parseContent(content) {
      if (content && content.indexOf("}") > 0) {
        return JSON.parse(content);
      }
    },
    scrollToBottom: function () {
      this.$nextTick(() => {
        var container = this.$el.querySelector(".chat_box");
        container.scrollTop = container.scrollHeight;
      })
    },
    createMsgId() {
      return Number(new Date().getTime() + '' + Math.floor(Math.random() * 100));
    },

    /**
      * 聊天粘贴发送图片
      */
    contentPasteImage(e) {
      // 获得粘贴板内容
      let clipboardData = e.clipboardData || e.originalEvent.clipboardData;
      // 粘贴操作
      if (clipboardData.types && clipboardData.items.length > 0) {
        for (let item of clipboardData.items) {
          // 遍历粘贴板内容，判断只有图片的时候才会上传
          if (item && item.kind == "file" && item.type.match(/^image/)) {
            // 将粘贴板的文件转为file
            let file = item.getAsFile();
            // 将文件组装成elementui上传组件支持解析的结构，再调用onuploadchange方法
            let imageFile = {
              name: file.name,
              percentage: 100,
              size: file.size,
              raw: file,
              from: "paste",
              status: 'finished',
              uid: file.lastModified,
            }
            console.log(imageFile);
            this.onUploadChange(imageFile)
            break;
          }
        }
      }
    },
    onUploadChange(file) {
      console.log(file);
      const IMGTYPE = ['image/jpeg', 'image/png', 'image/jpg']
      const MAXSIZE = 5 * 1024 * 1024;
      if (IMGTYPE.indexOf(file.raw.type) < 0) {
        this.$message({
          message: '支持发送(*.jpg/*.png/*.jpeg)格式的图片',
          type: 'error'
        })
        return
      }
      if (file.size > MAXSIZE) {
        this.$message({
          message: '发送图片大小不能超过5M！',
          type: 'error'
        })
        return
      }
      // 读取文件
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      // 读取成功，请求后台
      reader.onload = (e) => {
        addImgFile({ imageContent: reader.result, imageType: 'CLOUD_FLASH_PAY' }).then(res => {
          if (res.data.code === 200) {
            if (this.currentChat == 0) {
              this.sendMerchantImgMessage(res.data.data.imageFullUrl, reader.result);
            }
            if (this.currentChat == 1) {
              this.sendAcceptorImgMessage(res.data.data.imageFullUrl, reader.result);
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'

            })
          }
        })
      }
    },

    /**
     * 和商家发送消息
     */
    enterSendForMerchant(e) {
      // 判断同时按下ctrl+enter,或者command+enter会回车换行
      if (e.ctrlKey && e.key == "Enter") {
        this.msg += "\n";
      } else if (e.metaKey && e.key == "Enter") {
        this.msg += "\n";
      }
      else {
        // 否则，只有单独按回车键的时候才会回车提交数据，并组织默认换行事件
        if (e.key == "Enter") {
          e.preventDefault();
          this.sendMerchantMessage(this.msg);
          return false;
        }
      }
    },
    sendMerchantMessage(msg) {
      if (!msg) return;

      // 发送的数据格式
      let sendMessage = {
        repairBillNo: this.repairBillObj.repairBillNo,  // 聊天的工单的id，通过这个来标识是哪个工单的聊天信息
        fromUid: this.uid,//  发送人的uid
        fromName: this.no,
        toUid: this.merchantChatObj.uid,// 接收人uid
        toName: this.merchantChatObj.name,// 接收人名称
        msgId: this.createMsgId(), // 生成每条发送消息对应的唯一标识
        msg: msg,// 发送聊天的内容
        sendType: "text",
        sendTime: this.getDefaultTime(),// 发送的时间
      }
      // 发送的消息到服务端
      let sendSuccess = this.sendImmsg(Number(this.merchantChatObj.uid), 0, JSON.stringify(sendMessage));
      // 发送失败消息
      if (!sendSuccess) {
        sendMessage.sendFail = true;
      }
      // 备份消息到本地所有消息中
      this.allChatMessageList.push(JSON.stringify(sendMessage));
      // 存储到当前会话消息中
      this.chatMessageList.push({
        type: "my",
        msgId: sendMessage.msgId,
        msg: sendMessage.msg,
        sendFail: sendMessage.sendFail,
        sendType: sendMessage.sendType,
        sendTime: sendMessage.sendTime,
      });

      this.scrollToBottom();
      this.msg = '';
      this.$emit("addUserToRepairGroup");
      this.$emit("setChatToListTop", this.repairBillObj.id);
    },
    sendMerchantImgMessage(imageUrl, imageData) {
      if (!imageUrl) return;
      // 生成消息的ID
      let msgId = this.createMsgId();
      // 发送到服务器的数据格式
      let sendMessageServer = {
        repairBillNo: this.repairBillObj.repairBillNo,  // 聊天的工单的id，通过这个来标识是哪个工单的聊天信息
        fromUid: this.uid,//  发送人的uid
        fromName: this.no,
        toUid: this.merchantChatObj.uid,// 接收人uid
        toName: this.merchantChatObj.name,// 接收人名称
        msgId: msgId, // 生成每条发送消息对应的唯一标识
        msg: imageUrl,// 发送聊天的内容
        sendType: "image", // 发送的消息类型，文字，图片，音频等
        sendTime: this.getDefaultTime(),// 发送的时间
      }
      // 存储到本地的数据格式
      let sendMessageLocal = {
        repairBillNo: this.repairBillObj.repairBillNo,  // 聊天的工单的id，通过这个来标识是哪个工单的聊天信息
        fromUid: this.uid,//  发送人的uid
        fromName: this.no,
        toUid: this.merchantChatObj.uid,// 接收人uid
        toName: this.merchantChatObj.name,// 接收人名称
        msgId: msgId, // 生成每条发送消息对应的唯一标识
        msg: imageData,// 发送聊天的内容
        msgUrl: imageUrl,
        sendType: "image", // 发送的消息类型，文字，图片，音频等
        sendTime: this.getDefaultTime(),// 发送的时间
      }
      // 发送的消息到服务端
      let sendSuccess = this.sendImmsg(Number(this.merchantChatObj.uid), 0, JSON.stringify(sendMessageServer));
      // 发送失败消息
      if (!sendSuccess) {
        sendMessageLocal.sendFail = true;
      }
      // 备份消息到本地所有消息中
      this.allChatMessageList.push(JSON.stringify(sendMessageLocal));
      // 存储到当前会话消息中
      this.chatMessageList.push({
        type: "my",
        msgId: sendMessageLocal.msgId,
        msg: sendMessageLocal.msg,
        msgUrl: sendMessageLocal.msgUrl,
        sendFail: sendMessageLocal.sendFail,
        sendType: sendMessageLocal.sendType,
        sendTime: sendMessageLocal.sendTime,
      });
      this.scrollToBottom();
      this.msg = '';
      this.$emit("addUserToRepairGroup");
      this.$emit("setChatToListTop", this.repairBillObj.id);
    },
    /**
     * 和承兑人发送消息
     */
    enterSendForAcceptor(e) {
      // 判断同时按下ctrl+enter,或者command+enter会回车换行
      if (e.ctrlKey && e.key == "Enter") {
        this.msg += "\n";
      } else if (e.metaKey && e.key == "Enter") {
        this.msg += "\n";
      }
      else {
        // 否则，只有单独按回车键的时候才会回车提交数据，并组织默认换行事件
        if (e.key == "Enter") {
          e.preventDefault();
          this.sendAcceptorMessage(this.msg);
          return false;
        }
      }
    },
    sendAcceptorMessage(msg) {
      if (!msg) return;
      // 发送的数据格式
      let sendMessage = {
        repairBillNo: this.repairBillObj.repairBillNo,  // 聊天的工单的id，通过这个来标识是哪个工单的聊天信息
        fromUid: this.uid,//  发送人的uid
        fromName: this.no,
        toUid: this.acceptorChatObj.uid,// 接收人uid
        toName: this.acceptorChatObj.name,// 接收人名称
        msgId: this.createMsgId(), // 生成每条发送消息对应的唯一标识
        msg: msg,// 发送聊天的内容
        sendType: "text",
        sendTime: this.getDefaultTime(),// 发送的时间
      }
      // 发送的消息到服务端
      let sendSuccess = this.sendImmsg(Number(this.acceptorChatObj.uid), 0, JSON.stringify(sendMessage));
      // 发送失败消息
      if (!sendSuccess) {
        sendMessage.sendFail = true;
      }
      // 备份消息到本地所有消息中
      this.allChatMessageList.push(JSON.stringify(sendMessage));
      // 存储到当前会话消息中
      this.chatMessageList.push({
        type: "my",
        msgId: sendMessage.msgId,
        msg: sendMessage.msg,
        sendFail: sendMessage.sendFail,
        sendType: sendMessage.sendType,
        sendTime: sendMessage.sendTime,
      });
      this.scrollToBottom();
      this.msg = '';
      this.$emit("addUserToRepairGroup");
      this.$emit("setChatToListTop", this.repairBillObj.id);
    },
    sendAcceptorImgMessage(imageUrl, imageData) {
      if (!imageUrl) return;
      // 生成消息的ID
      let msgId = this.createMsgId();
      // 发送到服务器的数据格式
      let sendMessageServer = {
        repairBillNo: this.repairBillObj.repairBillNo,  // 聊天的工单的id，通过这个来标识是哪个工单的聊天信息
        fromUid: this.uid,//  发送人的uid
        fromName: this.no,
        toUid: this.acceptorChatObj.uid,// 接收人uid
        toName: this.acceptorChatObj.name,// 接收人名称
        msgId: msgId, // 生成每条发送消息对应的唯一标识
        msg: imageUrl,// 发送聊天的内容
        sendType: "image", // 发送的消息类型，文字，图片，音频等
        sendTime: this.getDefaultTime(),// 发送的时间
      }
      // 存储到本地的数据格式
      let sendMessageLocal = {
        repairBillNo: this.repairBillObj.repairBillNo,  // 聊天的工单的id，通过这个来标识是哪个工单的聊天信息
        fromUid: this.uid,//  发送人的uid
        fromName: this.no,
        toUid: this.acceptorChatObj.uid,// 接收人uid
        toName: this.acceptorChatObj.name,// 接收人名称
        msgId: msgId, // 生成每条发送消息对应的唯一标识
        msg: imageData,// 发送聊天的内容
        msgUrl: imageUrl,
        sendType: "image", // 发送的消息类型，文字，图片，音频等
        sendTime: this.getDefaultTime(),// 发送的时间
      }
      // 发送的消息到服务端
      let sendSuccess = this.sendImmsg(Number(this.acceptorChatObj.uid), 0, JSON.stringify(sendMessageServer));
      // 发送失败消息
      if (!sendSuccess) {
        sendMessageLocal.sendFail = true;
      }
      // 备份消息到本地所有消息中
      this.allChatMessageList.push(JSON.stringify(sendMessageLocal));
      // 存储到当前会话消息中
      this.chatMessageList.push({
        type: "my",
        msgId: sendMessageLocal.msgId,
        msg: sendMessageLocal.msg,
        msgUrl: sendMessageLocal.msgUrl,
        sendFail: sendMessageLocal.sendFail,
        sendType: sendMessageLocal.sendType,
        sendTime: sendMessageLocal.sendTime,
      });
      this.scrollToBottom();
      this.msg = '';
      this.$emit("addUserToRepairGroup");
      this.$emit("setChatToListTop", this.repairBillObj.id);
    },

    /**
     * 重新发送消息
     */
    trySendMessage(item, index) {
      let obj = item;
      console.log('当前要重新发送的消息：', obj);
      // 重发消息会删除缓存消息和当前窗口聊天消息对应的那条消息
      for (let index in this.allChatMessageList) {
        if (this.allChatMessageList[index].msgId == item.msgId) {
          this.allChatMessageList.splice(index, 1);
          break;
        }
      }
      this.chatMessageList.splice(index, 1);
      // 商家
      if (this.currentChat == 0) {
        if (obj.sendType == "text") {
          this.sendMerchantMessage(obj.msg);
        }
        if (obj.sendType == "image") {
          this.sendMerchantImgMessage(obj.msgUrl, obj.msg);
        }
      }
      // 承兑人
      if (this.currentChat == 1) {
        if (obj.sendType == "text") {
          this.sendAcceptorMessage(obj.msg);
        }
        if (obj.sendType == "image") {
          this.sendAcceptorImgMessage(obj.msgUrl, obj.msg);
        }
      }
    },
    /**
     * 处理发送失败的消息
     */
    handleMessageFailure(msg) {
      msg = Base64.decode(msg.getContent());
      let failObj = this.parseContent(msg);
      console.log('发送失败的消息：', failObj);
      this.failMessageList.push(failObj.msgId);
      this.chatMessageList.forEach((v, i) => {
        if (this.failMessageList.includes(v.msgId)) {
          v.sendFail = true;
          return false;
        }
      })
    },


    /**************************工单相关的操作 ***************************/
    /**
     * 打开完结工单弹框
     */
    openFinishBill() {
      this.$emit("openFinishBill");
    },
    /**
     * 打开重启工单
     */
    openRebootBill() {
      this.$emit("openRebootBill")
    },
    /**
     * 查看单大图
     */
    openLookBigImgModal(url) {
      this.lookBigImgUrl = url;
      this.lookBigImgModal = true;
    },



    /**************************im服务器提供的接口 ***************************/
    createImService() {
      if ("WebSocket" in window) {
        this.startImService();
      } else {
        console.error("当前浏览器不支持WebSocket！")
      }
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
      console.log("on connectImService")
      let _this = this;
      _this.imConnectError = '正在连接';
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
      var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
      console.log("im client begin connect server....")
      _this.imService = new BrowserWebSocket(_this.url)

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
          //console.log(reader.result, '-------reader.result------')
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
      console.log("im client onOpen")
      let _this = this;
      if (_this.connectState != STATE_CONNECTING) {
        //不在正在连接状态
        console.error("onOpen error,_this.connectState!=STATE_CONNECTING")
        return
      }

      _this.imConnectError = ''; // im服务器重连
      // 登陆
      _this.sendLogin()
      if (_this.roomID > 0) {
        _this.sendEnterRoom(_this.roomID)
      }

      if (_this.conTimer) {
        //清除连接定时器
        clearInterval(this.conTimer);
        this.conTimer = null;
      }

      if (_this.pingTimer) {
        //清除连接定时器
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }

      //登录成功设置发送心跳
      _this.pingTimer = setInterval(() => {
        _this.sendHeartPing();
      }, HEART_TIME_OUT);


      _this.isSyncing = true
      _this.syncTimestamp = 0;
      _this.pendingSyncKey = 0;
      _this.nextSyncKey = 0;
      _this.connectFailCount = 0;
      _this.checkHeartCount = 0;
      _this.recvPacketNum = 0;
      _this.seq = 0;
      _this.connectState = STATE_CONNECTED;
      _this.callStateObserver();
    },
    /**
     * im消息服务关闭
     */
    onClose() {
      console.log("im client onClose")
      let _this = this;

      if (_this.connectState != STATE_CONNECTED) {
        //不在连接状态
        console.log("onClose error,_this.connectState!=STATE_CONNECTED")
        return
      }

      if (_this.imService == null) {
        //socket 对象为空
        console.log("onClose error,_this.imService==null")
        return
      }

      _this.imConnectError = '连接断开'; // im服务器重连
      _this.imService = null;
      _this.connectState = STATE_UNCONNECTED;
      _this.callStateObserver();

      var failedMsgNum = 0
      for (let seq in _this.messages) {
        failedMsgNum++
        let msg = _this.messages[seq];
        if (_this.observer != null && "handleMessageFailure" in _this.observer) {
          _this.handleMessageFailure(msg);
          _this.observer.handleMessageFailure(msg);
        }
      }
      console.error("client send msg failed,failedMsgNum num=", failedMsgNum)
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

      var self = _this;
      var f = function () {
        self.connectImService();
      };
      this.conTimer = setTimeout(f, 400);
      if (this.pingTimer) {
        //清除心跳计时器
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
      this.recvPacketNum = 0;
      this.checkHeartCount = 0;
    },
    /**
     * im消息服务连接失败
     */
    onError(err) {

      console.log("im client onError")
      let _this = this;

      if (_this.connectState != STATE_CONNECTING) {
        //不在正在连接状态
        console.log("onError,_this.connectState!=STATE_CONNECTING,return")
        return
      }
      if (_this.imService == null) {
        console.log("onError,imService==null,return")
        return
      }

      _this.imConnectError = '连接失败'; // im服务器重连
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
      // console.log("onMessage im status =", _this.connectState)

      if (_this.connectState != STATE_CONNECTED) {
        console.error("error:im onMessage is not [STATE_CONNECTED] status,but i received a message")
        return
      }
      if (_this.imService == null) {
        console.error("error:onMessage im imService=[null],but i received a message")
        return
      }
      _this.recvPacketNum++;

      let len = order.ntohs(buf, 0);
      let cmd = order.ntohs(buf, 2);
      console.log("im msg len,cmd=", len, cmd)

      let bodybuf = buf.slice(4, buf.length)
      let bodyff = immsg.ImClientSendMsg.deserializeBinary(bodybuf);
      if (cmd == IM_CMD_LOGIN_RES) {
        //接收到IM 登录的回应消息
        let res = immsg.ImLoginRes.deserializeBinary(bodybuf);
        if (res.getCode() == 200) {
          //服务端返回了我的UID
          _this.uid = res.getUid()
          console.log("login sucess,no=" + _this.no + ",uid=" + _this.uid + ",sid=" + res.getSessionid());

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
        // 拉取消息的控制，只拉取一次
        if (!_this.pullFlag) {
          _this.pullMsg(0, 10)
          _this.pullFlag = true;
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
        let content = _this.Utf8ArrayToStr(res.getContent());

        //是我自己发出去的消息
        if (res.getFromuid() == _this.uid) {
          // console.log("我发送出去的消息：" + content)
        }
        else {
          // 收到新消息
          console.log("收到新消息：" + content)
          this.setNewChatMessage(content);
        }

        let offset = res.getOffset();
        let next = res.getNextoffset();

        if (_this.minGotOffset > offset) {
          _this.minGotOffset = offset
        }


        if ((next > 0) && (next <= offset)) {
          //服务端下发的偏移不合法  next 应该大于offset
          console.log("IM_CMD_CLIENT_SEND_IM,next and offset is invalid")
          _this.sendImAckReadedMsg(_this.syncKey);
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
          _this.sendImAckReadedMsg(_this.syncKey);
        }
        else {
          //消息偏移不连续，丢了包
          //  _this.sendImAckReadedMsg(_this.syncKey);
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
      else if (cmd == IM_CMD_HISTORY_MSG) {
        //收到了服务端发送的客户端拉取的历史消息
        let res = immsg.ImHistoryMsg.deserializeBinary(bodybuf);
        let content = _this.Utf8ArrayToStr(res.getContent());
        //是我自己发出去的消息
        if (res.getFromuid() == _this.uid) {
        }
        else {
          //其他人发给我的消息
        }

        let offset = res.getOffset();
        let next = res.getNextoffset();

        if (offset < _this.minGotOffset) {
          // 拉取到的历史消息
          console.log('拉取历史消息：', content);
          this.setHistoryChatMessage(content);
        } else {
          console.log('warnning:IM_CMD_HISTORY_MSG too long msg offset:', offset, _this.minGotOffset);
        }

        if ((next > 0) && (next <= offset)) {
          //服务端下发的偏移不合法  next 应该大于offset
          console.log("IM_CMD_CLIENT_SEND_IM,next and offset is invalid")
        }
      }
      else if (cmd == IM_CMD_CLIENT_SEND_IM_RES) {
        //收到了服务端对消息的确认s
        let ackmsg = immsg.ImClientSendMsgRes.deserializeBinary(bodybuf);
        let ack = ackmsg.getHead().getSeq();

        if (ack in this.messages) {
          var msg = this.messages[ack];
          if (this.observer != null && "handleMessageACK" in this.observer) {
            this.observer.handleMessageACK(msg);
          }
          delete this.messages[ack];
        }
        if (ack in this.customerMessages) {
          var msg = this.customerMessages[ack];
          if (this.observer != null && "handleCustomerMessageACK" in this.observer) {
            this.observer.handleCustomerMessageACK(msg);
          }
          delete this.customerMessages[ack];
        }

        for (ack in this.groupMessages) {
          var msg = this.groupMessages[ack];
          if (this.observer != null && "handleGroupMessageACK" in this.observer) {
            this.observer.handleGroupMessageACK(msg);
          }
          delete this.groupMessages[ack];
        }
      }
    },
    /**
     * 检查是否有消息ack超时
     */
    checkAckTimeout() {

      var now = new Date().getTime() / 1000;
      var n1 = Math.floor(now)

      var isTimeout = false;
      var ack;
      for (ack in this.messages) {
        var msg = this.messages[ack];
        var seq = msg.getHead().getSeq();
        var msg_timestamp = msg.getTimestamp()

        if (n1 - msg_timestamp >= ACK_TIMEOUT) {
          console.error("client im msg ,time out,seq=", seq)
          isTimeout = true;
        }
      }

      if (isTimeout) {
        console.error("ack timeout, close socket");
        this.onClose();
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
     * 拉取syncKey 指定的消息，num条
     */
    pullMsg(syncKey, num) {

      let _this = this;
      let req = new immsg.ImPullMsg()
      req.setOffset(syncKey)
      req.setNum(num)
      _this.sendpb(IM_CMD_PULL_MSG, req, false)
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

      return true

    },
    /**
     * im消息服务发送登录的消息
     */
    sendLogin() {
      let _this = this;
      let login = new immsg.ImLogin()
      /*
      if(_this.no.indexOf('@')>0){
        login.setNo(_this.no.split("@")[1])
      }else{
        login.setNo(_this.no)
      }*/
      login.setNo(_this.no)
      login.setToken(_this.accessToken)
      login.setTimestamp(0)
      login.setDevid("sssss")
      login.setRole("back-aa")
      login.setPlatformId(1)
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

      if (this.connectState != STATE_CONNECTED) {
        return false;
      }

      var now = new Date().getTime() / 1000;
      var n1 = Math.floor(now)

      content = Base64.encode(content);
      let chat = new immsg.ImClientSendMsg();
      chat.setMsgtype(msgType)
      chat.setFromuid(this.uid)
      chat.setTouid(toUID)
      chat.setLen(content.length)
      chat.setContent(content)
      chat.setTimestamp(n1)
      if (!this.sendpb(IM_CMD_CLIENT_SEND_IM, chat, false)) {
        //发送失败
        return false
      }
      this.messages[this.seq] = chat;

      var self = this;
      var t = ACK_TIMEOUT * 1000 + 100;
      setTimeout(function () {
        self.checkAckTimeout();
      }, t);

      return true

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
      let _this = this

      if (_this.connectState != STATE_CONNECTED) {
        //不在正在连接状态
        console.error("sendHeartPing,_this.connectState!=STATE_CONNECTED,return")
        return
      }
      if (_this.imService == null) {
        console.error("sendHeartPing,imService==null,return")
        return
      }
      let now = new Date().getTime() / 1000;
      console.log("now=", now, "checkHeartCount=", _this.checkHeartCount, "  recvPacketNum=", _this.recvPacketNum)

      let ping = new immsg.ImHeartPing();

      _this.sendpb(IM_CMD_HEART_PING, ping, false)
      _this.checkHeartCount++;

      if (_this.checkHeartCount % 2 != 0) {
        return;
      }
      if (_this.recvPacketNum > 0) {
        _this.recvPacketNum = 0;
        return
      }

      console.error("check heart failed,socket connection may disconnected");
      _this.onClose();
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
/* 右侧聊天窗口 */
.immsg_chat_container {
  padding: 0px;
  background: #f1f1f1;
  border-bottom: solid 1px #ddd;
  border-radius: 2px;
  height: 90vh;
  overflow: hidden;
}
/* 聊天窗口 */
.immsg_chat_container .chat_box {
  height: 70vh;
  padding: 10px;
  overflow: auto;
}
.immsg_chat_container .chat_box .other_box .chat {
  padding: 0px 0px 40px 0px;
  float: left;
  display: flex;
  position: relative;
}
.immsg_chat_container .chat_box .other_box .chat .chat_logo {
  width: 60px;
  text-align: center;
}
.immsg_chat_container .chat_box .other_box .chat .chat_logo img {
  width: 42px;
  height: 42px;
}
.immsg_chat_container .chat_box .other_box .chat .chat_content {
  flex: 1;
  background: #fff;
  border-radius: 6px;
  max-width: 500px;
  padding: 12px 18px;
  font-size: 13px;
  position: relative;
  bottom: -10px;
  word-break: break-all;
}
.immsg_chat_container .chat_box .other_box .chat_time {
  text-align: center;
  font-size: 12px;
}
/* 系统消息 */
.immsg_chat_container .chat_box .system_box {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 6px 10px;
}
.immsg_chat_container .chat_box .system_box .chat_time {
  padding: 6px;
  color: #333;
}
/* 我发起的消息 */
.immsg_chat_container .chat_box .my_box .chat {
  padding: 0px 0px 40px 0px;
  float: right;
  display: flex;
  position: relative;
}
.immsg_chat_container .chat_box .my_box .chat .chat_logo {
  width: 60px;
  text-align: center;
}
.immsg_chat_container .chat_box .my_box .chat .chat_logo img {
  width: 42px;
  height: 42px;
}
.immsg_chat_container .chat_box .my_box .chat .chat_content {
  background: #fff;
  flex: 1;
  border-radius: 6px;
  max-width: 500px;
  padding: 12px 18px;
  font-size: 13px;
  position: relative;
  bottom: -10px;
}
.immsg_chat_container .chat_box .my_box .chat_time {
  text-align: center;
  font-size: 12px;
}

/* 发送消息 */
.immsg_chat_container .send_box {
  height: 20vh;
  background: #fff;
  position: relative;
  box-sizing: border-box;
}
.immsg_chat_container .send_box textarea {
  height: 20vh;
  width: 100%;
  border: 0;
  outline: none;
  border: solid 1px #eee;
  box-sizing: border-box;
  padding: 8px 12px;
  font-size: 14px;
  resize: none;
}
.immsg_chat_container .send_box .send_btn_box {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.immsg_chat_container .send_box .send_btn {
  height: 34px;
  width: 100px;
  font-size: 13px;
  background: #00b389;
  border: 0;
  text-align: center;
  border-radius: 2px;
  color: #fff;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0px 5px;
}
.immsg_chat_container .send_box .send_btn:hover {
  background: #01c597;
}

/*  */
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 14px;
  color: #909399;
}
input::-ms-input-placeholder,
textarea::-ms-input-placeholder {
  font-size: 14px;
  color: #909399;
}

/* 全局暴露的上传图片样式 */
.upload_container .upload_image_list {
  height: 120px;
  width: 120px;
  display: inline-block;
  border-radius: 4px;
  position: relative;
  margin-right: 15px;
  margin-bottom: 15px;
}

.upload_container .upload_image_list img {
  height: 120px;
  width: 120px;
}

.upload_container .upload_image_list .upload_image_remove {
  font-size: 22px;
  color: #999;
  position: absolute;
  top: -12px;
  right: -12px;
  transition: all 0.2s;
  cursor: pointer;
}

.upload_container .upload_image_list .upload_image_remove:hover {
  color: #555;
}

.upload_container .avatar-uploader {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  background: #f2f2f2;
}

.upload_container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.upload_container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 90px;
  text-align: center;
}

.upload_container .avatar-uploader .desc_text {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #8c939d;
}

.upload_container .avatar-uploader .desc_text:hover {
  color: #8c939d;
}
</style>
