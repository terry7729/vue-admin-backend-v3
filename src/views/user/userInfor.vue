<template>
  <div>
    <div class="contaner-box">
      <div class="block" style="float:left">
        <span class="demonstration">创建时间:</span>
        <el-date-picker v-model="pickerdate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="pickerdate1" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间">
        </el-date-picker>
      </div>
      <div style="float:left; margin-left:20px;">
        <span>账户名:</span>
        <el-input placeholder="请输入账户名" v-model="accountUserName" clearable></el-input>
      </div>
      <div style="float:left; margin-left:20px;">
        <span>昵称:</span>
        <el-input placeholder="请输入昵称" v-model="nickName" clearable></el-input>
      </div>
      <div style="float:left; margin-left:20px;">
        <span>手机号码:</span>
        <el-input placeholder="请输入手机号" v-model="telePhone" clearable></el-input>
        <el-button type="primary" @click="searchClick">查询</el-button>
      </div>
    </div>
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户名">
          <template slot-scope="scope">
            <span>{{scope.row.eosno}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="昵称">
          <template slot-scope="scope">
            <span>{{scope.row.nick_name || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.userstatus==='normal'">
              <span>正常</span>
            </div>
            <div v-else-if="scope.row.userstatus==='black_list'">
              <span>停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户分组">
          <template slot-scope="scope">
            <div v-if="scope.row.role===1">
              <span>承兑人</span>
            </div>
            <div v-if="scope.row.role===2">
              <span>商家</span>
            </div>
            <div v-if="scope.row.role===3">
              <span>系统用户</span>
            </div>
            <div v-if="scope.row.role===0">
              <span>普通用户</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="GAC余额">
          <template slot-scope="scope">
            <span>{{Number(scope.row.gac_balance/10000).toFixed(4) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" style="display:none" size="mini">详情</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.userstatus==='normal'" :loading="scope.row.flag" @click="handleFrozen(scope.row,scope)">冻结</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.userstatus==='black_list'" :loading="scope.row.flag" @click="handleUnFrozen(scope.row,scope)">解冻</el-button>
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
import { getUsersInfo, blacklist } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'tab',
  data() {
    return {
      pickerdate: '',
      pickerdate1: '',
      accountUserName: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      nickName: '',
      telePhone: '',
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 用户信息显示列表
     */
    getList() {
      const params = {
        from: this.$store.getters.loginParam.accountname,
        create_time_min: this.pickerdate,
        create_time_max: this.pickerdate1,
        eosno: this.accountUserName,
        mobileno: this.telePhone,
        nickname: this.nickName,
        start_page: this.listQuery.page,
        page_num: this.listQuery.limit
      }
      let saveItem = []
      getUsersInfo(params).then(res => {
        let saveList = { flag: false }
        if (res.data.code === 200) {
          if (res.data.data.users_array && res.data.data.users_array.length > 0) {
            res.data.data.users_array.map((item, index) => {
              saveItem.push({ ...item, ...saveList })
            })
          }
          this.list = saveItem
          this.total = res.data.data.total_record_num
          setTimeout(() => {
            this.listLoading = false
          }, 100)
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
     * 查询操作
     */
    searchClick() {
      this.listQuery.page = 1
      this.getList()
    },
    /**
     * 冻结操作
     */
    handleFrozen(val, scope) {
      const _this = this
      _this.list[scope.$index].flag = true
      const param = {
        from: this.$store.getters.loginParam.accountname,
        eosno: val.eosno,
        flag: 1
      }
      blacklist(param).then(res => {
        if (res.data.code === 200) {
          _this.list[scope.$index].flag = false
          _this.list[scope.$index].userstatus = 'black_list'
        } else {
          _this.list[scope.$index].flag = false
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
     * 解冻操作
     */
    handleUnFrozen(val, scope) {
      const _this = this
      _this.list[scope.$index].flag = true
      const param = {
        from: this.$store.getters.loginParam.accountname,
        eosno: val.eosno,
        flag: 0
      }
      blacklist(param).then(res => {
        if (res.data.code === 200) {
          _this.list[scope.$index].flag = false
          _this.list[scope.$index].userstatus = 'normal'
        } else {
          _this.list[scope.$index].flag = false
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
.tab-container {
  margin: 20px 30px 30px 30px;
}
</style>
