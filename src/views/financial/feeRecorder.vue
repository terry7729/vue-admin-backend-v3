<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing">
        <span class="demonstration">时间：</span>
        <el-date-picker v-model="pickerdate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间">
        </el-date-picker>
      </span>
      <span class="box-spacing" style="margin-left:10px;">
        手续费类型：
        <el-select v-model="poundage" placeholder="请选择">
          <el-option v-for="item in poundagefee" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        用户分组：
        <el-select v-model="usergroup" placeholder="请选择">
          <el-option v-for="item in userGroup" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        交易账户：<el-input placeholder="请输入账户名" v-model="tradingAccount" clearable></el-input>
      </span>
      <span class="box-spacing">
        <el-button type="primary" style="margin-left:10px;" @click="searchClick">查询</el-button>
        <el-button type="primary" style="margin-left:10px;" @click="statisticalClick">统计</el-button>
      </span>
    </div>

    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.operTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="交易账户">
          <template slot-scope="scope">
            <span>{{scope.row.ownUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户分组">
          <template slot-scope="scope">
            <span v-if="scope.row.ownRole==='ORDINARY'">普通用户</span>
            <span v-if="scope.row.ownRole==='ACCEPTER'">承兑人</span>
            <span v-if="scope.row.ownRole==='BUSINESS'">商家</span>
            <span v-if="scope.row.ownRole==='SYSTEMACCOUNT'">系统账户</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="交易金额（GAC）">
          <template slot-scope="scope">
            <span>{{Number(scope.row.amountGac/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手续费类型">
          <template slot-scope="scope">
            <span v-if="scope.row.busiType===10">转账手续费</span>
            <span v-if="scope.row.busiType===11">收款手续费</span>
            <span v-if="scope.row.busiType===211">APP买入手续费</span>
            <span v-if="scope.row.busiType===212">会员充值手续费</span>
            <span v-if="scope.row.busiType===213">APP卖出手续费</span>
            <span v-if="scope.row.busiType===214">出款手续费</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手续费率">
          <template slot-scope="scope">
            <span>{{scope.row.fundChargeDesc||"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手续费（GAC）">
          <template slot-scope="scope">
            <span>{{Number(scope.row.chargeGac/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!--弹出统计框-->
    <el-dialog title="手续费统计" :visible.sync="statisticalVisible" width="500px">
      <el-form ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="统计时间：">
          <span>{{startTime}} 至 {{endTime}}</span>
        </el-form-item>
        <el-form-item label="转账手续费：">
          <span>{{fastSellCharge}} GAC</span>
        </el-form-item>
        <el-form-item label="收款手续费：">
          <span>{{transeInCharge}} GAC</span>
        </el-form-item>
        <el-form-item label="出款手续费：">
          <span>{{transeOutCharge}} GAC</span>
        </el-form-item>
        <el-form-item label="app卖出手续费：">
          <span>{{appSellCharge}} GAC</span>
        </el-form-item>
        <el-form-item label="app买入手续费：">
          <span>{{appBuyCharge}} GAC</span>
        </el-form-item>
        <el-form-item label="会员充值手续费：">
          <span>{{fastBuyCharge}} GAC</span>
        </el-form-item>
        <el-form-item label="手续费总额：" style="font-weight: bold;">
          <span style="color:red;font-weight: bold;">{{totalRate}} GAC</span>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import { queryChargeRecord, stateAllChargeInfoByRange } from '@/api/user'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      pickerdate: '',
      pickerdate1: '',

      startTime: '',
      endTime: '',
      appBuyCharge: '',
      appSellCharge: '',
      fastBuyCharge: '',
      fastSellCharge: '',
      transeInCharge: '',
      transeOutCharge: '',
      totalRate: '',

      poundagefee: [{
        value: '',
        label: '全部'
      }, {
        value: '10',
        label: '转账手续费'
      }, {
        value: '11',
        label: '收款手续费'
      }, {
        value: '211',
        label: 'APP买入手续费'
      }, {
        value: '212',
        label: '会员充值手续费'
      }, {
        value: '213',
        label: 'APP卖出手续费'
      }, {
        value: '214',
        label: '出款手续费'
      }],
      poundage: '',
      userGroup: [{
        value: '',
        label: '全部'
      }, {
        value: 'ORDINARY',
        label: '普通用户'
      }, {
        value: 'BUSINESS',
        label: '商家'
      }, {
        value: 'ACCEPTER',
        label: '承兑人'
      }, {
        value: 'SYSTEMACCOUNT',
        label: '系统账户'
      }],
      usergroup: '',
      tradingAccount: '',
      listQuery: {
        page: 1,
        limit: 10
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      statisticalVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    statisticalClick() {
      if (this.pickerdate === '' && this.pickerdate1 === '') {
        Message({
          message: '请选择统计时间',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      const param = {
        start: this.pickerdate,
        end: this.pickerdate1
      }
      stateAllChargeInfoByRange(param).then(res => {
        if (res.data.code === 200) {
          this.statisticalVisible = true
          this.startTime = this.pickerdate
          this.endTime = this.pickerdate1
          this.appBuyCharge = (Number(res.data.data.appBuyCharge) / 10000).toFixed(4);
          this.appSellCharge = (Number(res.data.data.appSellCharge) / 10000).toFixed(4);
          this.fastBuyCharge = (Number(res.data.data.fastBuyCharge) / 10000).toFixed(4);
          this.fastSellCharge = (Number(res.data.data.fastSellCharge) / 10000).toFixed(4);
          this.transeInCharge = (Number(res.data.data.transeInCharge) / 10000).toFixed(4);
          this.transeOutCharge = (Number(res.data.data.transeOutCharge) / 10000).toFixed(4);

          this.totalRate = Number(this.appBuyCharge) + Number(this.appSellCharge) + Number(this.fastBuyCharge) + Number(this.fastSellCharge) + Number(this.transeInCharge) + Number(this.transeOutCharge);
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
    getList() {
      const param = {
        accountName: this.tradingAccount,
        groupClasses: this.usergroup,
        chargeType: this.poundage,
        start: this.pickerdate,
        end: this.pickerdate1,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      queryChargeRecord(param).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list
          this.total = res.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 100)
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    /**
     * 查询
     */
    searchClick() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
<style scoped>
.el-input {
  width: auto;
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
</style>
