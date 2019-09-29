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
        <!-- <el-button type="primary" :loading="exportLoading" @click="exportData()">{{exportLoading?"正在导出":"导出数据"}}</el-button> -->
      </span>
    </div>
    <!-- 表格数据 -->
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" border fit :header-cell-style="{background:'#fff'}" fithighlight-current-row>
        <el-table-column align="center" label="日期">
          <template slot-scope="scope">
            {{scope.row.date}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商家">
          <template slot-scope="scope">
            {{scope.row.merchant_name}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="下单总人数">
          <template slot-scope="scope">
            {{scope.row.count}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户完成率">
          <template slot-scope="scope">
            {{scope.row.rate}}%
          </template>
        </el-table-column>
        <el-table-column align="center" label="完成订单（第几次成功）">
          <el-table-column label="总人数" align="center">
            <template slot-scope="scope">
              {{scope.row.success_count}}
            </template>
          </el-table-column>
          <el-table-column label="1次" align="center">
            <template slot-scope="scope">
              {{scope.row.success_map_1}}
            </template>
          </el-table-column>
          <el-table-column label="2次" align="center">
            <template slot-scope="scope">
              {{scope.row.success_map_2}}
            </template>
          </el-table-column>
          <el-table-column label="3次" align="center">
            <template slot-scope="scope">
              {{scope.row.success_map_3}}
            </template>
          </el-table-column>
          <el-table-column label="4次以上" align="center">
            <template slot-scope="scope">
              {{scope.row.success_map_4}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="未完成订单（第几次失败）">
          <el-table-column label="总人数" align="center">
            <template slot-scope="scope">
              {{scope.row.fail_count}}
            </template>
          </el-table-column>
          <el-table-column label="1次" align="center">
            <template slot-scope="scope">
              {{scope.row.fail_map_1}}
            </template>
          </el-table-column>
          <el-table-column label="2次" align="center">
            <template slot-scope="scope">
              {{scope.row.fail_map_2}}
            </template>
          </el-table-column>
          <el-table-column label="3次" align="center">
            <template slot-scope="scope">
              {{scope.row.fail_map_3}}
            </template>
          </el-table-column>
          <el-table-column label="4次以上" align="center">
            <template slot-scope="scope">
              {{scope.row.fail_map_4}}
            </template>
          </el-table-column>
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
import { memberStatisList } from '@/api/statis.js'
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
      // 导出loading
      exportLoading: false,
      // 商家数据统计弹框
      memberStatisModal: false,
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
      memberStatisList(params).then(res => {
        if (res.data.code === 200) {
          let exportData = [];
          if (res.data.data.list && res.data.data.list.length > 0) {
            res.data.data.list.forEach((v, i) => {
              exportData.push({
                date: v.date,
                merchant_name: v.merchant_name,
                count: v.count,
                rate: v.rate,
                success_count: v.success_count,
                success_map_1: this.calcuCountMap(v.success_map, "1"),
                success_map_2: this.calcuCountMap(v.success_map, "2"),
                success_map_3: this.calcuCountMap(v.success_map, "3"),
                success_map_4: this.calcuCountMap(v.success_map, "4"),
                fail_count: v.fail_count,
                fail_map_1: this.calcuCountMap(v.fail_map, "1"),
                fail_map_2: this.calcuCountMap(v.fail_map, "2"),
                fail_map_3: this.calcuCountMap(v.fail_map, "3"),
                fail_map_4: this.calcuCountMap(v.fail_map, "4"),
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
              const excelHeader = ['日期', '商家', '下单总人数', '用户完成率', '完成订单总人数', '第1次成功', '第2次成功', '第3次成功', '第4+次成功', '未完成订单总人数', '第1次失败', '第2次失败', '第3次失败', '第4+次失败'];
              const relationField = ['date', 'merchant_name', 'count', 'rate', 'success_count', 'success_map_1', 'success_map_2', 'success_map_3', 'success_map_4', 'fail_count', 'fail_map_1', 'fail_map_2', 'fail_map_3', 'fail_map_4'];
              const data = this.formatJson(relationField, exportData);
              // 导出
              excel.export_json_to_excel({
                header: excelHeader,
                data,
                filename: "会员数据统计",
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
        if (j == "rate") {
          return v[j] + "%";
        } else {
          return v[j]
        }
      }))
    },
    /**
     * 计算已完成和未完成订单1-4+次的数量
     */
    calcuCountMap(map, flag) {
      map = JSON.parse(map);
      if (map && Object.keys(map).length > 0) {
        if (flag == "1" || flag == "2" || flag == "3") {
          return map[flag] || 0;
        }
        else if (flag == "4") {
          delete map["1"];
          delete map["2"];
          delete map["3"];
          let count = 0;
          if (map && Object.keys(map).length > 0) {
            for (let key in map) {
              count += Number(map[key]);
            }
          }
          return count;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
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
      memberStatisList(params).then(res => {
        if (res.data.code === 200) {
          // this.list = res.data.data.list;
          this.total = res.data.data.total;
          let list = [];
          if (res.data.data.list && res.data.data.list.length > 0) {
            res.data.data.list.forEach((v, i) => {
              list.push({
                date: v.date,
                merchant_name: v.merchant_name,
                count: v.count,
                rate: v.rate,
                success_count: v.success_count,
                success_map_1: this.calcuCountMap(v.success_map, "1"),
                success_map_2: this.calcuCountMap(v.success_map, "2"),
                success_map_3: this.calcuCountMap(v.success_map, "3"),
                success_map_4: this.calcuCountMap(v.success_map, "4"),
                fail_count: v.fail_count,
                fail_map_1: this.calcuCountMap(v.fail_map, "1"),
                fail_map_2: this.calcuCountMap(v.fail_map, "2"),
                fail_map_3: this.calcuCountMap(v.fail_map, "3"),
                fail_map_4: this.calcuCountMap(v.fail_map, "4"),
              })
            })
          }
          this.list = list;
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
