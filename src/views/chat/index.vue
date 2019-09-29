<template>
  <div>
    <el-row>
        <!-- 聊天列表 -->
        <el-col :span="6">            
            <div class="chat-list">
                <div class="isTalking">会话中({{talkNum}})</div>
                <div class="chatList" :style="{height:height}" id="chatList">
                    <div class="chat-item" @click="startChat(index,chatList)" v-for="(item,index) of chatList" :key="index">
                      <div  v-bind:class="{ choice:item.flag}" style="padding-left: 30px; padding-right: 10px;">
                          <div class="item-top">
                              <p class="item-nickname"> {{item.touser.length>5?item.touser.substring(0,5)+"...":item.touser}}</p>
                              <p class="item-time">{{item.createTime | parseTime('{h}:{i}:{s}')}}</p>
                          </div>
                          <div class="item-bottom">
                              <p class="item-news">{{item.content.length>10?item.content.substring(0,10)+"...":item.content}}</p>
                              <p class="item-num" v-if="item.num > 0">{{item.num}}</p>
                          </div>
                      </div>
                    </div>
                </div>
            </div>
        </el-col>
        <!-- 聊天内容 -->
        <el-col :span="12">
            <div class="chat-content" :style="{height:height2}">
                <div class="menu">
                    <p class="item-nickname">{{chatName}}</p>     
                    <!--             
                    <p class="endService" @click="endService">结束服务</p>
                    -->
                    <!--
                    <p class="transfer" @click="dialogVisible = true">转接</p>
                    -->
                </div>
                <div class="chatContent" ref="chatContent" id="chatContent">
                    <div v-for="(list, index) in total" :key="index" id="chatdiv">
                        <div v-if="list.messageType==='RECEIVE'">
                            <div class="user">
                                <img src="../../assets/touxiang.png" alt="" class="head">
                                <span class="send-news">{{list.content}}</span>
                            </div>
                        </div>
                        <div v-else-if="list.messageType==='SEND'">
                             <div class="customerService">    
                                <span class="send-news">{{list.content}}</span>
                                <img src="../../assets/customer.png" alt="" class="head">
                            </div>
                        </div>
                    </div>
                    <!--
                    <div class="customerService">    
                        <img :src="imageUrl" alt="">
                        <img src="../../assets/touxiang.png" alt="" class="head">
                    </div>
                    -->
                </div>
                <!--
                <div class="chatImg">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-success="handleAvatarSuccess">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                -->
                <el-row><textarea  placeholder="请输入内容"  v-model="textarea" cols="" rows="5"></textarea></el-row> 
                <el-button type="primary" class="send" @click="sendMsg" :disabled="sendabled">发送</el-button>
            </div>
        </el-col>
        <!-- 用户信息 -->
        <el-col :span="6">
            <div class="chat-info">
                <el-col class="userinfo">用户信息</el-col>
                <el-row class="userData">
                    <el-col style="font-weight:bold">基本资料</el-col>
                    <el-col><span>账户名：</span><span>{{chatName}}</span></el-col>
                    <el-col><span>用户分组：</span><span>{{userType}}</span></el-col>
                    <el-col><span>账户状态：</span><span>{{status}}</span></el-col>
                    <el-col><span>联系电话：</span><span>{{tel}}</span></el-col>
                    <!--
                    <el-col style="margin-top:30px;font-weight:bold">问题解决状态</el-col>
                    <el-col>
                        <el-select v-model="questionStatus" placeholder="请选择">
                            <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    -->
                </el-row>
            </div>
        </el-col>
    </el-row>
   <!--  转接弹框  -->
    <el-dialog
        title="转接"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span style="margin-left:30px">请选择你要转接的客服同事</span><br>
        <el-select v-model="value" placeholder="请选择" style="margin-top:20px;margin-left:30px">
            <el-option
            v-for="item in serviceList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="transfer">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { webSocket } from '@/utils/webSocket'
import { getMessageimg, pushMessage, findUserInformation, getMessageFromUser, getHistoryMessage } from '@/api/user'
import { Message } from 'element-ui'
import { notify } from '@/utils/index'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      talkNum: 0,
      chatList: [],
      chatName: '',
      dialogVisible: false,
      sendabled: false,
      userType: '',
      status: '',
      tel: '',
      total: [],
      saveUser: '',
      saveUserObject: {},
      serviceList: [{
        value: 'lee',
        label: 'lee'
      }, {
        value: 'only',
        label: 'only'
      }, {
        value: 'panda',
        label: 'panda'
      }, {
        value: 'cici',
        label: 'cici'
      }, {
        value: 'git',
        label: 'git'
      }],
      statusList: [{
        value: '未解决',
        label: '未解决'
      }, {
        value: '已解决',
        label: '已解决'
      }],
      height: '',
      height2: '',
      value: '',
      questionStatus: '',
      textarea: '',
      imageUrl: '',
      savelistdata: []
    }
  },
  computed: {
    ...mapState(['listenList']),
    ...mapGetters(['listenList'])
  },
  watch: {
    height(val) {
      this.height = val
    },
    height2(val) {
      this.height2 = val
    },
    listenList: function(listenList) {
      if (listenList.Msg === this.saveUser) {
        this.getMsg(listenList.Msg)
      } else {
        this.getMessageDetail(listenList.Msg)
      }
      notify('你有新消息', 'chat')
    }
  },
  mounted() {
    const that = this
    that.height = document.body.clientHeight - 90 + 'px'
    that.height2 = document.body.clientHeight - 50 + 'px'
    const param = { username: this.$store.getters.loginParam.accountname, role: 'back', type: 'handshake' }
    webSocket(param)
    this.getMsg()
  },
  methods: {
    /** 接收消息 */
    getMsg(touser) {
      let getnum = 0
      getMessageimg().then(res => {
        this.savelistdata = []
        if (res.data.code === 200) {
          if (res.data.data.msgList.length > 0) {
            const saveList = []
            for (let i = 0; i < res.data.data.msgList.length; i++) {
              if (res.data.data[i].touser === '') {
                getnum = res.data.data.msgList.length - 1
              } else {
                getnum = res.data.data.msgList.length
                saveList.push(Object.assign(res.data.data.msgList[i], { num: 0 }, { flag: false }))
              }
              this.savelistdata.push(res.data.data.msgList[i].userName)
            }
            if (!touser) {
              this.talkNum = getnum
              this.chatList = saveList
            }
            if (touser) {
              this.saveUser = touser
            } else if (this.chatList.length > 0) {
              this.saveUser = this.chatList[0].touser
            } else {
              this.saveUser = "''"
            }
            this.getUserData(this.saveUser)
            this.getHistoryMessageClick(this.saveUser)
            this.getMessageDetail(touser || this.saveUser)
          }
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    /**
     * 获取用户信息
     */
    getUserData(name) {
      findUserInformation({ username: name }).then(res => {
        this.chatName = name
        this.userType = res.data.classes === 'ACCEPTER' ? '承兑人' : (res.data.classes === 'ORDINARY' ? '普通用户' : '商家')
        this.status = res.data.status === 'NORMAL' ? '正常' : '冻结'
        this.tel = res.data.telephone
      })
    },
    /**
     * 获取最新对应聊天内容
     * this.saveUser
     */
    getMessageDetail(touser) {
      getMessageFromUser({ clientRole: 'ordinary', clientName: touser }).then(res => {
        if (touser !== this.saveUser) {
          for (let i = 0; i < this.chatList.length; i++) {
            if (this.chatList[i].touser === touser) {
              const savecount = this.chatList[i].num || 0
              this.chatList.splice(i, 1)
              this.chatList.splice(0, 0, Object.assign(res.data.data.msgList[0], { num: 0 }))
              if (res.data.data.length >= 1) {
                this.chatList[0].num += res.data.data.length + savecount
              } else {
                this.chatList[0].num = res.data.data.length
              }
            }
          }
          if (this.savelistdata.indexOf(touser) < 0) {
            this.savelistdata.splice(0, 0, touser)
            this.talkNum += this.talkNum
            this.chatList.unshift(Object.assign(res.data.data.msgList[0], { num: res.data.data.msgList.length }))
          }
        } else {
          for (let j = 0; j < this.chatList.length; j++) {
            if (this.chatList[j].touser === touser) {
              if (res.data.data[0]) {
                this.chatList.splice(j, 1)
                this.chatList.splice(0, 0, Object.assign(res.data.data.msgList[0], { num: 0 }))
              }
            }
          }
          this.chatList[0].flag = true
        }
      })
    },
    /** 获取历史聊天记录 */
    getHistoryMessageClick(touser) {
      const param = {
        clientName: touser,
        clientRole: 'ordinary',
        recordSize: 30
      }
      getHistoryMessage(param).then(res => {
        if (res.data.code === 200) {
          this.total = res.data.data.msgList.reverse()
          this.scrollToBottom()
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    /** 上传图片 */
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    /** 聊天记录滚动到底部 */
    scrollToBottom() {
      const chatContent = document.getElementById('chatContent')
      setTimeout(() => { chatContent.scrollTop = chatContent.scrollHeight }, 0)
    },
    /** 发送消息 */
    sendMsg() {
      this.sendabled = true
      const param = {
        'msg': {
          content: this.textarea
        },
        'receiver': {
          clientUserId: '',
          clientUserName: this.saveUser,
          roleName: 'ordinary'
        }
      }
      if (this.textarea === '') {
        this.sendabled = false
        Message({
          message: '发送信息不能为空',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        pushMessage(param).then(res => {
          if (res.data.code === 200) {
            const pushsql = {
              content: this.textarea,
              messageType: 'SEND'
            }
            this.total.push(pushsql)
            this.textarea = ''
            this.sendabled = false
            this.scrollToBottom()
          } else {
            this.sendabled = false
            Message({
              message: res.data.message,
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      }
    },
    /** 点击获取聊天信息 */
    startChat(index, item) {
      for (let y = 0; y < item.length; y++) {
        item[y].flag = false
      }
      item[index].flag = true
      this.saveUser = this.chatList[index].touser
      this.getUserData(this.chatList[index].touser)
      this.getHistoryMessageClick(this.chatList[index].touser)
      this.chatList[index].num = 0
      /*
      this.chatName = this.chatList[index].name
      this.chatList[index].num = 0
      */
    },
    endService() { // 结束对话
      console.log('结束对话')
    },
    handleClose(done) {

    },
    transfer() { // 转接
      this.dialogVisible = false
      console.log(this.value)
    }

  }
}
</script>

<style scoped>
.choice{
  background-color: #e4e4e4;
}
.choice .item-nickname, .choice .item-time, .choice .item-news{
  color: #000; 
}
.chat-info{
    font-size:14px;
}
.chatList{
    overflow: scroll;
}
.isTalking{
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #666;
    border-bottom: 1px solid #666;
    padding-left: 30px;
    font-size: 16px;
    color: #666;
}
.chat-content{
    border: 1px solid #999;
    border-bottom: none;
    position: relative;
}
.chat-item{
    width: 100%;
    height: 70px;
    border-bottom: 1px solid #999;
    font-size: 14px;
}
.item-top,.item-bottom{
    overflow: hidden;
    height: 35px;
    line-height: 10px;
}
.item-nickname{
    color: #333;
    float: left;
}
.item-time{
    float: right;
    color: #999;
}
.item-news{
    float: left;
    color:#999;
}
.item-num{
    float: right;
    color: #ffffff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: red;
    text-align: center;
    line-height: 20px;
    position: relative;
    bottom:5px;
}
.menu{
    border-bottom:1px solid #999;
    height: 39px;
    overflow: hidden;
    font-size: 14px;
    padding: 0 30px;
}
.endService,.transfer{
    float: right;
    color: rgb(64, 158, 255);
    margin-right: 20px;
}
.chatContent{
    height: 400px;
    border-bottom: 1px solid #999;
    font-size: 14px;
    padding: 0 15px;
    color: #999;
    overflow-y: scroll;
    padding-bottom: 30px;
}
.head{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.user,.customerService{
    width: 100%;   
    margin-top: 30px;
}
.user{
    text-align: left;
}
.customerService{
    text-align: right;
}
.send-news{
    background: #e4e4e4;
    display: inline-block;
    max-width: 300px;
    height: auto;
    line-height: 20px;
    padding: 10px 10px;
    /* white-space: pre-wrap;
    word-break: normal; */
    text-align: left;
}
.chatImg{
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #999;
}
.send{
    position: absolute;
    bottom: 20px;
    right: 15px;
}
.userinfo{
    padding-left: 20px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    border: 1px solid #999;
    border-left: none;
}
.userData{
    padding-left: 20px;
}
.userData .el-col{
    margin-top: 20px;
}
textarea{
    width: 100%;
    border: none;
    resize: none;  
    min-height: 100px;
}
textarea:focus {
    outline: none;
}
::-webkit-scrollbar {
    display: none;
}
.avatar-uploader{
    width: 45px;
    height: 30px;
    margin: 8px 15px;
    background: url(../../assets/picture.png);
    background-size: 100% 100%;
    overflow: hidden;
}
.el-upload {
    width: 45px;
    height: 30px;
    background: url(../../assets/picture.png);
    background-size: 100% 100%;
}
.el-icon-plus{
    width: 45px;
    height: 30px; 
    background: url(../../assets/picture.png); 
    background-size: 100% 100%; 
}
.el-icon-plus:before {
    display: none;
}
</style>