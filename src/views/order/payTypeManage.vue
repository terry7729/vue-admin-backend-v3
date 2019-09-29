<template>
  <div class="tab-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.paymentType==='BANK_CARD'">银行卡转账</span>
          <span v-if="scope.row.paymentType==='WECHAT'">微信扫码</span>
          <span v-if="scope.row.paymentType==='ALIPAY'">支付宝扫码</span>
          <span v-if="scope.row.paymentType==='QUICKPASS'">云闪付</span>
          <span v-if="scope.row.paymentType==='WECHAT_BANK'">微信转银行卡</span>
          <span v-if="scope.row.paymentType==='ALIPAY_BANK'">支付宝转银行卡</span>
          <span v-if="scope.row.paymentType==='BUSINESS_ALIPAY'">支付宝h5</span>
          <span v-if="scope.row.paymentType==='BUSINESS_ALIPAY_BANK'">支付宝扫码转银行卡</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.paymentStatus===1">开启</span>
          <span v-if="scope.row.paymentStatus===0">关闭</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支持渠道">
        <template slot-scope="scope">
          <span v-if="scope.row.paymentChannel===211">普通买入</span>
          <span v-if="scope.row.paymentChannel===212">快捷买入</span>
          <span v-if="scope.row.paymentChannel===213">普通卖出</span>
          <span v-if="scope.row.paymentChannel===214">放款卖出</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="今日流水">
        <template slot-scope="scope">
          {{convertMoney(scope.row.doneFlowAmount)}}万
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计流水">
        <template slot-scope="scope">
          {{convertMoney(scope.row.totalDoneFlowAmount)}}万
        </template>
      </el-table-column>
      <el-table-column align="center" label="今日下单数">
        <template slot-scope="scope">
          {{scope.row.orderCount}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计下单数">
        <template slot-scope="scope">
          {{scope.row.totalOrderCount}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="今日完成订单">
        <template slot-scope="scope">
          {{scope.row.findishOrderCount}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计完成订单">
        <template slot-scope="scope">
          {{scope.row.totalFindishOrderCount}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.paymentStatus===0" size="mini" @click="openClick(scope.row,scope)">开启</el-button>
          <el-button type="primary" v-if="scope.row.paymentStatus===1" size="mini" @click="closeClick(scope.row,scope)">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { payTypeSwitch, payTypeList } from '@/api/accountManage'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      switchStatus: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        pageNo: 1,
        pageSize: 100
      }
      payTypeList(param).then(res => {
        if (res.data.code === 200) {
          this.listLoading = false
          this.list = res.data.data.list
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
    openClick(row, scope) {
      const params = {
        id: row.id,
        channelSwitch: 'STAER'
      }
      payTypeSwitch(params).then(res => {
        if (res.data.code === 200) {
          this.list[scope.$index].paymentStatus = 1
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    closeClick(row, scope) {
      const params = {
        id: row.id,
        channelSwitch: 'STOP'
      }
      payTypeSwitch(params).then(res => {
        if (res.data.code === 200) {
          this.list[scope.$index].paymentStatus = 0
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
     * 换算金额，先除以10000换算成元，再除以10000换算成万
     */
    convertMoney(num) {
      return (Number(num) / 10000 / 10000).toFixed(4)
    }
  }
}
</script>

<style>
.contaner-box {
  margin: 30px 30px 0 30px;
  overflow: hidden;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
</style>
