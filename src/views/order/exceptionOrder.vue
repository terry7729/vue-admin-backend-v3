<template>
  <div>
    <div class="layout_header">
      <div class="nav" style="font-size:20px;padding:20px 30px 10px;position:relative;">
        异常报备
        <span style="font-size:13px;position:absolute;right:30px;bottom:-40px;">
          <el-button type="text" @click="toOrder()">前往订单查询</el-button>
        </span>
      </div>
    </div>
    <div class="layout_container">
      <!-- 查询条件 -->
      <div class="container_box">
        <div style="margin-top:5px;">
          <span class="box-spacing">
            <span style="width:100px;display:inline-block;text-align:left;">客服处理状态：</span>
            <span>
              <span class="tags" :class="{selected:listQuery.handlerStatus==''}" @click="changeStatus('handlerStatus','')">全部</span>
              <span class="tags" :class="{selected:listQuery.handlerStatus=='0'}" @click="changeStatus('handlerStatus','0')">未处理</span>
              <span class="tags" :class="{selected:listQuery.handlerStatus=='2'}" @click="changeStatus('handlerStatus','2')">已处理</span>
            </span>
          </span>
        </div>
        <div style="margin-top:15px;">
          <span class="box-spacing">
            <span style="text-align:left;">支付方式：</span>
            <span>
              <el-select v-model="listQuery.payType" placeholder="全部" clearable style="width:160px">
                <el-option value="" label="全部"></el-option>
                <el-option value="BANK_CARD" label="银行卡"></el-option>
                <el-option value="ALIPAY" label="支付宝"></el-option>
                <el-option value="WECHAT" label="微信"></el-option>
              </el-select>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;">创建时间：</span>
            <span>
              <el-date-picker style="width:160px" v-model="listQuery.creatTimeFrom" clearable value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期"></el-date-picker>
              至 <el-date-picker v-model="listQuery.creatTimeTo" clearable value-format="yyyy-MM-dd HH:mm:ss" style="width:160px" placeholder="结束日期"></el-date-picker>
            </span>
          </span>
        </div>
        <div style="margin-top:15px;">
          <span class="box-spacing">
            <span style="text-align:left;margin-left:15px;">到账时间：</span>
            <span>
              <el-date-picker v-model="listQuery.receivingTimeFrom" clearable style="width:160px" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期"></el-date-picker>
              至 <el-date-picker v-model="listQuery.receivingTimeTo" clearable style="width:160px" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期"></el-date-picker>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;margin-left:15px;">金额：</span>
            <span>
              <el-input placeholder="最小金额" v-model="listQuery.minAmount" clearable style="width:100px;"></el-input>
              至 <el-input placeholder="最大金额" v-model="listQuery.maxAmount" clearable style="width:100px;"></el-input>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;margin-left:15px;">承兑人：</span>
            <span>
              <el-input placeholder="请输入承兑人" v-model="listQuery.accountName" clearable style="width:160px"></el-input>
            </span>
          </span>
        </div>
        <div style="margin-top:15px;">
          <span class="box-spacing">
            <span style="text-align:left;">异常单号：</span>
            <span>
              <el-input placeholder="请输入异常订单号" v-model="listQuery.abnormalBillNo" clearable style="width:160px"></el-input>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;">原订单号：</span>
            <span>
              <el-input placeholder="请输入异常订单号" v-model="listQuery.tradeId" clearable style="width:160px"></el-input>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;">补单号：</span>
            <span>
              <el-input placeholder="请输入异常订单号" v-model="listQuery.repairNo" clearable style="width:160px"></el-input>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;margin-left:15px;">收款账户：</span>
            <span>
              <el-input placeholder="请输入收款账户" v-model="listQuery.receivingName" style="width:160px"></el-input>
            </span>
          </span>
          <span class="box-spacing">
            <span style="text-align:left;margin-left:15px;">账户姓名：</span>
            <span>
              <el-input placeholder="请输入账户姓名" v-model="listQuery.receivingFullName" clearable style="width:160px"></el-input>
            </span>
          </span>
        </div>
        <!-- 操作按钮 -->
        <div style="float:right">
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="primary" @click="resetData">重置</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div style="margin-top:60px; overflow:hidden; position:relative">
        <el-table :data="list" border fit highlight-current-row>
          <el-table-column label="异常单号" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                {{scope.row.abnormalBillNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                {{scope.row.createTime}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="承兑人" align="center">
            <template slot-scope="scope">
              {{scope.row.userName}}
            </template>
          </el-table-column>
          <el-table-column label="支付方式" align="center">
            <template slot-scope="scope">
              <div style="text-align:center" v-if="scope.row.payType==='BANK_CARD'">
                银行卡
              </div>
              <div style="text-align:center" v-if="scope.row.payType==='WECHAT'">
                微信
              </div>
              <div style="text-align:center" v-if="scope.row.payType==='ALIPAY'">
                支付宝
              </div>
            </template>
          </el-table-column>
          <el-table-column label="收款账户" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                <div v-if="scope.row.bankName">
                  <div>{{scope.row.bankName}}</div>
                  <div>{{scope.row.bankSubName}}</div>
                </div>
                <div>{{scope.row.receivingName || "-"}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="账户姓名" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                {{scope.row.receivingFullName ||"-"}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="金额（元）" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                {{Number(scope.row.amount/10000)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="到账时间" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                {{scope.row.receivingTime}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="承兑人处理状态" align="center">
            <template slot-scope="scope">
              <div style="text-align:center" v-if="scope.row.billStatus==0">
                未处理
              </div>
              <div style="text-align:center" v-if="scope.row.billStatus==1">
                已处理
              </div>
            </template>
          </el-table-column>
          <el-table-column label="承兑备注" align="center">
            <template slot-scope="scope">
              <span @click="showPayImageModal(scope.row.imgUrlList,scope.row.remark)">
                <div v-if="scope.row.imgUrlList&&scope.row.imgUrlList.length>0">
                  <i class="el-icon-picture" style="font-size: 30px;color: #409EFF;cursor:pointer;"></i>
                </div>
                <div v-if="scope.row.remark">
                  {{scope.row.remark}}
                </div>
              </span>

            </template>
          </el-table-column>
          <el-table-column label="原订单号" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                <span v-if="scope.row.tradeId">{{scope.row.repairOriginTradeId?'补单-':''}}{{scope.row.tradeId}}</span>
                <span>-</span>
                <span v-if="scope.row.tradeId">
                  <span v-if="scope.row.tradeStatus==2">待付款</span>
                  <span v-else-if="scope.row.tradeStatus==201||scope.row.tradeStatus==0">{{handleStatus('处理失败-',scope.row.str_order_status)}}</span>
                  <span v-else-if="scope.row.tradeStatus==3">已付款</span>
                  <span v-else-if="scope.row.tradeStatus==202">已取消</span>
                  <span v-else-if="scope.row.tradeStatus==4">已完成</span>
                  <span v-else-if="scope.row.tradeStatus==204">超时取消</span>
                  <span v-else-if="scope.row.tradeStatus==300">{{handleStatus('处理中-',scope.row.str_order_status)}}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="补单号" align="center">
            <template slot-scope="scope">
              <div style="text-align:center">
                <span v-if="scope.row.repairNo">补单-{{scope.row.repairNo}}</span>
                <span>-</span>
                <span v-if="scope.row.repairNo">
                  <span v-if="scope.row.repairBillStatus==2">待付款</span>
                  <span v-else-if="scope.row.tradeStatus==201||scope.row.repairBillStatus==0">{{handleStatus('处理失败-',scope.row.str_order_status)}}</span>
                  <span v-else-if="scope.row.repairBillStatus==3">已付款</span>
                  <span v-else-if="scope.row.repairBillStatus==202">已取消</span>
                  <span v-else-if="scope.row.repairBillStatus==4">已完成</span>
                  <span v-else-if="scope.row.repairBillStatus==204">超时取消</span>
                  <span v-else-if="scope.row.repairBillStatus==300">{{handleStatus('处理中-',scope.row.str_order_status)}}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="客服处理状态" align="center">
            <template slot-scope="scope">
              <div style="text-align:center" v-if="scope.row.handlerStatus==0">
                未处理
              </div>
              <div style="text-align:center" v-else-if="scope.row.handlerStatus==1">
                处理中
                <div style="text-align:center">
                  {{scope.row.handlerName}}+{{scope.row.handleTime}}
                </div>
              </div>
              <div style="text-align:center" v-else-if="scope.row.handlerStatus==2">
                已处理
                <div style="text-align:center">
                  {{scope.row.handlerName}}+{{scope.row.handleTime}}
                </div>
              </div>
              <div style="text-align:center" v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="createRepairBill(scope.row)" type="text">补单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="container_box" style="padding-bottom:15px;margin-top:10px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>

      <!--补单操作-->
      <el-dialog title="新建补单" :visible.sync="repairOrder.visible" class="form-repair-order" width="640px" append-to-body>
        <el-form :model='repairOrder.formData' :rules='repairOrder.rules' ref='repairOrderFormRef' label-suffix="：" label-width='100px'>
          <el-form-item label='承兑人' prop='accepter'>
            {{repairOrder.formData.accepter}}
          </el-form-item>
          <el-form-item label='付款账号' prop='payCardId'>
            {{repairOrder.formData.payCardUq}}
          </el-form-item>
          <el-form-item label='异常单号'>
            {{repairOrder.formData.abnormalBillNo}}
          </el-form-item>
          <el-form-item label='交易金额' prop='amount'>
            {{repairOrder.formData.amount}}元
          </el-form-item>
          <el-form-item label='发起人' prop='sponsor'>
            <el-select v-model="repairOrder.formData.sponsor" filterable placeholder="请输入发起人搜索后选择" style="width:360px;" @change="queryRelationOrder">
              <el-option v-for="item in repairOrder.remoteList.sponsorList" :key="item.id" :label="item.accountName" :value="item.accountName">
                {{item.accountName+'（' + item.merchantName+'）'}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='会员名' prop='fastSubName'>
            <el-input v-model='repairOrder.formData.fastSubName' maxlength="20" placeholder="请输入会员名" style="width:360px;" @input="queryRelationOrder(repairOrder.formData.fastSubName)"></el-input>
          </el-form-item>
          <el-form-item label='关联订单' prop='tradeId'>
            <el-select v-model="repairOrder.formData.tradeId" filterable remote :remote-method="queryRelationOrder" placeholder="搜索/选择订单号/会员名" style="width:360px;">
              <el-option value="0" label="无原订单"></el-option>
              <el-option v-for="(item,index) in relationOrderList" :value="item.tradeApplyUq" :lavel="item.tradeApplyUq">
                <span>
                  {{item.originTradeUq?'补单-':''}}{{item.tradeApplyUq}}&nbsp;&nbsp;&nbsp;&nbsp;
                  <span v-if="item.tradeStatus==2">待付款</span>
                  <span v-else-if="item.tradeStatus==201||item.tradeStatus==0">{{handleStatus('处理失败-',item.str_order_status)}}</span>
                  <span v-else-if="item.tradeStatus==3">已付款</span>
                  <span v-else-if="item.tradeStatus==202">已取消</span>
                  <span v-else-if="item.tradeStatus==4">已完成</span>
                  <span v-else-if="item.tradeStatus==204">超时取消</span>
                  <span v-else-if="item.tradeStatus==300">{{handleStatus('处理中-',item.str_order_status)}}</span>
                  会员名：{{item.fastSubName}}&nbsp;&nbsp;&nbsp;&nbsp; 金额：{{convertMoney(item.userGac)}}元
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单时间" prop="applyTime">
            <el-date-picker type="datetime" v-model="repairOrder.formData.applyTime" style="width:360px;" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择订单时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="补单原因">
            <el-select placeholder="请选择补单原因" v-model="repairOrder.formData.repairReason1" @change="selectrepairReason">
              <el-option value="会员已转账，但承兑人没放行" label="会员已转账，但承兑人没放行"></el-option>
              <el-option value="会员没下单，直接转账" label="会员没下单，直接转账"></el-option>
              <el-option value="会员转账金额与订单不符" label="会员转账金额与订单不符"></el-option>
              <el-option value="代会员出款" label="代会员出款"></el-option>
              <el-option value="承兑人收款卡超出限额" label="承兑人收款卡超出限额"></el-option>
              <el-option value="延时赔偿" label="延时赔偿"></el-option>
              <el-option value="其它类型" label="其它类型"></el-option>
            </el-select>
            <el-input type="textarea" rows="4" v-model="repairOrder.formData.repairReason" placeholder="请输入补单原因" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="repairOrder.visible=false">取 消</el-button>
          <el-button type="primary" :disabled="repairOrder.budanBtnDisabled" @click="sumbitRepairOrder">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 查看备注 -->
      <el-dialog title="查看备注" :visible.sync="isShowPayImagesModal" width="width:600px;">
        <div>
          <div style="margin:10px 0px;padding:10px 0px;">
            备注：{{payedRemark||"-"}}
          </div>
          <div v-if="payedImageUrl&&payedImageUrl.length>0">
            <div>
              截图： <img v-for="(item,index) in payedImageUrl" @click="openLookBigImgModal(item)" style="max-width:100px;margin:5px;cursor:pointer;" :src="item" />
            </div>
          </div>

        </div>
        <div slot="footer" style="text-align:center;">
          <el-button type="primary" @click="isShowPayImagesModal=false;payedImageUrl=[];payedRemark='';">关闭</el-button>
        </div>
      </el-dialog>

      <!-- 查看大图 -->
      <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="1080px" append-to-body>
        <div style="text-align:center;">
          <img :src="lookBigImgUrl" style="max-width:100%;" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { qryAbnormalBill, updateHandlerStatus, qryIMFastPayTrade, updateAbnormalBill, updateRepairTrade } from '@/api/exceptionOrder.js'
import { qryIMFastPayRepairTrade } from '@/api/immsg.js'
import { getMerchantList, getAccepterList, getPayCardInfo } from '@/api/accountManage'
import { Message } from 'element-ui'
export default {
  data() {
    const validateNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入'))
      }
      value = Number(value)
      if (typeof value === 'number' && !isNaN(value)) {
        if (value < 9 || value > 100000000) {
          callback(new Error('请输入9至10亿的交易金额'))
        } else {
          callback()
        }
      } else {
        callback(new Error('必须为数字'))
      }
    }
    return {
      list: null,
      total: 0,
      detailRemarkMdoal: false,
      relativeImgUrlList: [],
      isShowPayImagesModal: false,
      payedImageUrl: [],
      payedRemark: "",
      saveRemark: null,
      selectStatus: '',
      saveScope: null,
      closeUpdateOrder: false,
      closeOrderSelect: '',
      listQuery: {
        handlerStatus: '', //客服处理状态
        payType: '',  //支付方式
        creatTimeFrom: '',  //创建开始时间
        creatTimeTo: '',   //创建结束时间
        receivingTimeFrom: '',   //到账开始时间
        receivingTimeTo: '',     //到账结束时间
        minAmount: '',  //最小金额
        maxAmount: '',    //最大金额
        abnormalBillNo: '',  //异常单号
        tradeId: '',   //原订单号
        repairNo: '',   //补单号
        receivingName: '',   //收款账户 
        accountName: '',     //账户姓名
        pageNo: 1,
        pageSize: 10
      },

      rowObj: {}, // 当前点击行的数据
      //  补单
      repairOrder: {
        visible: false,
        formData: {
          amount: null,
          applyTime: '',
          sponsor: '',
          accepter: '',
          payCardId: '',
          payCardUq: '',
          fastSubName: '',
          tradeId: '',// 关联的订单
          accepter: '',
          tradeApplyUq: '',
          repairReason: '',
          repairReason1: '',
          abnormalBillNo: '',
          searchKey: '',
        },
        //  时间选择器配置
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 //  new Date().getTime()
          }
        },
        loading: {
          sponsor: false,
          accepter: false,
          payCardId: false,
          repairOrder: false,
        },
        budanBtnDisabled: false,
        remoteList: {
          sponsorList: [],
          accepterList: [],
          payCardInfoList: [],
        },
        rules: {
          "sponsor": [
            { required: true, message: '请输入发起人并选择', trigger: ['blur', 'change'] }
          ],
          "accepter": [
            { required: true, message: '请输入承兑人并选择', trigger: ['blur', 'change'] }
          ],
          "payCardId": [
            { required: true, message: '请选择付款账号', trigger: ['blur', 'change'] }
          ],
          "fastSubName": [
            { required: true, message: '请输入会员名', trigger: ['blur', 'change'] }
          ],
          "applyTime": [
            { required: true, message: '请选择关联订单时间', trigger: ['blur', 'change'] }
          ],
          "amount": [
            { required: true, message: '请输入交易金额', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          "tradeId": [
            { required: true, message: '请选择关联订单', trigger: ['blur', 'change'] },
          ]
        }
      },
      saveRepairOrder: null,

      // 新建订单弹出框
      editOrderModal: false,
      editOrderObj: {
      },
      ruleOrderObj: {
      },
      // 修改备注
      editRemarkMdoal: false,
      // 查看备注
      detailRemarkModal: false,
      // 修改状态
      editStatusModal: false,
      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: '',

      // 关联订单号操作
      relationOrderList: [],
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.renderExceptionParams();
    this.getList()
    console.log(this.$route.params);
  },
  methods: {
    ...mapActions(['changeIsShowExceptionOrder']),
    /**
     * 带条件跳转到订单页面
     */
    renderExceptionParams() {
      let params = sessionStorage.getItem("exceptionOrderParams");
      if (params) {
        params = JSON.parse(params);
        this.listQuery.accountName = params.acceptorname;
        this.listQuery.receivingTimeFrom = params.startdate;
        this.listQuery.receivingTimeTo = params.enddate;
        this.listQuery.minAmount = params.minamount;
        this.listQuery.maxAmount = params.maxamount;
      }
    },
    toOrder() {
      this.$router.push({
        path: "/order/order-manage/:orderId"
      })
      let params = {
        acceptorname: this.listQuery.accountName,
        startdate: this.listQuery.receivingTimeFrom,
        enddate: this.listQuery.receivingTimeTo,
        minamount: this.listQuery.minAmount,
        maxamount: this.listQuery.maxAmount,
      };
      sessionStorage.setItem("exceptionOrderParams", JSON.stringify(params))
    },
    /**
     * 标记
     */
    showStatusRemarkModal(row, scope) {
      this.editStatusModal = true
      this.rowObj = row;
      this.selectStatus = row.handlerStatus + "";
    },
    updateStatusSure() {
      updateHandlerStatus({ abnormalBillNo: this.rowObj.abnormalBillNo, handlerStatus: this.selectStatus }).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            })
            this.editStatusModal = false
            this.getList();
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
      })
    },

    /**
     * 展示上传支付凭证的图片
     */
    showPayImageModal(imgs, remark) {
      this.isShowPayImagesModal = true;
      this.payedImageUrl = imgs;
      this.payedRemark = remark;
    },
    // 承兑人付款账号列表
    reqPayCardInfoList() {
      this.repairOrder.remoteList.payCardInfoList = []
      if (!this.repairOrder.formData.accepter) {
        return
      }
      console.log(this.repairOrder.formData.accepter)
      this.repairOrder.loading.payCardInfo = true
      getPayCardInfo({ accepterName: this.repairOrder.formData.accepter, pageNo: 1, pageSize: 1000 }).then(res => {
        this.repairOrder.loading.payCardInfo = false
        if (!res || !res.data) {
          Message({
            message: '网络异常，请联系运维',
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
        this.repairOrder.remoteList.payCardInfoList = res.data.data || []
        //  获取卡号其他信息
        if (this.repairOrder.formData.payCardId) {
          this.payCardInfoChange(this.repairOrder.formData.payCardId)
        }
      }).catch(res => {
        this.repairOrder.loading.payCardInfo = false
      })
    },
    /**
     * 设置付款账号值
     * 不做一次赋值就无法立即显示出刚选的数据
     */
    payCardInfoChange(payCardId) {
      let payCard = this.getPayCard(payCardId) || {}
      this.repairOrder.formData.payCardId = payCard.id || null
      this.repairOrder.formData.payCardUq = payCard.cardNo || null
      this.repairOrder.formData.cardType = payCard.userCardType || null
      // 用这种强制触发视图更新
      this.repairOrder.formData = JSON.parse(JSON.stringify(this.repairOrder.formData))
      // this.$forceUpdate()
    },
    /**
 * 订单处理的状态
 */
    handleStatus(prestr, status) {
      console.log(prestr, status);
      if (status == "ORDER_WAIT_USER_ACK_ORDER") {
        return prestr + '等待用户确认单号';
      }
      else if (status == "ORDER_REQ_MATCH_ACCEPTER") {
        return prestr + '买单正在向承兑人中心申请';
      }
      else if (status == "ORDER_MATCH_ACCEPTER_SUCCEEDED") {
        return prestr + '买单匹配承兑人成功';
      }
      else if (status == "ORDER_STATUS_FREEZING") {
        return prestr + '正在冻结资金';
      }
      else if (status == "ORDER_STATUS_FREEZING_SUCCEEDED") {
        return prestr + '冻结余额成功';
      }
      else if (status == "ORDER_STATUS_SELL_REQ__MATCH_ACCEPTER") {
        return prestr + '卖单申请匹配承兑人';
      }
      else if (status == "ORDER_STATUS_SELL_MATCH_ACCEPTER_SUCCEEDED") {
        return prestr + '卖单匹配承兑人成功';
      }
      else if (status == "ORDER_STATUS_THAWING") {
        return prestr + '正在解冻';
      }
      else if (status == "ORDER_STATUS_THAWING_SUCCEEDED") {
        return prestr + '解冻成功';
      }
      else if (status == "ORDER_STATUS_USER_CONFIRM_PAY") {
        return prestr + '用户已经付款';
      }
      else if (status == "ORDER_STATUS_PASSING") {
        return prestr + '放行中';
      }
      else if (status == "ORDER_AUDIT_NOT_PASS") {
        return prestr + '审核未通过';
      }
      else if (status == "ORDER_TO_BE_AUDIT") {
        return prestr + '待审核';
      }
      else if (status == "ORDER_EOS_OP_BEGIN") {
        return prestr + '链上进行操作';
      }
      else if (status == "ORDER_STATUS_PASSING") {
        return prestr + '放行中';
      }
      else if (status == "ORDER_CREATED") {
        return prestr + '订单已创建';
      }
      else if (status == "ORDER_AUDIT_PASS") {
        return prestr + '审核通过';
      }
      else if (status == "ORDER_AUDIT_NOT_PASS") {
        return prestr + '审核没通过';
      }
      else if (status == "ORDER_FAILED") {
        return prestr + '订单失败';
      }
      else if (status == "ORDER_FINISHED") {
        return prestr + '订单成功';
      }
      else if (status == "ORDER_CANCELED") {
        return prestr + '订单被取消';
      }
      else if (status == "ORDER_STATUS_ENDRET_UNKNOWN") {
        return prestr + '订单完成状态未知';
      }
      else if (status == "ORDER_STATUS_PAYMENT_ACCOUNT_HAS_SENT_USER") {
        return prestr + '已经返回给客户端接受付款的账号';
      }
      else if (status == "ORDER_EOS_OP_SUCESS") {
        return prestr + '链上操作成功';
      } else {
        return prestr + '其他'
      }
    },
    /**
     * 手动获取id
     * 直接将el-select的:value=设置为item对象会出现视图不能立即展示和表单无法校验的问题
     */
    getPayCard(payCardId) {
      if (payCardId) {
        const payCardInfoList = this.repairOrder.remoteList.payCardInfoList || []
        for (let i = 0; i < payCardInfoList.length; i++) {
          const group = payCardInfoList[i]
          for (let k = 0; k < group.payCardInfoList.length; k++) {
            const payCardInfo = group.payCardInfoList[k]
            if (payCardInfo.id == payCardId) {
              return payCardInfo
            }
          }
        }
        return null
      }
      return null
    },
    /**格式化时间 */
    formatDate(date, fmt) {
      var currentDate = new Date(date);
      var o = {
        "M+": currentDate.getMonth() + 1, //月份
        "d+": currentDate.getDate(), //日
        "h+": currentDate.getHours(), //小时
        "m+": currentDate.getMinutes(), //分
        "s+": currentDate.getSeconds(), //秒
        "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
        "S": currentDate.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    /**
     * 重置查询条件
     */
    resetData() {
      this.listQuery = {
        handlerStatus: '', //客服处理状态
        payType: '',  //支付方式
        creatTimeFrom: '',  //创建开始时间
        creatTimeTo: '',   //创建结束时间
        receivingTimeFrom: '',   //到账开始时间
        receivingTimeTo: '',     //到账结束时间
        minAmount: '',  //最小金额
        maxAmount: '',    //最大金额
        abnormalBillNo: '',  //异常单号
        tradeId: '',   //原订单号
        repairNo: '',   //补单号
        receivingName: '',   //收款账户 
        accountName: '',     //账户姓名
        pageNo: 1,
        pageSize: 10
      }
      this.getList();
    },
    /**获取数据 */
    getList() {
      let exceptionOrderParams = {
        acceptorname: this.listQuery.accountName,
        startdate: this.listQuery.receivingTimeFrom,
        enddate: this.listQuery.receivingTimeTo,
        minamount: this.listQuery.minAmount,
        maxamount: this.listQuery.maxAmount,
      };
      sessionStorage.setItem("exceptionOrderParams", JSON.stringify(exceptionOrderParams))

      // 查询列表
      let params = { ...this.listQuery, minAmount: this.accMul(this.listQuery.minAmount, 10000).toString(), maxAmount: this.accMul(this.listQuery.maxAmount, 10000).toString() };
      qryAbnormalBill(params).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list;
          this.total = res.data.data.totalRecord;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          })
        }
      })
    },
    /**
     * 解决小数乘法精度丢失的问题
     * arg1：被乘数   arg2：乘数
     */
    accMul(arg1, arg2) {
      if (arg1 && arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
      } else {
        return "";
      }
    },
    /**
     * 改变状态
     */
    changeStatus(field, value) {
      this.listQuery[field] = value;
      this.listQuery.pageNo = 1;
      this.getList();
    },
    /**
    * 查看单大图
    */
    openLookBigImgModal(url) {
      this.lookBigImgUrl = url;
      this.lookBigImgModal = true;
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    /**查询 */
    searchClick() {
      this.listQuery.pageNo = 1;
      this.getList()
    },
    /**新建 */
    createRepairBill(row) {
      this.repairOrder.visible = true

      if (this.$refs['repairOrderFormRef']) {
        this.$refs['repairOrderFormRef'].resetFields();
      }
      this.rowObj = row;

      // 设置补单默认对应的数据
      this.repairOrder.formData = {
        amount: Number(this.rowObj.amount / 10000).toFixed(2),
        applyTime: this.rowObj.receivingTime,
        accepter: this.rowObj.userName,
        payCardId: this.rowObj.acptCardId,
        payCardUq: this.rowObj.receivingName,
        repairReason: this.rowObj.repairReason,
        abnormalBillNo: this.rowObj.abnormalBillNo,
      }
      this.reqPayCardInfoList();
      this.reqAccountnameList();
      this.reqAcceptornameList();
      this.queryRelationOrder();
    },
    /****************************** 获取服务器下拉数据 *************************/
    // 发起人联想搜索
    reqAccountnameList() {
      getMerchantList({ searchKey: '', pageNo: 1, pageSize: 1000 }).then(res => {
        if (!res || !res.data) {
          Message({
            message: '网络异常，请联系运维',
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
        this.repairOrder.remoteList.sponsorList = res.data.data || []
      }).catch(res => {
        this.repairOrder.loading.sponsor = false
      })
    },
    // 承兑人联想搜索
    reqAcceptornameList() {
      getAccepterList({ searchKey: '', currentPage: 1, pageSize: 1000 }).then(res => {
        if (!res || !res.data) {
          Message({
            message: '网络异常，请联系运维',
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
        this.repairOrder.remoteList.accepterList = res.data.data.list || []
      })
    },
    /**
     * 提交补单
     */
    sumbitRepairOrder() {
      this.$refs['repairOrderFormRef'].validate((valid) => {
        if (valid) {
          let params = {
            accepter: this.repairOrder.formData.accepter,
            amount: this.repairOrder.formData.amount,
            applyTime: this.repairOrder.formData.applyTime,
            cardType: this.repairOrder.formData.cardType,
            fastSubName: this.repairOrder.formData.fastSubName,
            payCardId: this.repairOrder.formData.payCardId,
            payCardUq: this.repairOrder.formData.payCardUq,
            sponsor: this.repairOrder.formData.sponsor,
            tradeApplyUq: this.repairOrder.formData.tradeId,
            abnormalBillNo: this.rowObj.abnormalBillNo
          }
          console.log(params);
          this.repairOrder.budanBtnDisabled = true;
          updateRepairTrade(params).then(res => {
            this.repairOrder.budanBtnDisabled = false;
            if (res.data.code == 200) {
              this.$message({
                message: "操作成功",
                type: 'success',
              })
              this.getList();
              this.repairOrder.visible = false;
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
              })
            }
          }).catch(_ => {
            this.repairOrder.budanBtnDisabled = false;
          })
        }
      })
    },

    /**
     * 查询关联订单的列表
     */
    queryRelationOrder(searchKey) {
      if (searchKey) {
        this.repairOrder.formData.searchKey = searchKey;
      }
      this.repairOrder.formData.tradeId = '';
      this.relationOrderList = [];
      let param = {
        pageNo: 1,
        pageSize: 1000,
        searchKey: this.repairOrder.formData.searchKey,
        accepterName: this.repairOrder.formData.accepter,
        acptCardId: this.repairOrder.formData.payCardId,
        merchantName: this.repairOrder.formData.sponsor,
      }
      qryIMFastPayTrade(param).then(res => {
        if (res.data.code === 200) {
          this.relationOrderList = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          })
        }
      })
    },


    /**
     * 重置
     */
    resetClick() {
      this.listQuery.handlerStatus = '' //客服处理状态
      this.listQuery.payType = ''  //支付方式
      this.listQuery.creatTimeFrom = ''  //创建开始时间
      this.listQuery.creatTimeTo = ''   //创建结束时间
      this.listQuery.receivingTimeFrom = ''   //到账开始时间
      this.listQuery.receivingTimeTo = ''    //到账结束时间
      this.listQuery.minAmount = ''  //最小金额
      this.listQuery.maxAmount = ''    //最大金额
      this.listQuery.abnormalBillNo = ''  //异常单号
      this.listQuery.tradeId = ''  //原订单号
      this.listQuery.repairNo = ''  //补单号
      this.listQuery.receivingName = ''   //收款账户 
      this.listQuery.accountName = ''     //账户姓名
    },
    selectrepairReason(val) {
      if (!this.repairOrder.formData.repairReason) {
        this.repairOrder.formData.repairReason = val;
      }
    },
    /**
     * 工单内容的粘贴事件，可以截图后在输入框粘贴会直接上传图片
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
    /**
    * 上传图片
    */
    onUploadChange(file) {
      const _this = this
      // 验证文件类型
      const IMGTYPE = ['image/jpeg', 'image/png', 'image/jpg']
      // 验证文件大小
      const MAXSIZE = file.size / 1024 / 1024 < 2

      if (IMGTYPE.indexOf(file.raw.type) < 0) {
        this.$message({
          message: '请上传(*.jpg/*.png/*.jpeg)格式的图片',
          type: 'error'
        })
        return
      }
      if (!MAXSIZE) {
        this.$message({
          message: '图片大小不能超过2MB!',
          type: 'error'
        })
        return
      }
      // 判断文件最多3个
      if (this.relativeImgUrlList.length > 2) {
        this.$message({
          message: '您已达到（3个）图片上限',
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
            this.relativeImgUrlList.push({ imageData: reader.result, imageFullUrl: res.data.data.imageFullUrl, imageShortUrl: res.data.data.imageShortUrl })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      }
    },
    convertMoney(num) {
      return Number(num / 10000).toFixed(2);
    },
    /**
     * 图片删除
     */
    removeImage(index) {
      this.relativeImgUrlList.splice(index, 1)
    },
  },
}
</script>

<style>
/* 全局暴露的上传图片样式 */
.upload_container {
  display: inline-block;
}
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
  bottom: 20px;
  left: 50%;
  line-height: 20px;
  transform: translateX(-50%);
  font-size: 12px;
  color: #8c939d;
}

.upload_container .avatar-uploader .desc_text:hover {
  color: #8c939d;
}
</style>

<style scoped>
.layout_container {
  padding: 20px 30px;
  min-height: 600px;
  font-size: 14px;
  color: #4d5568;
}
.box-spacing {
  font-size: 14px;
}

.tags {
  width: 80px;
  height: 36px;
  line-height: 38px;
  display: inline-block;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
}
.tags.selected {
  background: #409eff;
  color: #fff;
}
</style>

