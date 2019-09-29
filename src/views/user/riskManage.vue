<template>
  <div>
    <!-- 查询条件 -->
    <div class="container_box" style="margin-top:10px;">
      <span style="margin-right:10px;">
        封禁时间：
        <el-date-picker type="datetime" v-model="listQuery.startDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择开始时间"></el-date-picker>
        到
        <el-date-picker v-model="listQuery.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间"></el-date-picker>
      </span>
      <span style="margin-right:10px;">
        封禁类型：<span>
          <el-select placeholder="请选择封禁类型" v-model="listQuery.forbidType">
            <el-option value="" label="全部"></el-option>
            <el-option value="0" label="IP地址封禁"></el-option>
            <el-option value="1" label="会员封禁"></el-option>
          </el-select>
        </span>
      </span>
      <span style="margin-right:10px;">
        状态：<span>
          <el-select placeholder="请选择状态" v-model="listQuery.forbidLevel">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="永久封禁"></el-option>
            <el-option value="2" label="封禁1小时"></el-option>
            <el-option value="3" label="封禁2小时"></el-option>
          </el-select>
        </span>
      </span>

    </div>
    <div class="container_box" style="margin-top:10px;">
      <span style="margin-right:10px;">
        会员名/IP：<span>
          <el-input placeholder="请输入会员名或者IP地址" v-model="listQuery.forbidSubject"></el-input>
        </span>
      </span>
      <span style="margin-right:10px;">
        封禁内容：<span>
          <el-input placeholder="模糊搜索封禁的内容" v-model="listQuery.forbidContent"></el-input>
        </span>
      </span>
      <span>
        <el-button type="primary" @click="queryData()">查询</el-button>
        <el-button type="default" @click="resetData()">重置</el-button>
      </span>
    </div>
    <!-- 表格数据 -->
    <div class="tab-container">
      <el-table :data="list" border fit highlight-current-row>
        <el-table-column align="center" label="序号" type="index">
        </el-table-column>
        <el-table-column align="center" label="会员名/IP地址">
          <template slot-scope="scope">
            {{scope.row.forbidSubject||"-"}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="封禁内容">
          <template slot-scope="scope">
            {{scope.row.forbidContent||"-"}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="封禁类型">
          <template slot-scope="scope">
            <span v-if="scope.row.forbidType==0">IP地址封禁</span>
            <span v-if="scope.row.forbidType==1">会员封禁</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.forbidLevel==1">永久封禁</span>
            <span v-if="scope.row.forbidLevel==2">封禁1小时</span>
            <span v-if="scope.row.forbidLevel==3">封禁2小时</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="封禁时间">
          <template slot-scope="scope">
            {{scope.row.forbidStartTime||"-"}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.forbidStatus==0" disabled>已解封</el-button>
            <el-button type="text" v-if="scope.row.forbidStatus==1" @click="riskRecordUnban(scope.row)">解封</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { riskRecordList, riskRecordUnban } from '@/api/user.js'
export default {
  name: 'risk',
  components: {},
  data() {
    return {
      // 表格数据
      list: null,
      total: null,

      // 查询条件
      listQuery: {
        startDate: '', // 封禁开始时间
        endDate: '',// 封禁结束时间
        forbidType: '',// 封禁类型
        forbidLevel: '',// 状态
        forbidSubject: '',// 会员名/IP
        forbidContent: '',// 封禁内容
        page: 1,
        limit: 10
      },
    }
  },
  created() {
    // 查询列表
    this.queryData();
  },
  methods: {
    /**
     * 点击查询
     */
    queryData() {
      this.listQuery.page = 1
      this.getList()
    },
    /**
     * 清空查询数据
     */
    resetData() {
      this.listQuery = {
        startDate: '', // 封禁开始时间
        endDate: '',// 封禁结束时间
        forbidType: '',// 封禁类型
        forbidStatus: '',// 状态
        forbidSubject: '',// 会员名/IP
        forbidContent: '',// 封禁内容
        page: 1,
        limit: 10
      }
    },
    /**
     * 点击按钮查询的
     */
    getList() {
      let params = {
        startDate: this.listQuery.startDate, // 封禁开始时间
        endDate: this.listQuery.endDate,// 封禁结束时间
        forbidType: this.listQuery.forbidType,// 封禁类型
        forbidLevel: this.listQuery.forbidLevel,// 状态
        forbidSubject: this.listQuery.forbidSubject,// 会员名/IP
        forbidContent: this.listQuery.forbidContent,// 封禁内容
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
      }
      riskRecordList(params).then(res => {
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
     * 解封
     */
    riskRecordUnban(row) {
      this.$confirm('是否确认解除封禁？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        riskRecordUnban({ id: row.id }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          }
        })
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
    /**
    * 转换钱
    */
    convertMoney(num) {
      return Number(num / 10000).toFixed(2);
    },
  }
}
</script>
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
  width: 210px;
}
</style>
