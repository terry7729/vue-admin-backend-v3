<template>
  <div class="box-table">
    <el-row :gutter="20" v-if="option.checkTable">
      <el-col :span="16">已选：{{selectRowListCopy.length}}条</el-col>
      <el-col :span="8" style="text-align:right;"><el-button type="text" @click="toggleSelection()">清空已选</el-button></el-col>
    </el-row>
    <el-table
      :data="option.tableDataList"
      size="small"
      v-loading="option.tableLoading"
      ref="tableRef"
      @selection-change="handleSelectionChange"
      @select-all="handleSelectAll"
      @select="handleSelect"
      border fit highlight-current-row>
      <!-- 通过配置项循环出列表column -->
      <el-table-column
        type="index"
        label="序号"
        v-if="option.isIndex"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column type="selection" width="55" v-if="option.checkTable"></el-table-column>
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        v-for="(item, index) in option.tableConfig"
        :key="index"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="item.btn">
            <el-button
              size="mini"
              v-for="(btnItem, index) in item.btnOptions"
              :type="btnItem.btnType ? btnItem.btnType : 'text'"
              @click="btnItem.handler(scope.row, scope.$index)"
              v-show="btnItem.condition?btnItem.condition(scope.row) && btnItem.show:btnItem.show"
              :key="index"
            >{{ btnItem.statusBtn ? btnItem.name(scope.row, scope.$index) : btnItem.name }}</el-button>
          </template>
          <div v-else-if="item.dictList">
            {{ scope.row[item.prop] | valueToLabel(item.dictList, scope.row[item.parentProp]) }}
          </div>
          <div v-else-if="item.combo">
            {{ getComboText(scope.row,item.prop) }}
          </div>
          <div v-else-if="item.gac">
            {{Number(scope.row[item.prop]/10000).toFixed(4) }}
          </div>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="option.isPage" style="overflow: hidden;padding-top: 24px;">
      <el-pagination
        style="float:right"
        background
        :page-sizes="[10, 20, 30, 50]"
        @current-change="pageChange"
        @size-change="sizeChange"
        :current-page="requestData.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalCount"
        :page-size="page.pageSize"
      ></el-pagination>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import request from '@/utils/request'
import { Message } from 'element-ui'
const optionDefault = {
          tableDataList: [],
          isIndex: true,
          isPage: true,
          tableLoading: false,
          tableConfig: [
            {
              prop: "name",
              label: "名称"
            }
          ],
          isInitRequest: false // 组件初始化后是否不主动查询，默认false主动查询
        }
export default {
  name: "dynamicTable",
  watch: {
      selectRowListCopy(val) {
        this.$emit("update:selectRowList", this.selectRowListCopy)
      }
    },
  props: {
    option: {
      type: Object,
      required: true,
      default: () => {
        return optionDefault;
      }
    },
    requestTableList: {
      type: Function,
      required: true
    },
    selectRowList: {  //  所有选中的行
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    },
    requestData: {
      type: Object,
      required: true,
      default: function() {
        return {
          pageNo: 1,
          limit: 10
        };
      }
    }
  },
  data() {
    return {
      selectRowListCopy: [],  //  当前选中的行可操作副本
      // @bug: 最后一页无法查询
      page: {
        begin: null,
        currPage: null,
        currSize: null,
        isFirst: false,
        isLast: false,
        pageSize: null,
        totalCount: null,
        totalPage: null
      }
    };
  },
  created() {
    console.log('option:', this.option);
    
  },
  mounted() {
   // debugger
    this.selectRowListCopy = Object.assign([], this.selectRowList)
    console.log('option:', this.option);
    // this.option = Object.assign(optionDefault, this.option)
          //  等待state更新
          this.$nextTick(() => {
    if (!this.option.isInitRequest) {
      this.getTableList();
    }
          })
  },
  methods: {
    dialogOpen() {
    //  debugger
      this.selectRowListCopy = Object.assign([], this.selectRowList)
      this.toggleSelection(this.selectRowListCopy)
    },
    getTableList() {
      if (this.option.tableLoading) {
        window.console.warn('无法发送新的请求，表格数据正在请求中。。。', this.requestTableList)
        return
      }
      this.option.tableLoading = true;
      this.requestData.pageNo = this.requestData.pageNo || 1;
      this.requestData.pageSize = this.requestData.pageSize || 10;
      this.requestTableList(this.requestData).then(response => {
        this.option.tableLoading = false;
        if (!response || !response.data) {
          Message({
            message: '获取表格数据异常，请稍候再试',
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
        if (response.data.code !== 200) {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
    // debugger
        this.option.tableDataList = response.data.data.list || response.data.data.data || response.data.data
        this.page = response.data.data.page
        if (this.option.checkTable) {
          //  等待state更新
          this.$nextTick(() => {
              this.toggleSelection(this.selectRowListCopy)
          })
        }
      }).catch(e => {
        this.option.tableLoading = false;
          Message({
            message: '获取表格数据异常，请稍候再试',
            type: 'error',
            duration: 5 * 1000
          })
      })
    },
    /**
     * 当前页码
     */
    pageChange(page) {
      this.requestData.pageNo = page;
      this.getTableList();
    },
    /**
     * 每页条数
     */
    sizeChange(size) {
      this.requestData.pageSize = size;
      this.requestData.limit = size;
      this.getTableList();
    },
    /**
     * 显示已选行或者清空
     */
    toggleSelection(rows) {
        if (rows && rows.length) {
          this.option.tableDataList.forEach(tableData => {
            //  空为取消选中
            const selectRow = rows.find(row => row? tableData.id === row.id : false)
            if (selectRow) {
              this.$refs['tableRef'].toggleRowSelection(tableData, true);
            } else {
              this.$refs['tableRef'].toggleRowSelection(tableData, false);
            }
          });
        } else {
          this.clearSelection()
        }
      },
    /**
     * 清空
     */
    clearSelection() {
      this.$refs['tableRef'].clearSelection();
      this.selectRowListCopy.splice(0, this.selectRowListCopy.length)
    },
    /**
     * 选择行后更新已选
     */
    handleSelect(selection, row) {
      //  空为取消选中
      const selectRow = selection? selection.find(tableData => tableData? tableData.id === row.id : false) : null
      if (!selectRow) {
        this.selectRowListCopy = this.selectRowListCopy.filter((selectRow,index,arr) => {
          return selectRow? selectRow.id !== row.id : false
        })
      } else {
        this.selectRowListCopy.push(row)
      }
      // this.$emit("table:select:update", this.selectRowListCopy);
    },
    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     */
    handleSelectAll(selection) {
      //  清空本页
      if (!selection.length || (selection.length === 1 && !selection[0])) {
        this.selectRowListCopy = this.selectRowListCopy.filter((selectRow,index,arr) => {
          if (!selectRow || selectRow.id) {
            return false
          }
          return !this.option.tableDataList.find(tableData => tableData? tableData.id === selectRow.id : false)
        })
      } else {  //  全选本页
          selection.map((tableData,index2,arr2) => {
            if (tableData) {
              let isSelect = false // 是否已选
              this.selectRowListCopy.map((selectRow,index,arr) => {
                if (!selectRow || selectRow.id) {
                  return false
                }
                if(selectRow && selectRow.id == tableData.id) {
                  isSelect = true
                }
              })
              if (!isSelect) {
                this.selectRowListCopy.push(tableData)
              }
            }
          })
      }
      // this.$emit("table:select:update", this.selectRowListCopy);
    },
    /**
     * 当选择项发生变化时会触发该事件
     */
    handleSelectionChange(selection) {
      // this.selectPageRowList = selection
      console.log(selection)
      // this.$emit("table:select:update", this.selectRowListCopy);
    },
    /**
     * 取消选中
     */
    rowUnSelect(rowObj) {
                    var self = this;
                    if (rowObj.isSelected) {
                        return;
                    }
                    for (var j = 0; j < self.gridOptions.selectedItems.length; j++) {
                        if (self.gridOptions.selectedItems[j][self.formDataIdKey]
                            == rowObj.entity[self.formDataIdKey]) {
                            self.gridOptions.selectedItems.splice(j, 1);
                            break;
                        }
                    }
                },

                /**
                 * 处理ui-grid中被选中与取消选中
                 * @param row 行对象
                 */
    rowSelect() {
                    var self = this;
                    //获取当前页的被选中数据，然后对总的selectedItems进行修改
                    var selectedItems = angular.copy(self.gridApi.selection.getSelectedRows())  || [];
                    var index = -1;
                    if (!self.gridOptions.multiSelect) {
                        self.gridOptions.selectedItems[0] = selectedItems[0];
                        return;
                    }
                    //进行复制操作
                    for (var i = 0; i < selectedItems.length; i++) {
                        if(selectedItems[0].$$treeLevel != selectedItems[i].$$treeLevel){//树形结构表格做数据排除
                            continue;
                        }
                        for (var j = 0; j < self.gridOptions.selectedItems.length; j++) {
                            if (self.gridOptions.selectedItems[j][self.formDataIdKey]
                                == selectedItems[i][self.formDataIdKey]) {
                                index = j;
                                break;
                            }
                        }
                        if (index == -1) {
                            self.gridOptions.selectedItems.push(selectedItems[i]);
                        } else {
                            self.gridOptions.selectedItems[j] = selectedItems[i];
                        }
                    }
                },
    getComboText (row, props) {
      let text = ''
      if (!props || !props.length) { return text }
      props.forEach((item) => {
        text = '-' + row[item]
      })
      return text.substring(1)
    }
  }
};
</script>

<style scoped>
.box-table {
  padding-top: 15px;
}
</style>
