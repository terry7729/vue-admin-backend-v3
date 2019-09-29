<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        <span style="width:80px;display:inline-block;text-align:right;">审核状态：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        <span class="demonstration"><span style="width:80px;display:inline-block;text-align:right;">申请时间：</span></span>
        <el-date-picker v-model="pickerdate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间">
        </el-date-picker>
      </span>
      <span class="box-spacing">
        <span style="width:80px;display:inline-block;text-align:right;">申请用户：</span>
        <el-input placeholder="请输入账户名" v-model="acceptorValue" clearable></el-input>
        <el-button type="primary" @click="handleSubmitClick" style="margin-left:10px;">查询</el-button>
      </span>
    </div>
    <div class="app-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="申请用户">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.fullName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="保证金(GAC)">
          <template slot-scope="scope">
            <span>{{scope.row.applyBzzGac | cash}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus==='WAITCONFIRM'">待审核</span>
            <span v-if="scope.row.auditStatus==='PASS'">通过</span>
            <span v-if="scope.row.auditStatus==='REMOVE'">通过</span>
            <span v-if="scope.row.auditStatus==='NOPASS'">不通过</span>
             <span v-if="scope.row.auditStatus==='NOTPASS'">不通过</span>
            <span v-if="scope.row.auditStatus==='ORDER_FAILED'">操作失败</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.applyTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus==='WAITCONFIRM'">
              <el-button type="primary" size="mini" @click="handlePassClick(scope.row,scope)">通过</el-button>
              <el-button size="mini" type="primary" @click="handleNoPassClick(scope.row,scope)">不通过</el-button>
            </div>
            <!--
             <el-button size="mini" type="primary" @click="handleDelete(scope.row,scope)">移除</el-button>
             -->
            <div v-if="scope.row.auditStatus==='PASS'">
              <label style="color:#ccc">已审核</label>
            </div>
            <div v-if="scope.row.auditStatus==='NOPASS'">
              <label style="color:#ccc">已审核</label>
            </div>
             <div v-if="scope.row.auditStatus==='NOTPASS'">
              <label style="color:#ccc">已审核</label>
            </div>
            <div v-if="scope.row.auditStatus==='REMOVE'">
              <label style="color:#ccc">已审核</label>
            </div>
            <div v-if="scope.row.auditStatus==='ORDER_FAILED'">
              <label style="color:#ccc">已审核</label>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getNeedReviewAccepterList, reviewAccepter } from '@/api/acceptor'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      pickerdate: '',
      pickerdate1: '',
      acceptorValue: '',
      username: '',
      tableKey: 0,
      list: [],
      total: null,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        limit: 10
      },
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 'WAITCONFIRM',
        label: '待审核'
      }, {
        value: 'PASS',
        label: '通过'
      }, {
        value: 'NOPASS',
        label: '不通过'
      }],
      value: ''
    }
  },
  filters: {
    cash(money) {
      return (Number(money / 10000) + '').length >= 4 ? (Number(money / 10000)) : money / 10000 + '万'
    },
  },
  created() {


    this.getList()
  },

  methods: {
    /*
    //移除承兑人
    handleDelete(row, scope){
      removeAccepter({from:this.$store.getters.loginParam.accountname,accepter:row.userName}).then(res=>{
        this.getList()
        if(res.data.code===200){
          this.getList()
          this.$message({
            message: '移除成功',
            type: 'success'
          })
        }else{
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    */

    /**
     * 承兑人列表显示
     */
    getList() {
      const _this = this
      const param = {
        eosno: _this.$store.getters.loginParam.accountname,
        start_page: this.listQuery.pageNo,
        page_num: this.listQuery.limit,
        status: this.value,
        begin_time: this.pickerdate,
        end_time: this.pickerdate1,
        accepte_no: this.acceptorValue
      }
      this.listLoading = true;
      getNeedReviewAccepterList(param).then(res => {
        this.listLoading = false;
        if (res.data.code === 200) {
          _this.list = res.data.data.apply_accepter_list
          _this.total = res.data.data.total_record_num
        } else {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.listLoading = false;
      })
    },
    /**
     * 查询承兑人
     */
    handleSubmitClick() {
      this.listQuery.pageNo = 1
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
     * 当前页面
     */
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    /**
     * 审核通过操作
     */
    handlePassClick(param, scope) {
      const _this = this
      const params = {
        from: this.$store.getters.loginParam.accountname,
        orderid: scope.row.OrderNO,
        pass: "true"
      }
      reviewAccepter(params).then(res => {
        let saveList = { flag: false }
        if (res.data.code === 200) {
          _this.list[scope.$index].auditStatus = 'PASS'
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
    /**
     * 审核不通过操作
     */
    handleNoPassClick(param, scope) {
      const _this = this
      const params = {
        from: this.$store.getters.loginParam.accountname,
        orderid: scope.row.OrderNO,
        pass: "false"
      }
      reviewAccepter(params).then(res => {
        if (res.data.code === 200) {
          _this.list[scope.$index].auditStatus = 'NOPASS'
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
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
