<template>
  <div id="fenrun">
    <div class="contaner-box">
      <span class="box-spacing">
        <span class="tags" :class="{selected:listQuery.buyStatus == '0'}" @click="changeLabelStatus('buyStatus','0')">
          <span>&nbsp;非承兑人间买卖&nbsp;</span>
        </span>
        <span class="tags" :class="{selected:listQuery.buyStatus == '1'}" @click="changeLabelStatus('buyStatus','1')">
          <span>&nbsp;承兑人间买卖&nbsp;</span>
        </span>
      </span>
      <div class="box-search" style="margin-top:20px;">
        <span class="box-spacing" style="float:left">
          <span class="demonstration">时间：</span>
          <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始时间">
          </el-date-picker>
          <span>至</span>
          <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束时间">
          </el-date-picker>
        </span>
        <span class="box-spacing" style="float:left">
          <span class="demonstration">分润状态：</span>
          <el-select v-model="fenrunStatusModel" placeholder="请选择">
            <el-option v-for="item in fenrunStatus" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span class="box-spacing" style="margin-left:10px;float:left">
          承兑人：<el-input placeholder="请输入承兑人账户名" v-model="accountName" clearable></el-input>
        </span>
        <span class="box-spacing" style="margin-left:10px;float:left">
          <!--
          <el-button style="margin-left:10px;" :loading="exportLoading" @click="exportFile">导出</el-button>
          -->
          <el-button type="primary" style="margin-left:10px;" @click="searchClick">查询</el-button>
        </span>
      </div>
    </div>
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="账户名">
          <template slot-scope="scope">
            {{scope.row.account_name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="承兑金额">
          <template slot-scope="scope">
            {{Number(scope.row.total_gac/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="承兑卖出金额">
          <template slot-scope="scope">
            {{Number(scope.row.total_sell_gac/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="承兑买入金额">
          <template slot-scope="scope">
            {{Number(scope.row.total_buy_gac/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付宝收款金额">
          <template slot-scope="scope">
            {{Number(scope.row.total_alipay_buy/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="微信收款金额">
          <template slot-scope="scope">
            {{Number(scope.row.total_wechat_buy/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="银行卡收款金额">
          <template slot-scope="scope">
            {{Number(scope.row.total_bank_buy/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="应分润金额">
          <template slot-scope="scope">
            {{Number(scope.row.should_profit/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="额外分润">
          <template slot-scope="scope">
            {{Number(scope.row.extra_profit/10000).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="分润状态">
          <template slot-scope="scope">
            <span v-if="scope.row.profit_status===0">未分润</span>
            <span v-if="scope.row.profit_status===1">已分润</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px;" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="scope.row.profit_status===0">
              <span style="margin-right:10px;color:#37c6ff;cursor: pointer;" @click="fenrunClick(scope.row,scope,1)">设为已分润</span>
              <span style="color:#37c6ff;cursor: pointer;" @click="fenrunClick(scope.row,scope,2)">设置额外分润</span>
            </div>
            <div v-if="scope.row.profit_status===1">
              <span style="color:#37c6ff;cursor: pointer;" @click="fenrunClick(scope.row,scope,3)">设为未分润</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--设置额外分润-->
    <el-dialog title="设置额外分润" :visible.sync="extraDialogVisible" width="385px">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="额外分润：">
          <el-input placeholder="请输入额外分润金额" v-model="extraAmount" clearable></el-input>
          <div style="color:red;" v-show="extraAmountMsg">
            请输入1～100000的数字
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleExtraSureClick">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { shareProfitList, SetProfitStatus } from '@/api/acceptor'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      exportLoading: false,
      listQuery: {
        buyStatus: '0',
        page: 1,
        limit: 10
      },
      extraAmount: '',
      extraAmountMsg: false,
      extraDialogVisible: false,
      accountName: '',
      fenrunStatusModel: '',
      saveRow: null,
      saveScope: null,
      fenrunStatus: [{
        value: '',
        label: '全部状态'
      }, {
        value: '1',
        label: '已分润'
      }, {
        value: '0',
        label: '未分润'
      }],
      startDate: '',
      endDate: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
    }
  },
  created() {
    this.getList()
  },
  watch: {
    extraAmount: function (val) {
      let reg = /^[1-9]\d{0,4}$|^10000$/
      if (!reg.test(val)) {
        this.extraAmountMsg = true
      } else {
        this.extraAmountMsg = false
      }
    }
  },
  methods: {
    /**分润操作 */
    fenrunClick(row, scope, index) {
      this.saveRow = row
      this.saveScope = scope
      if (index === 2) {
        this.extraDialogVisible = true
        return;
      }
      let param = {
        account_name: row.account_name,
        date: row.date,
        extra_profit: 0,
        id: row.id,
        status: row.profit_status === 1 ? 0 : 1
      }
      SetProfitStatus(param).then(res => {
        if (res.data.code === 200) {
          this.list[this.saveScope.$index].extra_profit = Number(res.data.data.extra_profit / 10000).toFixed(2)
          this.list[scope.$index].profit_status = res.data.data.profit_status
        }
      })
    },
    /**设置额外分润 */
    handleExtraSureClick() {
      let reg = /^[1-9]\d{0,4}$|^10000$/
      if (!reg.test(this.extraAmount)) {
        this.extraAmountMsg = true
        return
      }
      let param = {
        account_name: this.saveRow.account_name,
        date: this.saveRow.date,
        extra_profit: Number(this.extraAmount * 10000),
        id: this.saveRow.id,
        status: this.saveRow.profit_status === 1 ? 0 : 1
      }
      SetProfitStatus(param).then(res => {
        if (res.data.code === 200) {
          this.list[this.saveScope.$index].extra_profit = Number(res.data.data.extra_profit).toFixed(2)
          this.list[this.saveScope.$index].profit_status = res.data.data.profit_status

          this.extraDialogVisible = false
          this.extraAmount = ''
        }
      })
    },
    /**
    * 改变工单状态
    */
    changeLabelStatus(label, status) {
      this.listQuery[label] = status
      this.getList()
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
     * 导出
     */
    exportFile() {
      console.log(this.startDate);
      // 验证开始时间不能大于结束时间
      if (!this.startDate || !this.endDate) {
        this.$message({
          type: "error",
          message: "请选择导出时间段"
        })
        return;
      }
      if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间"
        })
        return;
      }
      // 导出默认先查询页面展示最新的结果再导出
      this.searchClick();
      // 参数
      let params = {
        pageNo: -1,
        pageSize: -1,
        isAccepterBuyAccepter: this.listQuery.buyStatus,
        Date: this.startDate,
        startDate: this.startDate,
        endDate: this.endDate,
        shareStatus: this.fenrunStatusModel,
        accepterName: this.accountName
      }
      this.exportLoading = true;
      shareProfitList(params).then(res => {
        if (res.data.code === 200) {
          let exportData = [];
          if (res.data.data.list && res.data.data.list.length > 0) {
            res.data.data.list.forEach((v, i) => {
              // 类型
              let profit_status_name = '';
              if (v.profit_status == 0) {
                profit_status_name = "未分润";
              }
              if (v.profit_status == 1) {
                profit_status_name = "已分润";
              }


              exportData.push({
                account_name: v.account_name,
                total_gac: Number(v.total_gac / 10000).toFixed(2),
                total_sell_gac: Number(v.total_sell_gac / 10000).toFixed(2),
                total_buy_gac: Number(v.total_buy_gac / 10000).toFixed(2),
                total_alipay_buy: Number(v.total_alipay_buy / 10000).toFixed(2),
                total_wechat_buy: Number(v.total_wechat_buy / 10000).toFixed(2),
                total_bank_buy: Number(v.total_bank_buy / 10000).toFixed(2),
                should_profit: Number(v.should_profit / 10000).toFixed(2),
                extra_profit: Number(v.extra_profit / 10000).toFixed(2),
                profit_status: profit_status_name,
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
              const excelHeader = ['账户名', '承兑金额', '承兑卖出金额', '承兑买入金额', '支付宝收款金额', '微信收款金额', '银行卡收款金额', '应分润金额', '额外分润', '分润状态'];
              const relationField = ['account_name', 'total_gac', 'total_sell_gac', 'total_buy_gac', 'total_alipay_buy', 'total_wechat_buy', 'total_bank_buy', 'should_profit', 'extra_profit', 'profit_status'];
              const data = this.formatJson(relationField, exportData);
              // 导出
              excel.export_json_to_excel({
                header: excelHeader,
                data,
                filename: "承兑人分润数据",
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
     * 搜索列表
     */
    getList() {
      let curDate = new Date()
      let param = {
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
        isAccepterBuyAccepter: this.listQuery.buyStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        shareStatus: this.fenrunStatusModel,
        accepterName: this.accountName
      }
      shareProfitList(param).then(res => {
        if (res.data.code === 200) {
          this.listLoading = false
          this.list = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    /**查询 */
    searchClick() {
      this.listQuery.page = 1
      this.getList()
    },
    /**
     * 导出
     */
    export() {

    },
    /**
     * 点击分页当前页数改变的事件
     */
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
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
  }
}
</script>

<style scoped>
.tags.selected {
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  display: inline-block;
  padding: 5px 10px;
}
.box-search {
  clear: both;
  margin-top: 10px;
}
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
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
</style>
<style>
#fenrun .el-button {
  float: right;
}
#fenrunDetail .el-form-item {
  margin-bottom: 5px;
}
#fenrun .el-input {
  position: relative;
}
#fenrun .gac {
  position: absolute;
  top: 0px;
  right: 145px;
}
</style>
