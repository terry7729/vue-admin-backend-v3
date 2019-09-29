<template>
  <div>
    <div class="contaner-box">
      <span class="box-spacing">
        <el-input placeholder="请输入账户名" clearable v-model="searchName"></el-input>
        <el-button type="primary" style="margin-left:10px;" @click="handleSearchClick">查询</el-button>
        <el-button type="primary" style="margin-left:10px;" @click="handleAdd">添加</el-button>
      </span>
    </div>
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="账号">
          <template slot-scope="scope">
            <span>{{scope.row.eosno}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限">
          <template slot-scope="scope">
            <span v-if="scope.row.privlilege===0">超级管理员</span>
            <span v-if="scope.row.privlilege===1">管理员</span>
            <span v-if="scope.row.privlilege===2">客服</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">正常</span>
            <span v-if="scope.row.status===0" style="color:red;">禁用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.created}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="scope.row.name!==loginname">
              <div v-if="scope.row.privlilege===0">
                <label>系统账户</label>
              </div>
              <div v-else-if="scope.row.status===1">
                <el-button size="mini" type="primary" @click="handleDisableClick(scope.row,scope)">禁用</el-button>
                <el-button size="mini" type="primary" style="width:70px;" @click="handleReset(scope.row)">重置密码</el-button>
              </div>
              <div v-else-if="scope.row.status===0">
                <el-button size="mini" type="primary" @click="handleEnableClick(scope.row,scope)">启用</el-button>
                <el-button size="mini" type="primary" style="width:70px;" @click="handleReset(scope.row)">重置密码</el-button>
              </div>
            </div>
            <div v-else>
              <label>当前账户</label>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--添加账户弹出框-->
    <el-dialog title="添加账户" :visible.sync="dialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="accountname">
          <el-input v-model="ruleForm.accountname" minlength="6" maxlength="12" placeholder="请输入4~12位帐号" style="width: 100%;margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入姓名" minlength="2" maxlength="8" style="width: 100%;margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" minlength="8" maxlength="18" type="password" placeholder="请输入长度为8-18位的密码,由特殊字符、数字、字母组成" style="width: 100%;margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-select v-model="value" placeholder="管理员" style="width: 100%;margin-left:0px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitForm('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--禁用确认弹出框-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定要删除账户{{saveaccountname}}({{savename}})吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="disabledClickSure">确 定</el-button>
      </span>
    </el-dialog>

    <!--禁用确认弹出框-->
    <el-dialog title="提示" :visible.sync="enabledDialogVisible" width="30%">
      <span>确定要启用账户{{saveaccountname}}({{savename}})吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="enabledDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="enabledClickSure">确 定</el-button>
      </span>
    </el-dialog>

    <!--重置密码确认弹出框-->
    <el-dialog title="提示" :visible.sync="resetDialogVisible" width="30%">
      <span>确定要重置该账户密码为nc_181028吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="hacdleResetPasswordClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getBankendUserList, disableBackEndUserReq, addBackEndUser, resetBackEndUserPasswd } from '@/api/accountManage'
import storagelib from '@/utils/auth'
import { Message } from 'element-ui'
import { sha256 } from 'js-sha256';
export default {
  data() {
    const validateAccountName = (rule, value, callback) => {
      const regaccount = /^[a-z0-9]{4,12}$/
      if (regaccount.test(value)) {
        callback()
      } else {
        callback(new Error('请输入4~12位小写英文，数字账号'))
      }
    }
    const validateName = (rule, value, callback) => {
      const regname = /[\u4e00-\u9fa5]{2,8}/
      if (regname.test(value)) {
        callback()
      } else {
        callback(new Error('请输入中文姓名'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      const regpwd = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&.(),<>+=*_-]+$)[a-zA-Z\d!@#$%^&.(),<>+=*_-]+$/
      if (regpwd.test(value)) {
        callback()
      } else {
        callback(new Error('请输入长度为8-18位的密码,由特殊字符、数字、字母组成'))
      }
    }
    return {
      loginname: storagelib.fetch('loginParam').accountname,
      searchName: '',
      saveId: '',
      savename: '',
      saveaccountname: '',
      savescope: '',
      tableKey: 0,
      list: null,
      total: null,
      btnLoading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      options: [{
        value: 1,
        label: '管理员'
      }, {
        value: 2,
        label: '客服'
      }],
      value: '',
      dialogVisible: false,
      deleteDialogVisible: false,
      resetDialogVisible: false,
      enabledDialogVisible: false,
      ruleForm: {
        accountname: '',
        username: '',
        password: '',
        permissions: ''
      },
      rules: {
        accountname: [
          { required: true, message: '请输入4~12位小写英文，数字账号', trigger: 'blur', validator: validateAccountName },
          { min: 4, max: 12, message: '请输入4~12位小写英文，数字账号', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入中文姓名', trigger: 'blur', validator: validateName },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入长度为8-18位的密码,由特殊字符、数字、字母组成', trigger: 'blur', validator: validatePassword },
          { min: 8, max: 18, message: '长度在 8 到 18 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      let param = {
        from: this.$store.getters.loginParam.accountname,
        eosno: this.searchName,
        start_page: this.listQuery.page,
        page_num: this.listQuery.limit
      }
      this.listLoading = true;
      getBankendUserList(param).then(response => {
        setTimeout(() => {
          this.listLoading = false
        }, 100)
        if (response.data.code === 200) {
          this.list = response.data.data.users_array
          this.total = response.data.data.total_record_num
        } else {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.listLoading = false
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
    },
    // 弹出当前选中项的提示框
    handleDisableClick(val, scope) {
      this.savescope = scope
      this.saveId = val.id
      this.savename = val.name
      this.saveaccountname = val.eosno
      this.deleteDialogVisible = true
    },
    // 禁用账户确定
    disabledClickSure() {
      const _this = this
      if (this.btnLoading) return;
      this.btnLoading = true;
      disableBackEndUserReq({ from: this.$store.getters.loginParam.accountname, eosno: this.saveaccountname, flag: 0 }).then(res => {

        this.btnLoading = false;
        if (res.data.code === 200) {
          _this.list[_this.savescope.$index].status = 0;
          this.deleteDialogVisible = false
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })

    },
    // 启用账户
    handleEnableClick(val, scope) {
      this.savescope = scope
      this.saveId = val.id
      this.savename = val.name
      this.saveaccountname = val.eosno
      this.enabledDialogVisible = true
    },
    // 启用账户确定
    enabledClickSure() {
      const _this = this
      if (this.btnLoading) return;
      this.btnLoading = true;
      disableBackEndUserReq({ from: this.$store.getters.loginParam.accountname, eosno: this.saveaccountname, flag: 1 }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          _this.list[_this.savescope.$index].status = 1;
          this.enabledDialogVisible = false
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })

      // enableAccount
    },
    // 弹出重置密码提示框
    handleReset(val) {
      this.saveId = val.id
      this.ruleForm.accountname = val.eosno;
      this.resetDialogVisible = true
    },
    // 弹出添加提示框
    handleAdd() {
      // console.log(md5,'----');
      this.dialogVisible = true
    },
    // 重置密码
    hacdleResetPasswordClick() {
      if (this.btnLoading) return;
      this.btnLoading = true;
      resetBackEndUserPasswd({ from: this.$store.getters.loginParam.accountname, eosno: this.ruleForm.accountname }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          Message({
            message: '密码重置成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.resetDialogVisible = false
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })

    },
    // 添加数据
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const saveParam = {
            from: this.$store.getters.loginParam.accountname,
            privilege: this.value || 1,
            passwd: sha256(this.ruleForm.password) || sha256('nc_181028'),
            name: this.ruleForm.username,
            eosno: this.ruleForm.accountname
          }
          if (this.btnLoading) return;
          this.btnLoading = true;
          addBackEndUser(saveParam).then(res => {
            this.btnLoading = false;
            if (res.data.code === 200) {
              this.getList()
              this.$refs[formName].resetFields()
              this.dialogVisible = false
              Message({
                message: '添加账户成功',
                type: 'success',
                duration: 3 * 1000
              })
            } else {
              Message({
                message: res.data.message,
                type: 'error',
                duration: 5 * 1000
              })
            }
          }).catch(() => {
            this.btnLoading = false;
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 查询操作
    handleSearchClick() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
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
