<template>
<div>
  <!--
  <div class="contaner-box">
      <el-button type="primary" @click="createNewGrounp">新建分组</el-button>
  </div>
  -->
  <div class="tab-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分组名称">
          <template slot-scope="scope">
              <span v-if="scope.row.classesName==='ORDINARY'">普通用户</span>
              <span v-if="scope.row.classesName==='ACCEPTER'" >承兑人</span>
              <span v-if="scope.row.classesName==='BUSINESS'" >商家</span>
            </template>
        </el-table-column>
        <el-table-column align="center" label="转账手续费">
          <template slot-scope="scope">
            <span>{{(scope.row.outCharge)+"%"}}</span>
          </template>
        </el-table-column>
       <el-table-column align="center" label="收款手续费">
          <template slot-scope="scope">
            <span>{{(scope.row.inCharge)+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="买币手续费">
          <template slot-scope="scope">
            <span>{{(scope.row.buyCharge)+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="卖币手续费">
          <template slot-scope="scope">
            <span>{{(scope.row.sellCharge)+"%"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="特权">
          <template slot-scope="scope">
            <span v-if="scope.row.privilege==0">无</span>
            <span v-if="scope.row.privilege==1">免收款方手续费</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEditCLick(scope.row,scope)">编辑</el-button>
            <!--
            <el-button size="mini"  type="info" disabled>删除</el-button>
            -->
          </template>
        </el-table-column>
      </el-table>
  </div>
  <!--新建编辑弹出框-->
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="ruleForm.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="转账手续费" >
        <el-input v-model="ruleForm.outCharge" placeholder="0%"></el-input>
      </el-form-item>
      <el-form-item label="收款手续费" prop="getfee">
        <el-input v-model="ruleForm.inCharge" placeholder="0%"></el-input>
      </el-form-item>
      <el-form-item label="买币手续费" prop="buyfee">
        <el-input v-model="ruleForm.buyCharge" placeholder="0%"></el-input>
      </el-form-item>
      <el-form-item label="卖币手续费" prop="sellfee">
        <el-input v-model="ruleForm.sellCharge" placeholder="0%"></el-input>
      </el-form-item>
      <el-form-item label="特权" prop="sellfee">
        <el-checkbox v-model="checkedBox">免收款手续费</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!--删除确认弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>确定要删除该分组吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

</div>
</template>
<script>
import { listUserClasses, editUserClasses } from '@/api/user'
import { Message } from 'element-ui'
export default {
  name: 'userGroup',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogVisible: false,
      deleteDialogVisible: false,
      dialogTitle: '',
      filePath: '',
      checkedBox: false,
      saveValId: '',
      chkprivilege: 0,
      ruleForm: {
        name: '',
        outCharge: '',
        inCharge: '',
        buyCharge: '',
        sellCharge: ''
      },
      rules: {
        outCharge: [
          { required: true, message: '请输入转账手续费', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '请输入正确的转账手续费',
            trigger: 'blur'
          }
        ],
        inCharge: [
          { required: true, message: '请输入收款手续费', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '请输入正确的收款手续费',
            trigger: 'blur'
          }
        ],
        buyCharge: [
          { required: true, message: '请输入买币手续费', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '请输入正确的买币手续费',
            trigger: 'blur'
          }
        ],
        sellCharge: [
          { required: true, message: '请输入卖币手续费', trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: '请输入正确的卖币手续费',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      listUserClasses().then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.UserClassesList
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.name === '普通用户') {
            this.ruleForm.name = 'ORDINARY'
          } else if (this.ruleForm.name === '承兑人') {
            this.ruleForm.name = 'ACCEPTER'
          } else {
            this.ruleForm.name = 'BUSINESS'
          } if (this.checkedBox) {
            this.chkprivilege = 1
          } else {
            this.chkprivilege = 0
          }
          const param = {
            id: this.saveValId,
            buyCharge: parseFloat(this.ruleForm.buyCharge),
            classesName: this.ruleForm.name,
            inCharge: parseFloat(this.ruleForm.inCharge),
            outCharge: parseFloat(this.ruleForm.outCharge),
            privilege: this.chkprivilege,
            sellCharge: parseFloat(this.ruleForm.sellCharge)
          }
          editUserClasses(param).then(res => {
            if (res.data.code === 200) {
              this.getList()
              this.dialogVisible = false
              Message({
                message: '修改成功',
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
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },

    handleEditCLick(val, scope) {
      this.saveValId = val.id
      this.dialogTitle = '编辑分组'
      if (val.classesName === 'ORDINARY') {
        this.ruleForm.name = '普通用户'
      } else if (val.classesName === 'ACCEPTER') {
        this.ruleForm.name = '承兑人'
      } else {
        this.ruleForm.name = '商家'
      }
      if (val.privilege === 0) {
        this.checkedBox = false
      } else {
        this.checkedBox = true
      }
      this.ruleForm.outCharge = val.outCharge + '%'
      this.ruleForm.inCharge = val.inCharge + '%'
      this.ruleForm.buyCharge = val.buyCharge + '%'
      this.ruleForm.sellCharge = val.sellCharge + '%'
      this.dialogVisible = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
    /*
    createNewGrounp() {
      this.dialogTitle = '新建分组'
      this.dialogVisible = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 点击删除按钮弹出删除确认对话框
    handleDelete(val) {
      this.deleteDialogVisible = true
    }
    */
  }
}
</script>
<style scoped>
.contaner-box {
  margin: 30px 30px 0 30px;
  overflow: hidden;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
</style>
