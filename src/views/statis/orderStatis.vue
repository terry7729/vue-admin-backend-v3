<template>
  <div>
    <!-- 查询条件 -->
    <div class="container_box" style="margin-top:10px;">
      <span style="display:inline-block;">订单类型：</span>
      <span class="tags" :class="{selected:listQuery.tradeFrom == ''}" @click="changeLabelStatus('tradeFrom','')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.tradeFrom == 'APP_BUY'}" @click="changeLabelStatus('tradeFrom','APP_BUY')">
        <span>&nbsp;app买入&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.tradeFrom == 'APP_SELL'}" @click="changeLabelStatus('tradeFrom','APP_SELL')">
        <span>&nbsp;app卖出&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.tradeFrom == 'FAST_BUY'}" @click="changeLabelStatus('tradeFrom','FAST_BUY')">
        <span>&nbsp;快捷承兑&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.tradeFrom == 'FAST_SELl'}" @click="changeLabelStatus('tradeFrom','FAST_SELl')">
        <span>&nbsp;商家出款&nbsp;</span>
      </span>
    </div>
    <div class="container_box" style="margin-top:10px;">
      <span style="display:inline-block;">支付通道：</span>
      <span class="tags" :class="{selected:listQuery.payWay == ''}" @click="changeLabelStatus('payWay','')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'ALIPAY'}" @click="changeLabelStatus('payWay','ALIPAY')">
        <span>&nbsp;支付宝&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'ALIPAY_BANK'}" @click="changeLabelStatus('payWay','ALIPAY_BANK')">
        <span>&nbsp;支付宝转银行卡&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'BUSINESS_ALIPAY'}" @click="changeLabelStatus('payWay','BUSINESS_ALIPAY')">
        <span>&nbsp;商户版支付宝转账&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'BUSINESS_ALIPAY_BANK'}" @click="changeLabelStatus('payWay','BUSINESS_ALIPAY_BANK')">
        <span>&nbsp;商户版支付宝转银行卡&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'WECHAT'}" @click="changeLabelStatus('payWay','WECHAT')">
        <span>&nbsp;微信&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'WECHAT_BANK'}" @click="changeLabelStatus('payWay','WECHAT_BANK')">
        <span>&nbsp;微信转银行卡&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'BANK_CARD'}" @click="changeLabelStatus('payWay','BANK_CARD')">
        <span>&nbsp;银行卡&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.payWay == 'QUICKPASS'}" @click="changeLabelStatus('payWay','QUICKPASS')">
        <span>&nbsp;云闪付&nbsp;</span>
      </span>
    </div>
    <div class="container_box" style="margin-top:10px;">
      <span style="margin-right:10px;">
        时间：<span>
          <el-date-picker style="width:160px;" v-model="listQuery.startDate" :picker-options="pickerOptions" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker> 到 <el-date-picker v-model="listQuery.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" style="width:160px;" placeholder="请选择结束时间"></el-date-picker>
        </span>
      </span>
      <span>
        <el-button type="primary" @click="queryData()">查询</el-button>
        <el-button type="default" @click="resetData()">重置</el-button>
      </span>
      <span style="float:right;">
        <!-- <el-button type="primary" :loading="exportLoading" @click="exportData()">{{exportLoading?"正在导出":"导出数据"}}</el-button> -->
      </span>
    </div>
    <!-- 表格数据 -->
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" border fit fithighlight-current-row>
        <el-table-column align="center" label="日期" width="200">
          <template slot-scope="scope">
            {{scope.row.date}}
          </template>
        </el-table-column>
        <el-table-column align="center" label=订单类型 width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.trade_from=='APP_BUY'">app买入</span>
            <span v-if="scope.row.trade_from=='APP_SELL'">app卖出</span>
            <span v-if="scope.row.trade_from=='FAST_BUY'">快捷承兑</span>
            <span v-if="scope.row.trade_from=='FAST_SELl'">商家出款</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付通道" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_way=='ALIPAY'">支付宝</span>
            <span v-if="scope.row.pay_way=='ALIPAY_BANK'">支付宝转银行卡</span>
            <span v-if="scope.row.pay_way=='BUSINESS_ALIPAY'">商户版支付宝转账</span>
            <span v-if="scope.row.pay_way=='BUSINESS_ALIPAY_BANK'">商户版支付宝转银行卡</span>
            <span v-if="scope.row.pay_way=='WECHAT'">微信</span>
            <span v-if="scope.row.pay_way=='WECHAT_BANK'">微信转银行卡</span>
            <span v-if="scope.row.pay_way=='BANK_CARD'">银行卡</span>
            <span v-if="scope.row.pay_way=='QUICKPASS'">云闪付</span>
          </template>
        </el-table-column>
        <el-table-column label="总订单数" align="center">
          <template slot-scope="scope">
            {{scope.row.count}}
          </template>
        </el-table-column>
        <el-table-column label="完成订单数" align="center">
          <template slot-scope="scope">
            {{scope.row.success_count}}
          </template>
        </el-table-column>
        <el-table-column label="订单总额" align="center">
          <template slot-scope="scope">
            {{convertMoney(scope.row.gac_count)}}
          </template>
        </el-table-column>
        <el-table-column label="完成订单总额" align="center">
          <template slot-scope="scope">
            {{convertMoney(scope.row.gac_success_count)}}
          </template>
        </el-table-column>
        <el-table-column label="订单完成率" align="center">
          <template slot-scope="scope">
            {{scope.row.trade_rate}}%
          </template>
        </el-table-column>
        <el-table-column label="完成总额占比" align="center">
          <template slot-scope="scope">
            {{scope.row.gac_trade_rate}}%
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { orderStatisList } from '@/api/statis.js'
export default {
  name: 'orderStatis',
  data() {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1);
    return {
      // 表格数据
      tableKey: 0,
      list: [],
      total: 0,
      // 限制结束日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > maxDate.getTime();
        },
      },
      // 查询条件
      listQuery: {
        startDate: '',
        endDate: '',
        payWay: '',
        tradeFrom: '',
        page: 1,
        limit: 20
      },
      // 导出loading
      exportLoading: false,
    }
  },
  created() {
    // 查询列表
    this.queryData();
  },
  methods: {
    /**
     * 查询
     */
    queryData() {
      this.listQuery.page = 1
      this.getList()
    },
    /**
     * 重置
     */
    resetData() {
      // 查询条件
      this.listQuery.startDate = '';
      this.listQuery.endDate = '';
      this.listQuery.payWay = '';
      this.listQuery.tradeFrom = '';
      this.listQuery.page = 1;
      // 重置完查询
      this.queryData();
    },
    /**
     * 导出
     */
    exportData() {
      // 验证开始时间不能大于结束时间
      if (this.listQuery.startDate && this.listQuery.endDate) {
        if (new Date(this.listQuery.startDate).getTime() > new Date(this.listQuery.endDate).getTime()) {
          this.$message({
            type: "error",
            message: "开始时间不能大于结束时间"
          })
          return;
        }
      }
      // 导出默认先查询页面展示最新的结果再导出
      this.getList();
      // 参数
      let params = {
        pageNo: -1,
        pageSize: -1,
        payWay: this.listQuery.payWay,
        tradeFrom: this.listQuery.tradeFrom,
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate,
      }
      this.exportLoading = true;
      orderStatisList(params).then(res => {
        if (res.data.code === 200) {
          let exportData = [];
          if (res.data.data.list && res.data.data.list.length > 0) {
            res.data.data.list.forEach((v, i) => {
              // 类型
              let pay_way_name = '';
              if (v.pay_way == "ALIPAY") {
                pay_way_name = "支付宝";
              }
              if (v.pay_way == "ALIPAY_BANK") {
                pay_way_name = "支付宝转银行卡";
              }
              if (v.pay_way == "BUSINESS_ALIPAY") {
                pay_way_name = "商户版支付宝转账";
              }
              if (v.pay_way == "BUSINESS_ALIPAY_BANK") {
                pay_way_name = "商户版支付宝转银行卡";
              }
              if (v.pay_way == "WECHAT") {
                pay_way_name = "微信";
              }
              if (v.pay_way == "WECHAT_BANK") {
                pay_way_name = "微信转银行卡";
              }
              if (v.pay_way == "BANK_CARD") {
                pay_way_name = "银行卡";
              }
              if (v.pay_way == "QUICKPASS") {
                pay_way_name = "云闪付";
              }

              // 来源
              let trade_from_mame = '';
              if (v.trade_from == "APP_BUY") {
                trade_from_mame = "app买入";
              }
              if (v.trade_from == "APP_SELL") {
                trade_from_mame = "app卖出";
              }
              if (v.trade_from == "FAST_BUY") {
                trade_from_mame = "快捷承兑";
              }
              if (v.trade_from == "FAST_SELl") {
                trade_from_mame = "商家出款";
              }

              exportData.push({
                date: v.date,
                gac_trade_rate: v.gac_trade_rate,
                pay_way_name: pay_way_name,
                trade_from_mame: trade_from_mame,
                count: v.count,
                success_count: v.success_count,
                gac_count: this.convertMoney(v.gac_count),
                gac_success_count: this.convertMoney(v.gac_success_count),
                gac_trade_rate: v.gac_trade_rate + "%",
                trade_rate: v.trade_rate + "%",
              })
            })
          }
          // 导出数据
          import('@/vendor/Export2Excel.js').then(excel => {
            // 需要过滤一下，按照顺序对应表头才可以导出
            if (exportData == null || exportData.length == 0) {
              this.$message({
                message: '当前没有数据可以导出'
              });
              this.exportLoading = false;
              return;
            } else {
              // 要导出的数据
              const excelHeader = ['日期', '类型', '来源', '总订单数', '完成订单数', '订单总额', '完成订单总额', '订单完成率', '完成总额占比'];
              const relationField = ['date', 'pay_way_name', 'trade_from_mame', 'count', 'success_count', 'gac_count', 'gac_success_count', 'trade_rate', 'gac_trade_rate'];
              const data = this.formatJson(relationField, exportData);
              // 导出
              excel.export_json_to_excel({
                header: excelHeader,
                data,
                filename: "订单数据统计",
                autoWidth: true,
                bookType: "xlsx",
              })
              this.exportLoading = false;
            }
          })
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(res => {
        this.$message({
          message: "抱歉，导出数据失败",
          type: 'error'
        })
        this.exportLoading = false;
      })
    },
    /**
     * 导出excel的方法格式化json
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    /**
     * 点击按钮查询的
     */
    getList() {
      // 验证开始时间不能大于结束时间
      if (this.listQuery.startDate && this.listQuery.endDate) {
        if (new Date(this.listQuery.startDate).getTime() > new Date(this.listQuery.endDate).getTime()) {
          this.$message({
            type: "error",
            message: "开始时间不能大于结束时间"
          })
          return;
        }
      }
      // 参数
      let params = {
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
        payWay: this.listQuery.payWay,
        tradeFrom: this.listQuery.tradeFrom,
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate,
      }
      orderStatisList(params).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 改变工单状态
     */
    changeLabelStatus(label, status) {
      this.listQuery[label] = status
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    convertMoney(num) {
      return (Number(num) / 10000).toFixed(2);
    },
  }
}
</script>
<style>
.el-dialog__body {
  padding: 10px 20px;
}
</style>
<style scoped>
/* 页面整体样式 */
.container_box {
  margin: 10px 30px 0 30px;
  font-size: 15px;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}

/* 查询文本框大小 */
.container_box .el-input,
.container_box .el-select {
  width: 175px;
}
/* 工单状态的样式 */
.tags {
  font-size: 14px;
  margin-right: 10px;
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
</style>
