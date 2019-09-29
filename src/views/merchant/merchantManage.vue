<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing">
        <el-input placeholder="账户名/姓名" v-model="listQuery.searchKey" clearable></el-input>
        <el-button type="primary" @click="searchClick" style="margin-left:10px;">查询</el-button>
      </span>
    </div>
    <div class="app-container">

      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row @sort-change="sortChange">
        <el-table-column align="center" label="账户名">
          <template slot-scope="scope">
            <span>{{scope.row.accountName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商家名称">
          <template slot-scope="scope">
            <span>{{scope.row.merchantName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="今日收款" sortable prop="todayCollectionAmount" width="120">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.todayCollectionAmount)/10000/10000).toFixed(4)}}万</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="累计收款" sortable prop="sumCollectionAmount" width="120">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.sumCollectionAmount)/10000/10000).toFixed(4)}}万</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="今日完成订单" sortable prop="todayOrders" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.todayOrders}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="累计完成订单" sortable prop="sumOrders" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.sumOrders}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="笔单价" sortable prop="unitPrice" width="90">
          <template slot-scope="scope">
            <span>{{(Number(scope.row.unitPrice)/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人">
          <template slot-scope="scope">
            <span>{{scope.row.contact}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="可用余额" sortable prop="balance" width="120">
          <template slot-scope="scope">
            <span>{{(scope.row.amountGAC/10000).toFixed(4)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            <span>{{scope.row.remark || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值模式" width="160">
          <template slot-scope="scope">
            <el-select v-model="scope.row.autoChargeType" placeholder="请选择充值模式" @change="autoChargeTypeClick(scope.row,scope)" style="width:120px;">
              <el-option :value="0" label="无"></el-option>
              <el-option :value="1" label="接口模式"></el-option>
              <el-option :value="2" label="机器人"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px;" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!--
            <el-button size="mini" style="width:45px;" type="text" @click="handleRemove(scope.row,scope)">移除</el-button>
            -->
            <el-button size="mini" style="width:45px;" type="text" @click="handleCheckScreate(scope.row,scope)">查看密钥</el-button>
            <el-button size="mini" style="width:45px;" type="text" @click="handleCheckLink(scope.row,scope)">查看链接</el-button>
            <el-button size="mini" style="width:45px;" type="text" @click="handleRemark(scope.row,scope)">备注</el-button>
            <el-button size="mini" style="width:45px;" type="text" @click="openPayMerchantChannelConfig(scope.row,scope)">通道配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--编辑弹出框-->

    <!--查看商家连接地址-->
    <el-dialog title="商家连接地址" :visible.sync="linkURLDialogVisible" width="50%">
      <span>{{linkURL}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="linkURLDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--删除确认弹出框-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定要移除该商家吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialogClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--备注弹出框-->
    <el-dialog title="备注" :visible.sync="remarkDialogVisible" width="38.20%">
      <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="remark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitRemark">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看私钥-->
    <el-dialog title="查看密钥" :visible.sync="screatKeyVisible" width="50%">
      <div class="screatKeyClass">
        <span style="color:#000">账户名：</span>
        <span>{{userAccountName}}</span>
      </div>
      <div class="screatKeyClass">
        <span style="color:#000">商家ID：</span>
        <span>{{bussinessId}}</span>
      </div>
      <div class="screatKeyClass">
        <span style="color:#000">商家公钥：</span>
        <span>{{bussinessPublicKey}}</span>
      </div>
      <div class="screatKeyClass">
        <span style="color:#000">商家私钥：</span>
        <span>{{bussinessScreatKey}}</span>
      </div>
      <div class="screatKeyClass">
        <span style="color:#000">青苹果公钥：</span>
        <span>{{gavpublicKey}}</span>
      </div>
      <div class="screatKeyClass">
        <span style="color:#000">青苹果私钥：</span>
        <span>{{gacscreatKey}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="screateKeyClick">关 闭</el-button>
      </span>
    </el-dialog>

    <!--配置支付通道-->
    <el-dialog title="通道配置" :visible.sync="payChannelConfigModal" width="680px">
      <div class="channel_config">
        <span>
          <el-checkbox v-model="BANK_CARD" label="0" true-label="0" false-label="1">银行卡转账</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="WECHAT" label="0" true-label="0" false-label="1">微信扫码</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="ALIPAY" label="0" true-label="0" false-label="1">支付宝扫码</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="QUICKPASS" label="0" true-label="0" false-label="1">云闪付</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="WECHAT_BANK" label="0" true-label="0" false-label="1">微信转银行卡</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="ALIPAY_BANK" label="0" true-label="0" false-label="1">支付宝转银行卡</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="BUSINESS_ALIPAY" label="0" true-label="0" false-label="1">支付宝H5</el-checkbox>
        </span>
        <span>
          <el-checkbox v-model="BUSINESS_ALIPAY_BANK" label="0" true-label="0" false-label="1">支付宝扫码转银行卡</el-checkbox>
        </span>
      </div>
      <span slot="footer" style="text-align:center;">
        <el-button @click="payChannelConfigModal = false">取 消</el-button>
        <el-button type="primary" @click="submitPayMerchantChannelConfig()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { updateMerchantRemark, queryMerchantList, merchantEdit, getMerchantScreate, getPyUrl, updateMerchantChargeType, payMerchantChannelConfig } from '@/api/merchat'
import { Message } from 'element-ui'
import { getByteLength } from '@/utils/index'
export default {
  name: 'acceptorManagement',
  data() {
    return {
      //  备注编辑
      remark: '',
      id: '',
      remarkDialogVisible: false,
      linkURL: '',
      saveScope: '',
      autochargetypeMode: '',
      linkURLDialogVisible: false,
      dialogVisible: false,
      deleteDialogVisible: false,
      screatKeyVisible: false,
      userAccountName: '',
      bussinessId: '',
      bussinessPublicKey: '',
      bussinessScreatKey: '',
      gavpublicKey: '',
      gacscreatKey: '',
      username: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        searchKey: '',
        orderField: '',
        orderStatus: 0,
      },
      autochargetype: [{
        value: '0',
        label: '无'
      }, {
        value: '1',
        label: '接口模式'
      }, {
        value: '2',
        label: '机器人'
      }],

      // 通道配置
      rowMerchantObj: {},
      // 数据
      BANK_CARD: "0", // 银行卡转账
      WECHAT: "0", // 微信扫码
      ALIPAY: "0", // 支付宝扫码
      QUICKPASS: "0", // 云闪付
      WECHAT_BANK: "0", // 微信转银行卡
      ALIPAY_BANK: "0", // 支付宝转银行卡
      BUSINESS_ALIPAY: "0", // 支付宝H5
      BUSINESS_ALIPAY_BANK: "0", // 支付宝扫码转银行卡
      // 弹出框
      payChannelConfigModal: false,

    }
  },
  created() {
    this.getList()
  },
  methods: {

    /**
     * 通道配置
     */
    openPayMerchantChannelConfig(row) {
      this.rowMerchantObj = row;
      this.payChannelConfigModal = true;
      payMerchantChannelConfig({
        interface_type: "query",
        eos_no: row.accountName,
        from: this.$store.getters.loginParam.accountname,
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.pay_merchant && res.data.data.pay_merchant.length > 0) {
            let data = res.data.data.pay_merchant[0];
            this.BANK_CARD = String(data.bank_card) // 银行卡转账
            this.WECHAT = String(data.wechat)// 微信扫码
            this.ALIPAY = String(data.alipay) // 支付宝扫码
            this.QUICKPASS = String(data.quickpass)// 云闪付
            this.WECHAT_BANK = String(data.wechat_bank)// 微信转银行卡
            this.ALIPAY_BANK = String(data.alipay_bank)// 支付宝转银行卡
            this.BUSINESS_ALIPAY = String(data.business_alipay) // 支付宝H5
            this.BUSINESS_ALIPAY_BANK = String(data.business_alipay_bank)// 支付宝扫码转银行卡
          }
          // 该对象为空，就代表是第一次初始化，全部通道都是可用
          else {
            this.BANK_CARD = "0" // 银行卡转账
            this.WECHAT = "0" // 微信扫码
            this.ALIPAY = "0" // 支付宝扫码
            this.QUICKPASS = "0" // 云闪付
            this.WECHAT_BANK = "0" // 微信转银行卡
            this.ALIPAY_BANK = "0" // 支付宝转银行卡
            this.BUSINESS_ALIPAY = "0" // 支付宝H5
            this.BUSINESS_ALIPAY_BANK = "0" // 支付宝扫码转银行卡
          }
        }
      })
    },
    submitPayMerchantChannelConfig() {
      payMerchantChannelConfig({
        from: this.$store.getters.loginParam.accountname,
        interface_type: 'insert',
        eos_no: this.rowMerchantObj.accountName,
        bank_card: Number(this.BANK_CARD), // 银行卡转账
        wechat: Number(this.WECHAT), // 微信扫码
        alipay: Number(this.ALIPAY),// 支付宝扫码
        quickpass: Number(this.QUICKPASS), // 云闪付
        wechat_bank: Number(this.WECHAT_BANK), // 微信转银行卡
        alipay_bank: Number(this.ALIPAY_BANK), // 支付宝转银行卡
        business_alipay: Number(this.BUSINESS_ALIPAY), // 支付宝H5
        business_alipay_bank: Number(this.BUSINESS_ALIPAY_BANK), // 支付宝扫码转银行卡
      }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.rowMerchantObj = '';
          this.payChannelConfigModal = false;
        }
      })
    },



    autoChargeTypeClick(row, scope) {
      console.log(row, '+++++++++++++row+++++++++++')
      const params = {
        autoChargeType: row.autoChargeType,
        accountName: row.accountName
      }
      updateMerchantChargeType(params).then(res => {
        if (res.data.code === 200) {
          Message({
            message: '充值模式修改成功',
            type: 'success',
            duration: 5 * 1000
          })
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
     * 提交表单修改
     */
    sumbitRemark(row, scope) {
      //  最多50个中文
      if (this.remark && getByteLength(this.remark) > 100) {
        Message({
          message: '最多50个字',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      const params = {
        id: this.id,
        remark: this.remark
      }
      updateMerchantRemark(params).then(res => {
        if (!res || !res.data) {
          Message({
            message: '系统异常，请联系运维',
            type: 'error',
            duration: 3 * 1000
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
        this.remarkDialogVisible = false
        this.getList()
        Message({
          message: "操作成功",
          type: 'success',
          duration: 5 * 1000
        })
      })
    },


    /**
     *  打开备注弹窗
     */
    handleRemark(row, scope) {
      this.remark = row.remark || ''
      this.id = row.id || ''
      this.remarkDialogVisible = true
    },
    /**
     * 查看连接
     */
    handleCheckLink(row, scope) {
      getPyUrl({ userName: row.accountName }).then(res => {
        this.linkURL = res.data
      })
      this.linkURLDialogVisible = true
    },
    /**
     * 查看密钥
     */
    handleCheckScreate(row, scope) {
      getMerchantScreate({ accountName: row.accountName }).then(res => {
        if (res.data.code === 200) {
          this.userAccountName = res.data.data.accountName
          this.bussinessId = row.id
          this.bussinessPublicKey = res.data.data.payPublicKey
          this.bussinessScreatKey = res.data.data.payPrivateKey
          this.gavpublicKey = res.data.data.publicKey
          this.gacscreatKey = res.data.data.privateKey
          this.screatKeyVisible = true
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    /**
     * 密钥关闭
     */
    screateKeyClick() {
      this.screatKeyVisible = false
    },
    sortChange(sort) {
      console.log(sort);
      if (sort.prop) {
        this.listQuery.orderField = sort.prop;
        if (sort.order == "ascending") {
          this.listQuery.orderStatus = "1";
        }
        if (sort.order == "descending") {
          this.listQuery.orderStatus = "0";
        }
      } else {
        this.listQuery.orderField = '';
        this.listQuery.orderStatus = '';
      }
      this.listQuery.pageNo = 1;
      this.getList();
    },
    getList() {
      /**
       * 商家管理列表展示
       */
      this.listLoading = true
      const params = {
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
        searchKey: this.listQuery.searchKey,
        sortField: this.listQuery.orderField,
        sortType: this.listQuery.orderStatus,
      }
      // console.log(params)
      queryMerchantList(params).then(response => {
        if (response.data.code === 200) {
          this.list = response.data.data.list;
          this.total = response.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        } else {
          this.listLoading = false
          Message({
            message: response.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    /**
     * 查询列表操作
     */
    searchClick() {
      this.listQuery.page = 1
      this.getList()
    },

    handleRemove(val, scope) {
      this.saveScope = scope
      this.deleteDialogVisible = true
    },
    deleteDialogClick() {
      const params = {
        id: this.saveScope.row.id,
        userName: this.saveScope.row.accountName
      }
      /**
       * 移除商家管理
       */
      merchantEdit(params).then(res => {
        if (res.data.code === 200) {
          this.getList()
          this.deleteDialogVisible = false
          Message({
            message: '移除成功',
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
  }
}
</script>
<style scoped>
.channel_config {
  width: 100%;
}
.channel_config span {
  display: inline-block;
  width: 30%;
  margin-top: 10px;
  margin-left: 100px;
  text-align: left;
}


.el-input {
  width: auto;
  margin-left: 10px;
}
.contaner-box {
  margin: 30px 30px 0 30px;
  overflow: hidden;
}
.box-spacing {
  display: block;
  margin-left: 20px;
  float: left;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
.hoverRight {
  display: inline-block;
  margin-left: 20px;
}
.screatKeyClass {
  font-size: 16px;
  margin-bottom: 20px;
}
.screatKeyClass span {
  margin-bottom: 20px;
  word-break: break-all;
  line-height: 22px;
}
</style>

