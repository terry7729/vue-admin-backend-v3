<template>
  <div>
    <!--  工单状态  -->
    <div class="contaner-box">
      <span style="width:120px;text-align:right;display:inline-block;">承兑人在线状态：</span>
      <span class="tags" :class="{selected:listQuery.ifOnline  ==  ''}" @click="changeLabelStatus('ifOnline','')">
        <span>全部</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifOnline  ==  '1'}" @click="changeLabelStatus('ifOnline','1')">
        <span>在线</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifOnline  ==  '0'}" @click="changeLabelStatus('ifOnline','0')">
        <span>离线</span>
      </span>
    </div>
    <!--  优先级  -->
    <div class="contaner-box">
      <span style="width:120px;text-align:right;display:inline-block;">账户开启状态：</span>
      <span class="tags" :class="{selected:listQuery.ifOpen  ==  ''}" @click="changeLabelStatus('ifOpen','')">
        <span>全部</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifOpen  ==  '1'}" @click="changeLabelStatus('ifOpen','1')">
        <span>已关闭</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifOpen  ==  '0'}" @click="changeLabelStatus('ifOpen','0')">
        <span>已开启</span>
      </span>
    </div>
    <!--  卡删除状态  -->
    <div class="contaner-box">
      <span style="width:120px;text-align:right;display:inline-block;">卡状态：</span>
      <span class="tags" :class="{selected:listQuery.delMark  ==  ''}" @click="changeLabelStatus('delMark','')">
        <span>全部</span>
      </span>
      <span class="tags" :class="{selected:listQuery.delMark  ==  '1'}" @click="changeLabelStatus('delMark','1')">
        <span>已删除</span>
      </span>
      <span class="tags" :class="{selected:listQuery.delMark  ==  '0'}" @click="changeLabelStatus('delMark','0')">
        <span>使用中</span>
      </span>
    </div>
    <!--  角色  -->
    <div class="contaner-box">
      <span style="width:120px;text-align:right;display:inline-block;">收款方式：</span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  ''}" @click="changeLabelStatus('userCardType','')">
        <span>全部</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'BANK_CARD'}" @click="changeLabelStatus('userCardType','BANK_CARD')">
        <span>银行卡</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'WECHAT_BANK'}" @click="changeLabelStatus('userCardType','WECHAT_BANK')">
        <span>微信转银行卡</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'ALIPAY_BANK'}" @click="changeLabelStatus('userCardType','ALIPAY_BANK')">
        <span>支付宝转银行卡</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'ALIPAY'}" @click="changeLabelStatus('userCardType','ALIPAY')">
        <span>支付宝(个人)</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'WECHAT'}" @click="changeLabelStatus('userCardType','WECHAT')">
        <span>微信</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'QUICKPASS'}" @click="changeLabelStatus('userCardType','QUICKPASS')">
        <span>云闪付</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'BUSINESS_ALIPAY'}" @click="changeLabelStatus('userCardType','BUSINESS_ALIPAY')">
        <span>支付宝(商户)</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userCardType  ==  'BUSINESS_ALIPAY_BANK'}" @click="changeLabelStatus('userCardType','BUSINESS_ALIPAY_BANK')">
        <span>支付宝转银行卡(商户)</span>
      </span>
    </div>
    <div class="contaner-box" style="margin-top:20px;">
      <span style="margin-right:10px;">
        承兑人：<span>
          <el-input v-model="listQuery.userName" placeholder="请输入承兑人" clearable></el-input>
        </span>
      </span>
      <span style="margin-right:10px;">
        账号姓名：<span>
          <el-input v-model="listQuery.bankAccName" placeholder="请输入账号姓名" clearable></el-input>
        </span>
      </span>
      <span style="margin-right:10px;">
        账号/卡号：<span>
          <el-input v-model="listQuery.cardNo" placeholder="请输入账号/卡号" clearable></el-input>
        </span>
      </span>
      <span>
        <el-button type="primary" @click="searchClick">查询</el-button>
        <!-- <el-button type="primary" @click="handleMatchSettingsOpen({id: 9})" style="margin-left:10px;">test</el-button> -->
      </span>
    </div>
    <!-- 表格 -->
    <div class="tab-container" style="margin-top:20px;">
      <el-table :key='tableKey' :data="list" border fit highlight-current-row>
        <el-table-column align="center" label="账户id">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款方式">
          <template slot-scope="scope">
            <span v-if="scope.row.userCardType==='BANK_CARD'">银行卡</span>
            <span v-if="scope.row.userCardType==='ALIPAY'">支付宝(个人)</span>
            <span v-if="scope.row.userCardType==='WECHAT'">微信</span>
            <span v-if="scope.row.userCardType==='QUICKPASS'">云闪付</span>
            <span v-if="scope.row.userCardType==='BUSINESS_ALIPAY'">支付宝(商户)</span>
            <span v-if="scope.row.userCardType==='BUSINESS_ALIPAY_BANK'">支付宝转银行卡(商户)</span>
            <span v-if="scope.row.userCardType==='WECHAT_BANK'">微信转银行卡</span>
            <span v-if="scope.row.userCardType==='ALIPAY_BANK'">支付宝转银行卡</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户姓名">
          <template slot-scope="scope">
            <span>{{scope.row.bankAccName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开户银行">
          <template slot-scope="scope">
            <span>{{scope.row.bankName || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账号/卡号">
          <template slot-scope="scope">
            <span>{{scope.row.cardNo}}</span>
          </template>
        </el-table-column>
        <!--
        <el-table-column align="center" label="二维码">
          <template slot-scope="scope">
            <span>{{scope.row.cardNo}}</span>
          </template>
        </el-table-column>-->
        <el-table-column align="center" label="账户开启状态">
          <template slot-scope="scope">
            <span v-if="scope.row.ifOpen===1">关闭</span>
            <span v-if="scope.row.ifOpen===0">开启</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="承兑人">
          <template slot-scope="scope">
            <span>{{scope.row.accountName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="承兑人在线状态">
          <template slot-scope="scope">
            <span v-if="scope.row.ifOnline===1">在线</span>
            <span v-if="scope.row.ifOnline===0">离线</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="doneAmtRmb" label="今日收款">
          <template slot-scope="scope">
            <span>{{Number(scope.row.doneAmtRmb/10000).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="totalDoneAmtRmb" label="累计收款">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalDoneAmtRmb/10000).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="卡状态">
          <template slot-scope="scope">
            <span v-if="scope.row.delMark == 1">已删除</span>
            <span v-else-if="scope.row.delMark == 0">使用中</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px;" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleMatchSettingsOpen(scope.row,scope)" style="width: 70px;">匹配设置</el-button>
            <el-button v-if="scope.row.ifOpen===1" type="text" @click="changeStatus(scope.row,'打开')">打开</el-button>
            <el-button v-if="scope.row.ifOpen===0" type="text" @click="changeStatus(scope.row,'关闭')">关闭</el-button>
          </template>
        </el-table-column>
        <!--
        <el-table-column align="center" label="日总流水（gac）">
          <template slot-scope="scope">
            <span>{{scope.row.doneAmtRmb}}</span>
          </template>
        </el-table-column>
        -->

        <!-- <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.ifOpen===1" type="text" @click="changeStatus(scope.row,'打开')">打开</el-button>
            <el-button v-if="scope.row.ifOpen===0" type="text" @click="changeStatus(scope.row,'关闭')">关闭</el-button>
          </template>
        </el-table-column> -->

      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--匹配设置-->

    <div id="pipei">
      <el-dialog class="dialog-match-settings" title="匹配设置" :visible.sync="matchSettingsDialog">
        <el-form :model='matchSettings.formData' :rules='matchSettings.rules' ref='matchSettingsFormDataRef' :inline="true" label-position="left">
          <el-form-item label='账号ID：' style="margin-bottom: 5px;">
            {{matchSettings.formData.id || '-'}}
          </el-form-item>
          <el-form-item label='收款方式：' style="margin-left:50px;margin-bottom: 5px;">
            <span v-if="matchSettings.formData.userCardType==='BANK_CARD'">银行卡</span>
            <span v-if="matchSettings.formData.userCardType==='ALIPAY'">支付宝(个人)</span>
            <span v-if="matchSettings.formData.userCardType==='WECHAT'">微信</span>
            <span v-if="matchSettings.formData.userCardType==='QUICKPASS'">云闪付</span>
            <span v-if="matchSettings.formData.userCardType==='BUSINESS_ALIPAY'">支付宝(商户)</span>
            <span v-if="matchSettings.formData.userCardType==='BUSINESS_ALIPAY_BANK'">支付宝转银行卡(商户)</span>
            <span v-if="matchSettings.formData.userCardType==='ALIPAY_BANK'">支付宝转银行卡</span>
            <span v-if="matchSettings.formData.userCardType==='WECHAT_BANK'">微信转银行卡</span>
          </el-form-item>
          <el-form-item label='姓名/户名：' style="margin-left:50px;margin-bottom: 5px;">
            {{matchSettings.formData.bankAccName || '-'}}
          </el-form-item>
          <div style="display:block; margin-top:10px;">
            <el-form-item label='开户银行：'>
              {{matchSettings.formData.bankName || '-'}}
            </el-form-item>
            <el-form-item label='账号/卡号：' style="margin-left:50px;margin-bottom: 5px;">
              {{matchSettings.formData.cardNo || '-'}}
            </el-form-item>
          </div>
          <el-form-item label='' prop='busiTypeList' style="display:block;margin-bottom: 0px;margin-top: -10px;">
            <el-checkbox  v-if="matchSettings.formData.userCardType==='ALIPAY_BANK'"  v-model="matchSettings.formData.ifDelayOfAlipayBank " :true-label='1' :false-label='0'>支付宝转银行卡有延时</el-checkbox>
            <el-checkbox  v-if="matchSettings.formData.userCardType==='WECHAT_BANK'" v-model="matchSettings.formData.ifDelayOfWechatBank " :true-label='1' :false-label='0'>微信转银行卡有延时</el-checkbox>
            <el-checkbox  v-if="matchSettings.formData.userCardType==='BANK_CARD'" v-model="matchSettings.formData.ifEasyReportLoss" :true-label='1' :false-label='0'>易被挂失</el-checkbox>
          </el-form-item>
          <el-form-item label='单笔收款限额：' prop='signalMaxAmtRmb' style="margin-top:20px;">
            <el-input-number v-model='matchSettings.formData.signalMaxAmtRmb' size="mini" :min="1" :precision="0" :step="1" placeholder="请输入1～100万的整数金额"></el-input-number>
          </el-form-item>
          <el-form-item label='每日收款限额：' prop='dayMaxAmtRmb' style="margin-top:0px; display:block">
            <el-input-number v-model='matchSettings.formData.dayMaxAmtRmb' size="mini" :min="1" :precision="0" :step="1" placeholder="请输入1～100万的整数金额"></el-input-number>
          </el-form-item>
          <!--
          <div v-if="matchSettings.formData.userCardType==='BANK_CARD'">
            <el-form-item label='每日支付宝转银行卡限额：' prop='dayMaxAmtRmbOfAlipayBank' style="margin-top:0px;">
              <el-input-number v-model='matchSettings.formData.dayMaxAmtRmbOfAlipayBank' size="mini" :min="0" :precision="0" :step="1" placeholder="请输入金额(0～50000的整数)"></el-input-number>
            </el-form-item>
            <el-form-item label='每日微信转银行卡限额：' prop='dayMaxAmtRmbOfWechatAlipayBank' style="margin-top:0px;">
              <el-input-number v-model='matchSettings.formData.dayMaxAmtRmbOfWechatAlipayBank' size="mini" :min="0" :precision="0" :step="1" placeholder="请输入金额(0～50000的整数)"></el-input-number>
            </el-form-item>
          </div>
          -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancelClick('matchSettingsFormDataRef')">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleUpadteMatchSettings">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { qryPayCardInfo, qryPayCardMatchInfo, updateCardOpenStatus, updatePayCardMatchInfo } from '@/api/acceptor'
import { Message } from 'element-ui'
export default {
  name: 'tab',
  data() {
    const validateAmount = (rule, value, callback) => {

      const totalBzzGacMax = this.totalBzzGacMax
      const signalMaxAmtRmb = this.matchSettings.formData.signalMaxAmtRmb
      const dayMaxAmtRmb = this.matchSettings.formData.dayMaxAmtRmb
      const dayMaxAmtRmbOfAlipayBank = this.matchSettings.formData.dayMaxAmtRmbOfAlipayBank
      const dayMaxAmtRmbOfWechatAlipayBank = this.matchSettings.formData.dayMaxAmtRmbOfWechatAlipayBank
      switch (rule.field) {
        //  单笔收款限额：
        case 'signalMaxAmtRmb':
          if(value>20000){
            callback(new Error('请输入0～20000的整数金额'))
            return;
          }
          if (!value || value > totalBzzGacMax) {
            callback(new Error('请输入1～' + (totalBzzGacMax / 10000) + '万的整数金额'))
            return
          }
          if (value && value > dayMaxAmtRmb) {
            callback(new Error('不能大于每日收款限额'))
            return
          }
          // this.$refs['matchSettingsFormDataRef'].validateField('buySimpleMaxRmb')
          break;
        //  每日收款限额：
        case 'dayMaxAmtRmb':
          if(value>20000){
            callback(new Error('请输入0～20000的整数金额'))
          }
          if (!value || value > totalBzzGacMax) {
            callback(new Error('请输入1～' + (totalBzzGacMax / 10000) + '万的整数金额'))
            return
          }
          if (value && value < signalMaxAmtRmb) {
            callback(new Error('不能小于单笔收款限额'))
            return
          }
          // this.$refs['matchSettingsFormDataRef'].validateField('buySimpleMinRmb')
          break;
        //  每日支付宝转银行卡限额：
        case 'dayMaxAmtRmbOfAlipayBank':
          if (value <= 0 || value > 50000) {
            callback(new Error('请输入0～50000的整数金额'))
            return
          }
          // if (value && value > signalMaxAmtRmb) {
          //   callback(new Error('不能大于单笔收款限额'))
          //   return
          // }
          // if (dayMaxAmtRmbOfAlipayBank && dayMaxAmtRmbOfWechatAlipayBank
          // && (dayMaxAmtRmbOfAlipayBank + dayMaxAmtRmbOfWechatAlipayBank) >= dayMaxAmtRmb) {
          //   callback(new Error('支付宝和微信转银行卡总和必须小于每日收款'))
          //   return
          // }
          // this.$refs['matchSettingsFormDataRef'].validateField('sellSimpleMaxRmb')
          break;
        //  每日微信转银行卡限额：
        case 'dayMaxAmtRmbOfWechatAlipayBank':
          if (value <= 0 || value > 50000) {
            callback(new Error('请输入0～50000的整数金额'))
            return
          }
          // if (value && value > signalMaxAmtRmb) {
          //   callback(new Error('不能大于单笔收款限额'))
          //   return
          // }
          // if (dayMaxAmtRmbOfAlipayBank && dayMaxAmtRmbOfWechatAlipayBank
          // && (dayMaxAmtRmbOfAlipayBank + dayMaxAmtRmbOfWechatAlipayBank) >= dayMaxAmtRmb) {
          //   callback(new Error('支付宝和微信转银行卡总和必须小于每日收款'))
          //   return
          // }
          break;
        default:
          return
          console.error('getMoneyAccountManager validateAmount switch undefind')
      }
      callback()
    }
    return {
      totalBzzGacMax: 1000000, //  保证金最大为100万GAC，所有输入不得超出
      // 查询条件
      listQuery: {
        ifOnline: '',
        ifOpen: '',
        userCardType: '',
        userName: '',
        bankAccName: '',
        cardNo: '',
        delMark: '',
        page: 1,
        limit: 10
      },
      matchSettingsVisible: false,
      matchSettingsDialog: false,
      /**
       * 匹配设置
       */
      matchSettings: {
        vsiible: false,
        formData: {
          // signalMaxAmtRmb: null,
          // dayMaxAmtRmb: null,
          // dayMaxAmtRmbOfAlipayBank: 20000,
          // dayMaxAmtRmbOfWechatAlipayBank: 20000,
        },
        rules: {
          signalMaxAmtRmb: [
            { required: true, message: '请输入1～100万的整数金额', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          dayMaxAmtRmb: [
            { required: true, message: '请输入1～100万的整数金额', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          dayMaxAmtRmbOfAlipayBank: [
            { required: true, message: '请输入0～50000的整数金额', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          dayMaxAmtRmbOfWechatAlipayBank: [
            { required: true, message: '请输入0～50000的整数金额', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ]
        }
      },
      tableKey: 0,
      list: null,
      total: null,
      btnLoading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询数据显示列表 */
    getList() {
      const params = {
        ifOnline: this.listQuery.ifOnline,
        delMark: this.listQuery.delMark,
        ifOpen: this.listQuery.ifOpen,
        userCardType: this.listQuery.userCardType,
        userName: this.listQuery.userName,
        bankAccName: this.listQuery.bankAccName,
        cardNo: this.listQuery.cardNo,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      qryPayCardInfo(params).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
      })
    },
    /** 选择查询条件 */
    changeLabelStatus(label, status) {
      this.listQuery[label] = status
      this.listQuery.page = 1;
      this.getList()
    },
    /** 查询 */
    searchClick() {
      this.listQuery.page = 1
      this.getList()
    },
    changeStatus(row, text) {
      console.log(row);
      this.$confirm("是否" + text + "账户开启状态？", '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确认');
        let ifOpen = "";
        if (row.ifOpen == "1") {
          ifOpen = "0"
        }
        if (row.ifOpen == "0") {
          ifOpen = "1"
        }
        updateCardOpenStatus({ payCardId: row.id, status: ifOpen }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功！"
            })
            this.getList()
          } else {
            this.$message({
              type: "success",
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        console.log('取消');
      })
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    },
    /**
         * 分页
         */
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    /**
     * 打开匹配设置
     */
    handleMatchSettingsOpen(row, scope) {
      qryPayCardMatchInfo({ id: row.id }).then(res => {
        if (!res || !res.data) {
          Message({
            message: '服务异常，请联系运维',
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
        if (res.data.code !== 200) {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
        this.matchSettings.formData = res.data.data
        this.matchSettings.formData.signalMaxAmtRmb = this.matchSettings.formData.signalMaxAmtRmb || 0
        this.matchSettings.formData.dayMaxAmtRmb = this.matchSettings.formData.dayMaxAmtRmb || 0
        this.matchSettings.formData.dayMaxAmtRmbOfAlipayBank = (this.matchSettings.formData.dayMaxAmtRmbOfAlipayBank || 0) / 10000
        this.matchSettings.formData.dayMaxAmtRmbOfWechatAlipayBank = (this.matchSettings.formData.dayMaxAmtRmbOfWechatAlipayBank || 0) / 10000
        this.matchSettingsDialog = true
      })
    },
    handleUpadteMatchSettings() {
      this.$refs['matchSettingsFormDataRef'].validate((valid) => {
        if (!valid) {
          Message({
            message: "请录入正确的表单",
            type: 'error',
            duration: 3 * 1000
          })
          return false
        }
        if (this.btnLoading) return;
        this.btnLoading = true;
        updatePayCardMatchInfo(this.matchSettings.formData).then(res => {
          this.btnLoading = false;
          if (!res || !res.data) {
            Message({
              message: '服务异常，请联系运维',
              type: 'error',
              duration: 5 * 1000
            })
            return
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 5 * 1000
            })
            return
          }
          this.matchSettingsDialog = false
          Message({
            message: "修改成功",
            type: 'success',
            duration: 2 * 1000
          })
        }).catch(() => {
          this.btnLoading = false;
        })
      })
    },
    /**取消匹配弹框 */
    handleCancelClick(formName) {
      this.$refs[formName].resetFields()
      this.matchSettingsDialog = false
    },
  }
}
</script>
<style lang='scss' scoped>
/* 页面整体样式 */
.contaner-box {
  margin: 10px 30px 0 30px;
  font-size: 15px;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
.contaner-box .el-input {
  width: auto;
}

/* 工单状态的样式 */
.tags {
  margin-right: 10px;
  font-size: 14px;
  height: 30px;
  min-width: 50px;
  text-align: center;
  padding: 0px 5px;
  line-height: 30px;
  display: inline-block;
  cursor: pointer;
}
.tags.selected {
  background: #409eff;
  color: #fff;
  border-radius: 4px;
}

/* 新建工单弹出框样式 */
.order_modal .order_list {
  display: flex;
  padding: 10px 20px;
}
.order_modal .order_list .list_title {
  width: 100px;
  text-align: right;
  padding-top: 10px;
}
.order_modal .order_list .list_content {
  flex: 1;
  padding-left: 10px;
  text-align: left;
}
.order_modal .order_list .list_content .text_error {
  font-size: 12px;
  color: #f95353;
  padding-top: 5px;
}
/* 上传图片接口 */
.upload_container .image_list {
  height: 140px;
  width: 140px;
  display: inline-block;
  border-radius: 4px;
  position: relative;
  margin-right: 15px;
  margin-bottom: 15px;
}
.upload_container .image_list img {
  height: 140px;
  width: 140px;
}
.upload_container .image_list .img_close {
  font-size: 22px;
  color: #999;
  position: absolute;
  top: -12px;
  right: -12px;
  transition: all 0.2s;
  cursor: pointer;
}
.upload_container .image_list .img_close:hover {
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
  width: 140px;
  height: 140px;
  line-height: 140px;
  text-align: center;
}
// 匹配设置表单
form {
  .el-form-item {
    .el-input-number--medium {
      width: 160px;
    }
  }
}
.number-item {
  > .el-form-item:nth-last-of-type(1) {
    width: 170px;
    .el-input-number--medium {
      width: 130px;
    }
    > label {
    }
  }
}
// 匹配设置弹窗
.dialog-match-settings {
  // 匹配设置表单
  // 匹配设置表单
  form {
    .el-form-item {
      .el-input-number--mini {
        width: 190px;
        .el-input {
          // width: 190px;
        }
      }
    }
    .number-item {
      > .el-form-item:nth-last-of-type(1) {
        width: 170px;
        .el-input-number--mini {
          width: 190px;
        }
      }
      span {
        display: inline-block;
        margin-right: 10px;
        vertical-align: top;
        line-height: 36px;
      }
    }
  }
}
</style>