<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        订单号：
        <el-input placeholder="请输入订单号" v-model="orderId" clearable></el-input>
      </span>
      <span class="box-spacing" style="margin-left:10px;">
        <span class="demonstration">下单时间：</span>
        <el-date-picker v-model="pickerdate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间"></el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间"></el-date-picker>
      </span>
      <span class="box-spacing" style="margin-left:10px;">
        <span class="demonstration">取消时间：</span>
        <el-date-picker v-model="canclePickerdate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="开始时间"></el-date-picker>
        <span>至</span>
        <el-date-picker v-model="canclePickerdate1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="结束时间"></el-date-picker>
      </span>
      <span class="box-spacing">
        发起用户：
        <el-input placeholder="请输入承兑人用户名" v-model="fqAccountName" clearable></el-input>
      </span>
    </div>
    <div style="margin:15px 0 15px 10px;overflow: hidden;">
      <span class="box-spacing">
        会员账户：
        <el-input placeholder="请输入会员账户" v-model="accountName" clearable></el-input>
      </span>
      <span class="box-spacing" style="margin-left:10px;">
        支付通道：
        <el-select v-model="cardTypeParam" placeholder="请选择">
          <el-option value label="全部"></el-option>
          <el-option value="BANK_CARD" label="银行卡"></el-option>
          <el-option value="ALIPAY" label="支付宝"></el-option>
          <el-option value="WECHAT" label="微信"></el-option>
          <el-option value="QUICKPASS" label="云闪付"></el-option>
          <el-option value="WECHAT_BANK" label="微信转银行卡"></el-option>
          <el-option value="ALIPAY_BANK" label="支付宝转银行卡"></el-option>
          <el-option value="BUSINESS_ALIPAY" label="支付宝扫码(商户)"></el-option>
          <el-option value="BUSINESS_ALIPAY_BANK" label="支付宝扫码转银行卡(商户)"></el-option>
        </el-select>
      </span>
      <span class="box-spacing" style="margin-left:10px;">
        取消原因：
        <el-select v-model="cancelreason" placeholder="请选择">
          <el-option v-for="item in cancelReason" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </span>
      <!-- <span class="box-spacing" style="margin-left:10px;">
          账户类型：
          <el-select v-model="accountType" placeholder="全部">
          <el-option
            v-for="item in accountTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>-->
      <span class="box-spacing">
        <el-button type="primary" style="margin-left:10px;" @click="searchClick">查询</el-button>
      </span>
      <span class="box-spacing">
        <!-- <el-button type="primary" style="margin-left:10px;" @click="exportData">导出</el-button> -->
      </span>
    </div>

    <div class="tab-container">
      <el-table :key="tableKey" :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.tradeId}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;" v-if="scope.row.fastFlag===1">快捷承兑支付</div>
          </template>
        </el-table-column>
        <el-table-column label="支付通道" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cardType=='BANK_CARD'">银行卡</span>
            <span v-if="scope.row.cardType=='ALIPAY'">支付宝</span>
            <span v-if="scope.row.cardType=='WECHAT'">微信</span>
            <span v-if="scope.row.cardType=='QUICKPASS'">云闪付</span>
            <span v-if="scope.row.cardType=='WECHAT_BANK'">微信转银行卡</span>
            <span v-if="scope.row.cardType=='ALIPAY_BANK'">支付宝转银行卡</span>
            <span v-if="scope.row.cardType=='BUSINESS_ALIPAY'">支付宝扫码(商户)</span>
            <span v-if="scope.row.cardType=='BUSINESS_ALIPAY_BANK'">支付宝扫码转银行卡(商户)</span>
          </template>
        </el-table-column>
        <el-table-column label="发起用户" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="承兑人" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.acptName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="收款信息" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.bankAccName}}</div>
            <div>{{scope.row.bankName}}</div>
            <div>{{scope.row.bankSubName}}</div>
            <div>{{scope.row.cardUq}}</div>
          </template>
        </el-table-column>
        <el-table-column label="会员账号" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.fastSubName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="交易GAC" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{Number(scope.row.amountGac/10000).toFixed(4)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="取消时间" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.cancelTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="取消原因" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.cancelReasonDesc}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { buyCancelList, exportCancelList } from "@/api/accountManage";
import { Message } from "element-ui";
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
      accountName: "",
      orderId: "",
      pickerdate: date1,
      pickerdate1: date2,
      canclePickerdate: "",
      canclePickerdate1: "",
      fqAccountName: "",
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      // accountTypeList: [
      //   {
      //     value: "",
      //     label: "全部"
      //   },
      //   {
      //     value: "BANK_CARD",
      //     label: "银行卡"
      //   },
      //   {
      //     value: "ALIPAY",
      //     label: "支付宝扫码(个人)"
      //   },
      //   {
      //     value: "BUSINESS_ALIPAY",
      //     label: "支付宝扫码(商户)"
      //   },
      //   {
      //     value: "ALIPAY_BANK",
      //     label: "支付宝转银行卡"
      //   },
      //   {
      //     value: "BUSINESS_ALIPAY_BANK",
      //     label: "支付宝扫码转银行卡(商户)"
      //   },
      //   {
      //     value: "WECHAT",
      //     label: "微信"
      //   },
      //   {
      //     value: "WECHAT_BANK",
      //     label: "微信转银行卡"
      //   },
      //   {
      //     value: "QUICKPASS",
      //     label: "云闪付"
      //   }
      // ],
      // accountType: "",
      listQuery: {
        page: 1,
        limit: 10
      },
      cancelreason: "",
      cardTypeParam: "",
      cancelReason: [
        {
          value: "",
          label: "全部原因"
        },
        {
          value: "11",
          label: "对方账户异常,无法转账"
        },
        {
          value: "12",
          label: "想换一个支付方式"
        },
        {
          value: "10",
          label: "其他原因"
        },
        {
          value: "14",
          label: "操作麻烦,放弃支付"
        },
        {
          value: "2",
          label: "运营后台取消"
        },
        {
          value: "1",
          label: "超时自动取消"
        },
        {
          value: "13",
          label: "填错金额想重新下单"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const param = {
        tradeId: this.orderId,
        addStartDate: this.pickerdate,
        addEndDate: this.pickerdate1,
        cancelStartDate: this.canclePickerdate,
        cancelEndDate: this.canclePickerdate1,
        accountName: this.fqAccountName,
        fastSubName: this.accountName,
        cancelReason: this.cancelreason,
        cardTypeParam: this.cardTypeParam,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      };
      buyCancelList(param)
        .then(response => {
          if (response.data.code === 200) {
            this.list = response.data.data;
            this.total = response.data.page.totalCount;
            setTimeout(() => {
              this.listLoading = false;
            }, 100);
          } else {
            this.listLoading = false;
            Message({
              message: response.data.message,
              type: "error",
              duration: 5 * 1000
            });
          }
        })
        .catch(e => { });
    },
    exportData() {
      // 验证
      if (!this.pickerdate) {
        this.$message({
          type: "error",
          message: "请先选择下单时间"
        });
        return;
      }
      if (!this.pickerdate1) {
        this.$message({
          type: "error",
          message: "请先选择下单时间"
        });
        return;
      }
      if (
        new Date(this.pickerdate).getTime() >
        new Date(this.pickerdate1).getTime()
      ) {
        this.$message({
          type: "error",
          message: "开始日期不能大于结束日期"
        });
        return;
      }
      const params = {
        tradeId: this.orderId,
        addStartDate: this.pickerdate,
        addEndDate: this.pickerdate1,
        cancelStartDate: this.canclePickerdate,
        cancelEndDate: this.canclePickerdate1,
        accountName: this.fqAccountName,
        fastSubName: this.accountName,
        cancelReason: this.cancelreason,
        cardTypeParam: this.cardTypeParam,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      };

      this.getList();
      // 请求后台导出
      exportCancelList(params).then(res => {
        if (res.status === 200) {
          const blob = new Blob([res.data]);
          var elink = document.createElement("a");
          elink.download = "取消记录.xlsx";
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        } else {
          this.$message({
            type: "error",
            message: "抱歉，导出数据失败"
          });
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    /**
     * 查询
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
</style>
