<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        审核状态：
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        <span class="demonstration">申请时间：</span>
        <el-date-picker v-model="pickerdate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间"></el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间"></el-date-picker>
      </span>
      <span class="box-spacing">
        申请用户：
        <el-input placeholder="请输入账户名" v-model="applyAccount" clearable></el-input>
        <el-button type="primary" @click="searchClick" style="margin-left:10px;">查询</el-button>
      </span>
    </div>
    <div class="app-container">
      <el-table :key="tableKey" :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="申请用户">
          <template slot-scope="scope">
            <span>{{scope.row.eosno}}</span>
          </template>
        </el-table-column>
         <el-table-column align="center" label="联系人">
          <template slot-scope="scope">
            <span>{{scope.row.contact||"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商家名称">
          <template slot-scope="scope">
            <span>{{scope.row.merchantName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus==='WAITCONFIRM'">待审核</span>
            <span v-if="scope.row.auditStatus==='PASS'">通过</span>
            <span v-if="scope.row.auditStatus===''">移除</span>
            <span v-if="scope.row.auditStatus==='NOPASS'">不通过</span>
            <span v-if="scope.row.auditStatus==='NOTPASS'">不通过</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{dateFormat(scope.row.applyTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus==='WAITCONFIRM'">
              <el-button type="primary" size="mini" @click="handlePassClick(scope.row,scope)">通过</el-button>
              <el-button size="mini" type="primary" @click="handleNotPassClick(scope.row,scope)">不通过</el-button>
            </div>
            <div v-if="scope.row.auditStatus==='PASS' || scope.row.auditStatus===2 || scope.row.auditStatus==='NOPASS' ||scope.row.auditStatus==='NOTPASS'">
              <label style="color:#ccc">已审核</label>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
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
  </div>
</template>

<script>
import {
  getNeedReviewAccepterList,
  merchanApplytEdit,
  reviewMerchant
} from "@/api/merchat";
import { Message } from "element-ui";
export default {
  data() {
    return {
      applyAccount: "",
      pickerdate: "",
      pickerdate1: "",
      username: "",
      tableKey: 0,
      list: null,
      total: null,
      userAccountName: "",
      bussinessId: "",
      bussinessPublicKey: "",
      bussinessScreatKey: "",
      gavpublicKey: "",
      gacscreatKey: "",
      screatKeyVisible: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "WAITCONFIRM",
          label: "待审核"
        },
        {
          value: "PASS",
          label: "通过"
        },
        {
          value: "NOPASS",
          label: "不通过"
        }
      ],
      value: "",

    };
  },
  created() {
    this.getList();
  },
  methods: {
    screateKeyClick() {
      this.screatKeyVisible = false;
    },

    dateFormat: function (time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },

    /** 商家申请列表 */
    getList() {
      const param = {
        eosno: this.$store.getters.loginParam.accountname,
        start_page: this.listQuery.page,
        page_num: this.listQuery.limit,
        status: this.value,
        begin_time: this.pickerdate,
        end_time: this.pickerdate1,
        merchant_no: this.applyAccount
      };
      getNeedReviewAccepterList(param).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.apply_merchant_list;
          this.total = res.data.data.total_record_num;
          setTimeout(() => {
            this.listLoading = false;
          }, 100);
        } else {
          this.listLoading = false;
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
        }
      });
    },
    /** 列表分页操作 */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    /** 列表分页操作 */
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    /**
     * 审核通过操作
     */
    handlePassClick(val, scope) {
      const _this = this;
      const param = {
        from: scope.row.eosno,
        orderid: scope.row.OrderNO,
        pass: "true"
      };
      reviewMerchant(param).then(res => {
        if (res.data.code === 200) {
          _this.list[scope.$index].auditStatus = "PASS";
          // this.getList()
        } else {
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
        }
      })
    },
    /**
     * 审核不通过操作
     */
    handleNotPassClick(val, scope) {
      const _this = this;
      const param = {
        from: scope.row.eosno,
        orderid: scope.row.OrderNO,
        pass: "false"
      };
      reviewMerchant(param).then(res => {
        if (res.data.code === 200) {
          _this.list[scope.$index].auditStatus = "NOPASS";
          // this.getList()
        } else {
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
        }
      })
    },
    /**
     * 商家申请查询
     */
    searchClick() {
      this.listQuery.page = 1;
      this.getList();
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
