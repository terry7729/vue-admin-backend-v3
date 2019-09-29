<template>
  <div class="select-dialog">
    <el-button type="text" class='btn-dialog' @click="dialogTableVisible = true">选择承兑人</el-button>

  <el-dialog title="选择承兑人" :visible.sync="dialogTableVisible"  @open="dialogOpen">
    <el-form :model="formData" ref="formDataRef" :show-message='false' label-suffix='：' label-width="85px" :inline="true" label-position="rigth">
              <el-form-item label="账户名" prop="username">
                <el-input v-model="formData.username" placeholder="请输入承兑人账户名"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="margin-left:20px;" type="primary" @click="getTableList()">查询</el-button>
                <el-button @click="resetClick">重置</el-button>
              </el-form-item>
    </el-form>
    <dynamic-table class="app-container" ref="dynamicTableRef" :option="tableOption" :requestData="formData" :requestTableList="requestTableList"
    :selectRowList.sync="selectRowListCopy"></dynamic-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import request from '@/utils/request'
import DynamicTable from '@/components/DynamicTable'
import { Message } from 'element-ui'
import { queryUser, alterUserStatus } from '@/api/user'
const formDataDefault = {
        username: '',
        roleName: ''
        }
export default {
  name: "selectAcptDialog",
  components: {
    DynamicTable
  },
  watch: {
      selectRowListCopy(val) {
        this.$emit("update:selectRowList", this.selectRowListCopy)
      }
    },
  props: {
    formData: {
      type: Object,
      default: () => {
        return formDataDefault;
      }
    },
    selectRowList: {  //  所有选中的行
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      selectRowListCopy: [],
      /**
       * 分组名称字典
       */
      roleNameList: [
        {
          'label': '普通承兑人',
          'value': 'ORDINARY'
        },
        {
          'label': '承兑人',
          'value': 'ACCEPTER'
        },
        {
          'label': '商家',
          'value': 'BUSINESS'
        }
      ],
      dialogTableVisible: false,
      /**
       * 表格数据请求
       */
      requestTableList: queryUser,
      /**
       * 动态表单基本配置
       */
      tableOption: {}
    };
  },
  created() {
    console.log('formData:', this.formData);
    
  },
  mounted() {
    this.selectRowListCopy = Object.assign([], this.selectRowList)
    console.log('formData:', this.formData);
    this.tableOption = {
        tableData: [],
        tableLoading: false,
        isIndex: false,
        isPage: true,
        checkTable: true,
        tableConfig: [
          {prop: 'userName', label: '账户名'},
          {prop: 'statusDesc', label: '保证金'},
          {prop: 'roleNameDesc', label: '联系人'}
        ]
      }
  },
  methods: {
    dialogOpen() {
      this.selectRowListCopy = Object.assign([], this.selectRowList)
      this.$refs['dynamicTableRef'] && this.$refs['dynamicTableRef'].dialogOpen()
    },
    /**
     * 关闭弹窗
     */
    goMatchGroupConfig(row, index) {
      this.dialogTableVisible = false
      this.$emit('user:select:update', val)
    },
    /**
     * 请求列表第一页数据
     */
    getTableList(pageNo) {
      this.formData.pageNo = pageNo || 1
      this.$refs['dynamicTableRef'].getTableList()
    },
    /**
     * 重置
     */
    resetClick() {
     // debugger
      this.$refs['formDataRef'].resetFields()
    },
  }
};
</script>

<style lang="scss" scoped>
  .select-dialog{
    display: inline-block;
    .btn-dialog{
      margin-left: 15px;
    }
  }
  
    /** ********************表单********************************** */
    .el-form-item .el-form-item {
        margin-bottom: 22px;
    }
</style>
