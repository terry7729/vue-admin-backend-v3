<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        <span class="demonstration">操作时间：</span>
        <el-date-picker v-model="pickerdate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间">
        </el-date-picker>
      </span>
      <span class="box-spacing">
        操作类型：
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span class="box-spacing">
        操作人：<el-input placeholder="请输入操作人" v-model="acceptorValue" clearable></el-input>
        <el-button type="primary" @click="handleSubmitClick" style="margin-left:10px;">查询</el-button>
      </span>
    </div>
    <div class="app-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">
            <span>{{scope.row.operator}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作类型">
          <template slot-scope="scope">
            <span v-if="scope.row.logType===1">添加后台账户</span>
            <span v-if="scope.row.logType===2">禁用后台账户</span>
            <span v-if="scope.row.logType===3">重新启用后台账户</span>
            <span v-if="scope.row.logType===4">重置后台账户的密码</span>
            <span v-if="scope.row.logType===5">登录后台账户</span>
            <span v-if="scope.row.logType===6">冻结账户资产</span>
            <span v-if="scope.row.logType===7">解除账户资产冻结</span>
            <span v-if="scope.row.logType===8">承兑人申请审核</span>
            <span v-if="scope.row.logType===9">停用承兑权限</span>
            <span v-if="scope.row.logType===10">重新启用承兑权限</span>
            <span v-if="scope.row.logType===11">修改承兑人信息</span>
            <span v-if="scope.row.logType===12">从承兑人中移除</span>
            <span v-if="scope.row.logType===13">罚款承兑人</span>
            <span v-if="scope.row.logType===14">商家申请审核</span>
            <span v-if="scope.row.logType===15">从商家中移除</span>
            <span v-if="scope.row.logType===16">取消订单</span>
            <span v-if="scope.row.logType===17">重新分配承兑人</span>
            <span v-if="scope.row.logType===18">重启订单</span>
            <span v-if="scope.row.logType===19">将承兑记录设为异常</span>
            <span v-if="scope.row.logType===20">分润</span>
            <span v-if="scope.row.logType===21">对异常承兑记录分润</span>
            <span v-if="scope.row.logType===22">解除承兑冻结</span>
            <span v-if="scope.row.logType===23">放行</span>
            <span v-if="scope.row.logType===24">开启支付通道</span>
            <span v-if="scope.row.logType===25">关闭支付通道</span>
            <span v-if="scope.row.logType===26">解除封禁</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作IP">
          <template slot-scope="scope">
            {{scope.row.ip}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作内容">
          <template slot-scope="scope">
            <span>{{scope.row.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { loglist } from '@/api/accountManage'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      pickerdate: '',
      pickerdate1: '',
      acceptorValue: '',
      listLoading: false,
      tableKey: 0,
      list: null,
      total: null,
      listQuery: {
        pageNo: 1,
        limit: 10
      },
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '添加后台账户'
      }, {
        value: '2',
        label: '禁用后台账户'
      }, {
        value: '3',
        label: '重新启用后台账户'
      }, {
        value: '4',
        label: '重置后台账户的密码'
      }, {
        value: '5',
        label: '登录后台账户'
      }, {
        value: '6',
        label: '冻结账户资产'
      }, {
        value: '7',
        label: '解除账户资产冻结'
      }, {
        value: '8',
        label: '承兑人申请审核'
      }, {
        value: '9',
        label: '停用承兑权限'
      }, {
        value: '10',
        label: '重新启用承兑权限'
      }, {
        value: '11',
        label: '修改承兑人信息'
      }, {
        value: '12',
        label: '从承兑人中移除'
      }, {
        value: '13',
        label: '罚款承兑人'
      }, {
        value: '14',
        label: '商家申请审核'
      }, {
        value: '15',
        label: '从商家中移除'
      }, {
        value: '16',
        label: '取消订单'
      }, {
        value: '17',
        label: '重新分配承兑人'
      }, {
        value: '18',
        label: '重启订单'
      }, {
        value: '19',
        label: '将承兑记录设为异常'
      }, {
        value: '20',
        label: '分润'
      }, {
        value: '21',
        label: '对异常承兑记录分润'
      }, {
        value: '22',
        label: '解除承兑冻结'
      }, {
        value: '23',
        label: '放行'
      }, {
        value: '24',
        label: '开启支付通道'
      }, {
        value: '25',
        label: '关闭支付通道'
      }, {
        value: '26',
        label: '解除封禁'
      }],
      value: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        startDate: this.pickerdate,
        endDate: this.pickerdate1,
        logType: this.value,
        operator: this.acceptorValue,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.limit
      }
      this.listLoading = true;
      loglist(param).then(response => {
        if (response.data.code === 200) {
          this.list = response.data.data.content
          this.total = response.data.data.totalElements
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
      }).catch(() => {
        this.listLoading = false;
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleSubmitClick() {
      this.listQuery.pageNo = 1
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
