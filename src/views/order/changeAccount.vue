<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        <span class="demonstration">更换时间：</span>
        <el-date-picker v-model="pickerdate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间">
        </el-date-picker>
      </span>
      <span class="box-spacing" style="margin-left:10px;">
        更换原因：
        <el-select v-model="changereason" placeholder="请选择">
          <el-option v-for="item in changeReason" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        订单号：<el-input placeholder="请输入订单号" v-model="orderId" clearable></el-input>
      </span>
    </div>
    <div style="margin:15px 0 15px 10px;overflow: hidden;">
      <span class="box-spacing">
        账户类型：
        <el-select v-model="accounttype" placeholder="请选择">
          <el-option v-for="item in accountType" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        账户：<el-input style="width:270px;" placeholder="请输入银行卡号/支付宝账号/微信号" v-model="accountName" clearable></el-input>
      </span>
      <span class="box-spacing">
        会员名：<el-input style="width:270px;" placeholder="请输入会员名" v-model="fastSubName" clearable></el-input>
      </span>
      <span class="box-spacing">
        <el-button type="primary" style="margin-left:10px;" @click="searchClick">查询</el-button>
      </span>
    </div>

    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.tradeId}}</div>
          </template>
        </el-table-column>
        <el-table-column label="会员名" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.fastSubName||'-'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="承兑人" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.acptName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="账户类型" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;" v-if="scope.row.cardType==='BANK_CARD'">银行卡</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='ALIPAY'">支付宝</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='WECHAT'">微信</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='BUSINESS_ALIPAY'">支付宝扫码(商户)</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='BUSINESS_ALIPAY_BANK'">支付宝扫码转银行卡(商户)</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='ALIPAY_BANK'">支付宝转银行卡</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='WECHAT_BANK'">微信转银行卡</div>
            <div style="text-align:center;" v-if="scope.row.cardType==='QUICKPASS'">云闪付</div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.bankAccName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="银行卡号/支付宝账号/微信号" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.cardUq}}</div>
          </template>
        </el-table-column>
        <el-table-column label="更换原因" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.changeReasonDesc}}</div>
          </template>
        </el-table-column>
        <el-table-column label="更换时间" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.changeTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="更换结果" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.changeResultDesc==='成功'" style="color: #409EFF;">
              <span @click="changeResultClick(scope.row)" style="cursor: pointer;">
                {{scope.row.changeResultDesc}}
              </span>
            </div>
            <div v-else>
              {{scope.row.changeResultDesc}}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { buyChangeList } from '@/api/accountManage'
import { Message } from 'element-ui'
export default {
  data() {
    // 获取默认当天的时间，yyyy-mm-dd HH:mm:ss
    const getDefaultDate = function () {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + '-' + (month > 9 ? month : ('0' + month)) + '-' + (day > 9 ? day : ('0' + day));
    }
    let date1 = getDefaultDate() + ' 00:00:00';
    let date2 = getDefaultDate() + ' 23:59:59';

    return {
      fastSubName: '',
      accountName: '',
      orderId: '',
      pickerdate: date1,
      pickerdate1: date2,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      changereason: '',
      changeReason: [{
        value: '',
        label: '全部原因'
      },
      {
        label: '对方账户异常,无法转账'
      },
      {
        value: '2',
        label: '想换一个支付方式'
      },
      {
        value: '0',
        label: '其他原因'
      }],
      accounttype: '',
      accountType: [{
        value: '',
        label: '全部类型'
      }, {
        value: 'BANK_CARD',
        label: '银行卡'
      }, {
        value: 'ALIPAY',
        label: '支付宝'
      }, {
        value: 'WECHAT',
        label: '微信支付'
      }, {
        value: 'QUIKPASS',
        label: '云闪付'
      }, {
        value: 'BUSINESS_ALIPAY',
        label: '支付宝扫码(商户)'
      }, {
        value: 'BUSINESS_ALIPAY_BANK',
        label: '支付宝扫码转银行卡(商户)'
      }, {
        value: 'WECHAT_BANK',
        label: '微信转银行卡'
      }, {
        value: 'ALIPAY_BANK',
        label: '支付宝转银行卡'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const param = {
        startDate: this.pickerdate,
        endDate: this.pickerdate1,
        changeReason: this.changereason,
        tradeId: this.orderId,
        cardType: this.accounttype,
        cardNo: this.accountName,
        fastSubName: this.fastSubName,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      buyChangeList(param).then(response => {
        if (response.data.code === 200) {
          this.list = response.data.data
          this.total = response.data.page.totalCount
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
      }).catch(e => {
      })
    },
    /**
     * 更换成功
     */
    changeResultClick(row) {
      this.$router.push({ path: 'order-manage/' + row.tradeId })
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
