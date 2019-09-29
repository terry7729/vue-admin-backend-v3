<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        流水类型：
        <el-select v-model="watertype" placeholder="请选择">
          <el-option
            v-for="item in waterType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        摘要：
        <el-select v-model="abstracttype" placeholder="请选择">
          <el-option
            v-for="item in abstractType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        <span class="demonstration">时间：</span>
        <el-date-picker
          v-model="start"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="开始时间"
        ></el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="end"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="结束时间"
        ></el-date-picker>
      </span>
      <span class="box-spacing">
        流水号：
        <el-input placeholder="请输入流水号" v-model="waterNum" clearable></el-input>
      </span>
    </div>
    <div style="margin:15px 0 15px 10px;overflow: hidden;">
      <!-- <span class="box-spacing">
        用户分组：
        <el-select v-model="usergroup" placeholder="请选择">
          <el-option
            v-for="item in userGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span> -->
      <span class="box-spacing">
        账户名：
        <el-input placeholder="请输入账户名" v-model="waterName" clearable></el-input>
      </span>
      <span class="box-spacing">
        <el-button type="primary" style="margin-left:10px;" @click="searchClick">查询</el-button>
        <el-button type="primary" style="margin-left:10px;" @click="resetClick">重置</el-button>
        <!-- <el-button
          type="primary"
          style="margin-left:10px;"
          :loading="exportLoading"
          @click="exportTradeBillClick"
        >导出</el-button> -->
      </span>
    </div>
    <div class="tab-container">
      <el-table
        :key="tableKey"
        :data="list"
        v-loading="listLoading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="流水号" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.flowseq}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户名">
          <template slot-scope="scope">
            <span>{{scope.row.ownUserName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="ownRole" label="用户分组">
          <template slot-scope="scope">
            <span v-if="scope.row.user_group==='ORDINARY' || scope.row.user_group==='ordinary'">普通用户</span>
            <span v-if="scope.row.user_group==='ACCEPTER'">承兑人</span>
            <span v-if="scope.row.user_group==='BUSINESS'">商家</span>
            <span v-if="scope.row.user_group==='SYSTEMACCOUNT'">系统账户</span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="流水方向" width="190">
          <template slot-scope="scope">
            <div v-if="scope.row.flow===2">
              <span>{{scope.row.ownUserName}}--》{{scope.row.oppositeUserName}}</span>
            </div>
            <div v-if="scope.row.flow===1">
              <span>{{scope.row.oppositeUserName}}--》{{scope.row.ownUserName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="流水类型">
          <template slot-scope="scope">
            <span v-if="scope.row.flow===2">支出</span>
            <span v-if="scope.row.flow===1">收入</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额(GAC)">
          <template slot-scope="scope">
            <span>{{Number(scope.row.changeQuan/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户余额(GAC)">
          <template slot-scope="scope">
            <!-- <span>{{Number(scope.row.balance).toFixed(4)}} GAC</span> -->
            <span>{{scope.row.balance}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="摘要">
          <template slot-scope="scope">
            <span v-if="scope.row.remark===10">转账</span>
            <span v-if="scope.row.remark===101">转账手续费</span>
            <span v-if="scope.row.remark===102">收款手续费</span>
            <span v-if="scope.row.remark===201">OTC买入冻结</span>
            <span v-if="scope.row.remark===202">OTC买入冻结退还</span>
            <span v-if="scope.row.remark===203">OTC买入放行</span>
            <span v-if="scope.row.remark===204">OTC快捷买入放行</span>
            <span v-if="scope.row.remark===301">OTC卖出冻结</span>
            <span v-if="scope.row.remark===302">OTC卖出冻结退还</span>
            <span v-if="scope.row.remark===303">OTC卖出放行</span>
            <span v-if="scope.row.remark===304">OTC卖币手续费</span>
            <span v-if="scope.row.remark===401">收单余额暂扣</span>
            <span v-if="scope.row.remark===402">收单余额暂扣退还</span>
            <span v-if="scope.row.remark===501">冻结承兑保证金</span>
            <span v-if="scope.row.remark===502">退还冻结的保证金</span>
            <span v-if="scope.row.remark===503">收取保证金</span>
            <span v-if="scope.row.remark===504">退还剩余的保证金</span>
            <span v-if="scope.row.remark===505">承兑人罚款</span>
            <span v-if="scope.row.remark===601">分润</span>
            <span v-if="scope.row.remark===306">OTC出款手续费</span>
            <span v-if="scope.row.remark===305">OTC出款放行</span>
            <span v-if="scope.row.remark===205">OTC买币手续费</span>
            <span v-if="scope.row.remark===206">OTC会员充值手续费</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { queryChargeRecord, exportTradeBill } from "@/api/acceptor";
import { Message } from "element-ui";
export default {
  data() {
    return {
      exportLoading: false,
      waterType: [
        {
          value: "",
          label: "全部类型"
        },
        {
          value: "1",
          label: "收入"
        },
        {
          value: "2",
          label: "支出"
        }
      ],
      watertype: "",

      abstractType: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "10",
          label: "转账"
        },
        {
          value: "101",
          label: "转账手续费"
        },

        {
          value: "102",
          label: "收款手续费"
        },

        {
          value: "301",
          label: "OTC卖出冻结"
        },
        {
          value: "302",
          label: "OTC卖出冻结退还"
        },
        {
          value: "201",
          label: "OTC买入冻结"
        },
        {
          value: "202",
          label: "OTC买入冻结退还"
        },
        {
          value: "203",
          label: "OTC买入放行"
        },
        {
          value: "204",
          label: "快捷买入放行"
        },
        {
          value: "205",
          label: "OTC买币手续费"
        },
        {
          value: "303",
          label: "OTC卖出放行"
        },
        {
          value: "304",
          label: "OTC卖币手续费"
        },
        {
          value: "501",
          label: "冻结承兑保证金"
        },
        {
          value: "502",
          label: "退还冻结的保证金"
        },
        {
          value: "503",
          label: "收取保证金"
        },
        {
          value: "504",
          label: "退还剩余的保证金"
        },
        {
          value: "505",
          label: "承兑人罚款"
        },
        {
          value: "306",
          label: "OTC出款手续费"
        },
        {
          value: "305",
          label: "OTC出款放行"
        },
        {
          value: "206",
          label: "OTC会员充值手续费"
        },/*
        {
          value: "301",
          label: "OTC出款冻结"
        },*/
        {
          value: "308",
          label: "OTC出款冻结退还"
        }
      ],
      abstracttype: "",
      start: "",
      end: "",
      waterNum: "",
      waterName: "",
      userGroup: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "ORDINARY",
          label: "普通用户"
        },
        {
          value: "BUSINESS",
          label: "商家"
        },
        {
          value: "ACCEPTER",
          label: "承兑人"
        },
        {
          value: "SYSTEMACCOUNT",
          label: "系统账户"
        }
      ],
      usergroup: "",
      listQuery: {
        page: 1,
        limit: 10
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true
    };
  },
  created() {
    // alert(this.abstractType.length);
    this.getList();
  },
  methods: {
    /**
     * 导出
     * @param {*} data: any
     */
    exportTradeBillClick() {
      /** *************************************** 表单校验 ************************************************* */
      if (!this.start || !this.end) {
        Message({
          message: "请选择导出的时间段",
          type: "error",
          duration: 3 * 1000
        });
        return;
      }

      // 验证开始时间不能大于结束时间
      if (
        new Date(this.start.replace(/-/g, "/")).getTime() >=
        new Date(this.end.replace(/-/g, "/")).getTime()
      ) {
        Message({
          message: "开始时间不能大于等于结束时间",
          type: "error",
          duration: 3 * 1000
        });
        return;
      }
      //判断导出是否有超过七天
      let getDate =
        new Date(this.end.replace(/-/g, "/")).getTime() -
        new Date(this.start.replace(/-/g, "/")).getTime();
      let getSevenDayMsec = 1000 * 60 * 60 * 24 * 7;
      if (getDate > getSevenDayMsec) {
        Message({
          message: "只能导出7天内的流水账单!",
          type: "error",
          duration: 3 * 1000
        });
        return;
      }
      /** *************************************** 整理查询条件 ************************************************* */

      const param = {
        accountName: this.waterName,
        groupClasses: this.usergroup,
        billType: this.watertype,
        wasteBookType: this.abstracttype,
        billId: this.waterNum,
        start: this.start,
        end: this.end
      };
      /** *************************************** 请求操作 ***************************************************** */
      // 导出默认先查询页面展示最新的结果再导出
      this.searchClick();
      this.exportLoading = true;
      exportTradeBill(param).then(res => {
        this.exportLoading = false;
        if (!res || !res.data) {
          this.$message({
            message: "网络异常，请联系运维",
            type: "error"
          });
          return;
        }
        if (res.data.code && res.data.code !== 200) {
          this.$message({
            message: res.data.message,
            type: "error"
          });
          return;
        }
        const blob = new Blob([res.data]);
        var elink = document.createElement("a");
        elink.download = "资金流水.xlsx";
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      });
    },
    getList() {
      /**
       * 流水类型：watertype
        摘要：abstracttype
        时间：开始时间--start.   
        结束时间--end
        流水号：waterNum
        用户分组：usergroup
        账户名：waterName
       */
      const param = {
        from: this.$store.getters.loginParam.accountname,
        accountNo: this.waterName, //账户名
        // userGroup: this.usergroup, //用户分组：
        flag: String(this.watertype), //流水类型：
        flowBillType: this.abstracttype,
        seqid: this.waterNum,
        begintime: this.start,
        endtime: this.end,
        start_page: this.listQuery.page,
        page_num: this.listQuery.limit
      };
      queryChargeRecord(param).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.list = res.data.data.bills_list;
            this.total = res.data.data.total_record_num;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            Message({
              message: res.data.message,
              type: "error",
              duration: 5 * 1000
            });
          }
        }
      });
    },
    /**
     * 查询
     */
    searchClick() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleUpdate(id) {},
    /**
     * 重置
     */
    resetClick() {
      this.waterName = "";
      this.usergroup = "";
      this.watertype = "";
      this.abstracttype = "";
      this.waterNum = "";
      this.start = "";
      this.end = "";
      this.listQuery.page = 1;
      this.listQuery.limit = 0;
    }
  }
};
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

