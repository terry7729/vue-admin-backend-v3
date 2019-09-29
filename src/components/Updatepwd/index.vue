<template>
  <div>
    <el-dialog
      title="重置密码"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldpwd">
          <el-input v-model="ruleForm.oldpwd" type="password" minlength="6" maxlength="18" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd" >
          <el-input v-model="ruleForm.newpwd" type="password" minlength="8" maxlength="18"  placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="再次确认" prop="againpwd">
          <el-input v-model="ruleForm.againpwd" type="password" minlength="8" maxlength="18" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
          <el-button type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { modifyBackEndUserPasswd } from '@/api/login'
import {getPassSHA256} from '@/utils/index'
import { Message } from 'element-ui'
export default {
  data() {
    const validatepwd = (rule, value, callback) => {
      if (value === this.ruleForm.newpwd) {
        callback()
      } else {
        callback(new Error('请确认密码是否一致'))
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
      dialogVisible: false,
      ruleForm: {
        oldpwd: '',
        newpwd: '',
        againpwd: ''
      },
      rules: {
        oldpwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在6个字符', trigger: 'blur' }
        ],
        newpwd: [
          { required: true, message: '请输入长度为8-18位的密码,由特殊字符、数字、字母组成', trigger: 'blur', validator: validatePassword },
          { min: 8, max: 18, message: '长度在 8 到 18 个字符', trigger: 'blur' }
        ],
        againpwd: [
          { required: true, message: '请再次输入新密码', trigger: 'blur', validator: validatepwd },
          { min: 8, max: 18, message: '长度在 8 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyBackEndUserPasswd({ eosno: this.$store.getters.loginParam.accountname, new_Passwd: getPassSHA256(this.ruleForm.newpwd).password, old_passwd: getPassSHA256(this.ruleForm.oldpwd).password }).then(res => {
            if (res.data.code === 200) {
              Message({
                message: '修改成功',
                type: 'success',
                duration: 5 * 1000
              })
              const userName = this.$store.getters.loginParam.accountname
              setTimeout(function() {
                _this.$store.dispatch('LogOut', { username: this.$store.getters.loginParam.accountname }).then(() => {
                  location.reload()
                })
              }, 1000)
            } else {
              Message({
                message: res.data.message,
                type: 'error',
                duration: 5 * 1000
              })
            }
          }).catch(res => {
            Message({
              message: '请求超时,请联系运维',
              type: 'error',
              duration: 5 * 1000
            })
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    handleShowDialog() {
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped>

</style>
