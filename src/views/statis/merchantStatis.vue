<template>
  <div>
    <!-- 查询条件 -->
    <div class="container_box" style="margin-top:10px;">
      <span style="margin-right:10px;">
        时间：<span>
          <el-date-picker v-model="listQuery.startDate" :picker-options="pickerOptions" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker> 到 <el-date-picker v-model="listQuery.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" placeholder="请选择结束时间"></el-date-picker>
        </span>
      </span>
      <span style="margin-right:10px;">
        商家：<span>
          <el-input v-model="listQuery.merchantName" placeholder="请输入商家账户名" clearable></el-input>
        </span>
      </span>
      <span>
        <el-button type="primary" @click="queryData()">查询</el-button>
        <el-button type="default" @click="resetData()">重置</el-button>
      </span>
      <span style="float:right;">
        <el-button type="primary" @click="statisData()">统计</el-button>
        <!-- <el-button type="primary" :loading="exportLoading" @click="exportData()">{{exportLoading?"正在导出":"导出数据"}}</el-button> -->
      </span>
    </div>
    <!-- 表格数据 -->
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" border fit :header-cell-style="{background:'#fff'}" fithighlight-current-row>
        <el-table-column align="center" label="日期" width="200">
          <template slot-scope="scope">
            {{scope.row.date}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商家" width="150">
          <template slot-scope="scope">
            {{scope.row.merchant_name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款总金额" width="150">
          <template slot-scope="scope">
            {{convertMoney(scope.row.merchant_total_gac)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单数">
          <el-table-column label="总数" align="center">
            <template slot-scope="scope">
              {{scope.row.total_trade}}
            </template>
          </el-table-column>
          <el-table-column label="成功" align="center">
            <template slot-scope="scope">
              {{scope.row.sucess_trade}}
            </template>
          </el-table-column>
          <el-table-column label="失败" align="center">
            <template slot-scope="scope">
              {{scope.row.fail_trade}}
            </template>
          </el-table-column>
          <el-table-column label="订单完成率" align="center">
            <template slot-scope="scope">
              {{scope.row.sucess_rate}}%
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,40,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <!-- 商家数据统计 -->
    <el-dialog title="商家数据统计" :visible.sync="merchantStatisModal" width="600px">
      <div>

        <div style="padding-bottom:5px;">
          统计时间：{{statisCountObj.start_time}}到{{statisCountObj.end_time}}
        </div>
        <div style="padding-bottom:5px;">
          统计商家：<span v-if="statisCountObj.merchant_list && statisCountObj.merchant_list.length>0">{{statisCountObj.merchant_list.join(",")}}</span><span v-else>全部</span>
        </div>
      </div>
      <div style="margin-top:10px;border-top:solid 1px #eee;padding-top:10px;">
        <div style="padding-bottom:5px;">
          商家收款总额：{{convertMoney(statisCountObj.total_gac)}}
        </div>
        <div style="padding-bottom:5px;">
          订单总数：{{statisCountObj.merchant_total_trade}}
        </div>
        <div style="padding-bottom:5px;">
          成功订单数：{{statisCountObj.merchant_success_trade}}
        </div>
        <div style="padding-bottom:5px;">
          失败订单数：{{statisCountObj.merchant_Fail_trade}}
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="primary" @click="merchantStatisModal=false;">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { merchantStatisCount, merchantStatisList } from '@/api/statis.js'
export default {
  name: 'tab',
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
        merchantName: '',
        page: 1,
        limit: 20
      },

      // 统计的数量
      statisCountObj: {},

      // 导出loading
      exportLoading: false,

      // 商家数据统计弹框
      merchantStatisModal: false,
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
      this.listQuery.merchantName = '';
      this.listQuery.page = 1;
      // 重置完查询
      this.queryData();
    },
    /**
     * 统计
     */
    statisData() {
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
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate,
        merchantName: this.listQuery.merchantName,
      }
      this.merchantStatisModal = true;
      merchantStatisCount(params).then(res => {
        if (res.data.code === 200) {
          this.statisCountObj = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
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
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate,
        merchantName: this.listQuery.merchantName,
      }
      this.exportLoading = true;
      merchantStatisList(params).then(res => {
        if (res.data.code === 200) {
          let exportData = res.data.data.list;

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
              const excelHeader = ['日期', '商家', '收款总金额', '订单总数', '订单成功数', '订单失败数', '订单完成率'];
              const relationField = ['date', 'merchant_name', 'merchant_total_gac', 'total_trade', 'sucess_trade', 'fail_trade', 'sucess_rate'];
              const data = this.formatJson(relationField, exportData);
              // 导出
              excel.export_json_to_excel({
                header: excelHeader,
                data,
                filename: "商家数据统计",
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
        if (j == "sucess_rate") {
          return v[j] + "%";
        } else if (j == "merchant_total_gac") {
          return this.convertMoney(v[j]);
        } else {
          return v[j]
        }
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
        startDate: this.listQuery.startDate,
        endDate: this.listQuery.endDate,
        merchantName: this.listQuery.merchantName,
      }
      merchantStatisList(params).then(res => {
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
</style>
