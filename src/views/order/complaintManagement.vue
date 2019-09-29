<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing" style="margin-left:0px;">
        处理状态:
        <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </span>
      <span class="box-spacing">
        <span class="demonstration">申诉时间:</span>
        <el-date-picker
          v-model="pickerdate"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </span>
      <span class="box-spacing">
        申诉用户:<el-input placeholder="请输入账户名" clearable></el-input>
      </span>
      <span class="box-spacing">
        用户联系电话:<el-input placeholder="请输入账户名" clearable></el-input>
        <el-button type="primary" style="margin-left:10px;">查询</el-button>
      </span>
    </div>
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="申诉用户">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==='normal'">正常</span>
            <span v-if="scope.row.type==='freeze'">已冻结</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申诉原因">
          <template slot-scope="scope">
            <span v-if="scope.row.reason==='notpay'">对方未付款</span>
            <span v-if="scope.row.reason==='non-release'">对方未放行</span>
            <span v-if="scope.row.reason==='fraud'">对方存在欺诈行为</span>
            <span v-if="scope.row.reason==='other'">其他原因</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.phonenumber}}</span>
          </template>
        </el-table-column>
          <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申诉时间">
          <template slot-scope="scope">
            <span>{{scope.row.complaintTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==='process'" style="color:red;">待处理</span>
            <span v-if="scope.row.status==='processing'" >处理中</span>
            <span v-if="scope.row.status==='processed'" >已处理</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="normal" @click="handleUpdate(scope.row)">标记为处理中</el-button>
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
import { complaintManageList } from '@/api/accountManage'
export default {
  name: 'complaintManagement',
  data() {
    return {
      pickerdate: '',
      username: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      showReviewer: false,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      complaintManageList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 100)
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleUpdate(id) {
    }
  }
}
</script>

<style>
.el-input{
    width: auto;
    margin-left: 10px;
  }
  .contaner-box{
    margin: 30px 30px 0 30px;
    overflow: hidden;
  }
  .box-spacing{
    display: block;
    margin-left: 20px;
    float: left;
  }
  .tab-container{
    margin: 20px 30px 30px 30px;
  }
</style>
