<template>
  <div>
    <div class="contaner-box">
      <span style="width:80px;display:inline-block;text-align:right;">状态：</span>
      <span class="tags" :class="{selected:listQuery.dealStatus == ''}" @click="changeLabelStatus('dealStatus','')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.dealStatus == '0'}" @click="changeLabelStatus('dealStatus','0')">
        <span>&nbsp;未处理&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.dealStatus == '1'}" @click="changeLabelStatus('dealStatus','1')">
        <span>&nbsp;已处理&nbsp;</span>
      </span>

      <div style="margin-top:20px;">
        <span>
          反馈时间：
          <el-date-picker v-model="listQuery.pickerdate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间">
          </el-date-picker>
          <span>至</span>
          <el-date-picker v-model="listQuery.pickerdate1" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间">
          </el-date-picker>
        </span>
        <span style="margin-left:10px;">
          反馈人：
          <el-input placeholder="请输入反馈人账户名称" style="width:300px" v-model="listQuery.accountName"></el-input>
        </span>
        <span>
          <el-button type="primary" @click="searchClick()">查 询</el-button>
        </span>
      </div>
    </div>
    <div class="tab-container">
      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="反馈时间">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="反馈人" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.acptName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="反馈内容" align="center">
          <template slot-scope="scope">
            <div style="text-align:center">{{scope.row.content}}</div>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.imagesList&&scope.row.imagesList.length>0" @click="showPayImageModal(scope.row.imagesList,scope.row.remark)"><i class="el-icon-picture" style="font-size: 30px;color: #409EFF;cursor:pointer;"></i></span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.remark}}</div>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status===0">
              未处理
            </div>
            <div v-if="scope.row.status===1">
              已处理
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="220px;" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <div v-if="scope.row.status===0">
              <el-button type="text" @click="checkDealClick(scope.row,scope)">标记为已处理</el-button>
              <el-button type="text" @click="beizhuClick(scope.row,scope)">备注</el-button>
            </div>
            <div v-if="scope.row.status===1">
              <el-button type="text" @click="beizhuClick(scope.row,scope)">备注</el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 问题反馈截图 -->
    <el-dialog title="问题反馈截图" :visible.sync="isShowPayImagesModal" width="width:600px;">
      <div>
        <div class="clearfix">
          <img v-for="(item,index) in payedImageUrl" style="width:31%;float:left;margin:5px;" :src="item" @click="openLookBigImgModal(item)"/>
        </div>
        <div class="clearfix" style="margin:10px 0px;padding:10px 0px;">
          备注：{{payedRemark||"-"}}
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowPayImagesModal=false;payedImageUrl=[];payedRemark='';">确 定</el-button>
      </div>
    </el-dialog>
    <!--备注-->
    <el-dialog title="添加备注" :visible.sync="isShowBeizhuDialog" width="width:600px;">
      <div>
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="input-pay" placeholder="请输入备注" v-model="beizhuTips" maxlength="50"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="isShowBeizhuDialog=false;beizhuTips='';">取消</el-button>
        <el-button type="primary" @click="sureBeiZhuClick">确定</el-button>
      </div>
    </el-dialog>

    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="960px">
      <div style="text-align:center;">
        <img :src="lookBigImgUrl" style="max-width:100%;" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAccepterFeedbackList, makeHandledFlag, feedBackRemark } from '@/api/acceptor'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      listQuery: {
        dealStatus: '', //查询状态
        pickerdate: '', //查询反馈开始日期
        pickerdate1: '', //查询反馈结束日期
        accountName: '', //查询反馈人
        page: 1,
        limit: 10
      },
      listLoading: false,
      tableKey: null,
      list: null,
      total: null,
      isShowPayImagesModal: false,
      payedImageUrl: null,
      payedRemark: null,
      beizhuTips: "",
      isShowBeizhuDialog: false,
      beizhuScope: null,
      beizhuRow: null,

      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: '',
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeLabelStatus(label, status) {
      this.listQuery[label] = status
      this.dealStatus=status
      this.getList()
    },
    searchClick() {
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      let param = {
        startTime: this.listQuery.pickerdate,
        endTime: this.listQuery.pickerdate1,
        acptName: this.listQuery.accountName,
        status: this.dealStatus,
        currentPage: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      queryAccepterFeedbackList(param).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.resultList
          this.total = res.data.data.total
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    /**
     * 查看单大图
     */
    openLookBigImgModal(url) {
      this.lookBigImgUrl = url;
      this.lookBigImgModal = true;
    },
    /**图片查看大图 */
    showPayImageModal(imgs, remark) {
      this.isShowPayImagesModal = true;
      this.payedImageUrl = imgs;
      this.payedRemark = remark;
    },
    /**标记为已处理 */
    checkDealClick(row, scope) {
      let param = {
        id: row.id
      }
      makeHandledFlag(param).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.isShowPayImagesModal = false;
          this.getList();
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    /**备注 */
    beizhuClick(row, scope) {
      this.beizhuTips = ''
      this.isShowBeizhuDialog = true
      this.beizhuScope = scope
      this.beizhuRow = row
    },
    /**备注 确定 */
    sureBeiZhuClick() {
      feedBackRemark({ id: this.beizhuRow.id, remark: this.beizhuTips }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.list[this.beizhuScope.$index].remark=this.beizhuTips
          this.isShowBeizhuDialog=false
        } else {
          this.isShowBeizhuDialog=false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
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
.contaner-box {
  margin: 10px 30px 0 30px;
  font-size: 15px;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
.tags {
  margin-right: 10px;
  font-size: 14px;
  height: 30px;
  min-width: 50px;
  text-align: center;
  padding: 0px 5px;
  line-height: 30px;
  display: inline-block;
  cursor: pointer;
}
.tags.selected {
  background: #409eff;
  color: #fff;
  border-radius: 4px;
}
</style>
<style>
.el-textarea__inner{
    height: 100px !important;
}
</style>

