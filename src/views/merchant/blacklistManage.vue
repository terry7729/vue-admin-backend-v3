<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing">
        账户名：
        <el-input placeholder="请输入账户名" v-model="listQuery.accountName" clearable></el-input>
        商家名称：
        <el-input placeholder="请输入商家名称" v-model="listQuery.merchantName" clearable></el-input>
        <el-button type="primary" @click="queryData()" style="margin-left:10px;">查询</el-button>
      </span>
      <span style="float:right;">
        <el-button type="primary" @click="showblacklistModal()">添加</el-button>
      </span>
    </div>
    <div class="app-container">
      <el-table :data="list" v-loading="tableLoading" border fit highlight-current-row>
        <el-table-column align="center" label="账户名">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商家名称">
          <template slot-scope="scope">
            <span>{{scope.row.nickName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人">
          <template slot-scope="scope">
            <span>{{scope.row.contact}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteBlacklist(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!--查看私钥-->
    <el-dialog title="新增黑名单" :visible.sync="blacklistModal" width="640px">
      <div>
        <div style="margin-bottom:20px;text-align:center;">
          <span style="display:inline-block;width:70px;text-align:left;">商家账号：</span>
          <el-select v-model="blacklistObj.merchantName" filterable remote :remote-method="queryMerchantSelectList" placeholder="选择/搜索账户" style="width:300px;">
            <el-option v-for="item in merchantSelectList" :key="item.merchantName" :value="item.merchantName" :label="item.merchantName">{{item.merchantName}}-{{item.merchantNick}}</el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="default" @click="blacklistModal=false;">取消</el-button>
        <el-button type="primary" @click="addSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryBlacklist, addBlacklist, deleteBlacklist, queryMerchantSelectList } from "@/api/merchat";
export default {
  data() {
    return {
      list: [],
      total: 0,
      tableLoading: false,
      tableLoadingTime: null,

      // 查询条件
      listQuery: {
        accountName: '',
        merchantName: '',
        page: 1,
        limit: 10
      },

      // 编辑
      blacklistModal: false,
      merchantSelectList: [],// 选择的商家列表
      blacklistObj: {
        merchantName: '',
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /**
     * 查询类别
     */
    queryData() {
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      let param = {
        userName: this.listQuery.accountName,
        userNick: this.listQuery.merchantName,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
      }
      this.tableLoading = true;
      queryBlacklist(param).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.list;
          this.total = res.data.data.totalRecord;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
        // 加载提示
        if (this.tableLoadingTime) { clearTimeout(this.tableLoadingTime) }
        this.tableLoadingTimer = setTimeout(() => {
          this.tableLoading = false;
        }, 300);
      }).catch(_ => {
        this.tableLoading = false;
      })
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
     * 新增
     */
    showblacklistModal() {
      this.editFlag = 'add';
      this.blacklistObj.merchantName = '';
      this.blacklistModal = true;
      this.queryMerchantSelectList();
    },
    queryMerchantSelectList(accountName) {
      queryMerchantSelectList({
        eosno: accountName,
        pageNo: 1,
        pageSize: 999,
      }).then(res => {
        if (res.data.code == 200) {
          this.merchantSelectList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
          });
        }
      })
    },
    addSubmit() {
      if (!this.blacklistObj.merchantName) {
        this.$message({
          type: "error",
          message: "请选择商家账号"
        })
        return;
      }
      // 验证通过
      addBlacklist({
        userName: this.blacklistObj.merchantName,
      }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.blacklistModal = false;
          this.getList();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
      })
    },

    /**
     * 删除操作
     */
    deleteBlacklist(row) {
      let text = "确定要移除商户 " + row.userName + " 吗？";
      this.$confirm(text, '温馨提示', {
        type: 'warning'
      }).then(() => {
        deleteBlacklist({
          userName: row.userName
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "操作成功"
            })
            this.getList();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            })
          }
        })
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
