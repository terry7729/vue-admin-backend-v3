<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing">
        <span> 角色名称：</span>
        <span>
          <el-input placeholder="请输入角色名称" clearable v-model="searchName"></el-input>
        </span>
      </span>
      <span class="box-spacing">
        <el-button type="primary" style="margin-left:10px;" @click="handleSearchClick">查询</el-button>
      </span>
      <span class="box-spacing" style="float:right;">
        <el-button type="primary" @click="handleAdd">添加角色</el-button>
      </span>
    </div>
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="角色名称">
          <template slot-scope="scope">
            <span>{{scope.row.accountname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            3333
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text" @click="detailRole(scope.row)">查看权限</el-button>
            <el-button type="text" @click="editRole(scope.row)">修改</el-button>
            <el-button type="text">启用</el-button>
            <el-button type="text">禁用</el-button>
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
import { getQueryAccount, disableAccount, enableAccount, creatAccount, resetAccount } from '@/api/accountManage'
import storagelib from '@/utils/auth'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
    }
  },
  created() {
    // this.$alert('已有账户绑定该角色，请先解除绑定再禁用', '温馨提示', {
    //   confirmButtonText: '确定',
    //   callback: action => { }
    // });
    this.getList()
  },
  methods: {
    queryData() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getQueryAccount({ accountname: this.searchName, pageNo: this.listQuery.page, pageSize: this.listQuery.limit }).then(response => {
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
      })
    },
    /**
     * 编辑角色
     */
    editRole(row) {
      this.$router.push({
        path: "role-manage/role-edit"
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
  }
}
</script>
<style scoped>
.el-input {
  width: auto;
  margin-left: 10px;
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
