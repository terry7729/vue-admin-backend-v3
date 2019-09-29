<template>
    <div>
        <div class="item1">
            <div class="item_list">
                <span>时间段：</span>
                <span>{{period}} ～ {{endDate}}</span>
            </div>
            <div class="item_list">
                <span>承兑总额：</span>
                <span>{{chengduiTotal}} GAC</span>
            </div>
        </div>
        <div class="item1">
            <div class="item_list">
                <span>利润总额：</span>
                <span>{{lirunTotal}} GAC</span>
            </div>
            <div class="item_list">
                <span>收款手续费利润：</span>
                <span>{{shoukuanfee}} GAC</span>
            </div>
            <div class="item_list">
                <span>转账手续费利润：</span>
                <span>{{zhuanzhangFee}} GAC</span>
            </div>
            <div class="item_list">
                <span>卖币手续费利润：</span>
                <span>{{maibiFee}} GAC</span>
            </div>
        </div>
        <div class="item1">
            <div class="item_list">
                <span>分润比例：</span>
                <span>{{fenrunbili}}%</span>
            </div>
            <div class="item_list">
                <span>应分润金额：</span>
                <span>{{yingfenrunjine}} GAC</span>
            </div>
            <div class="item_list">
                <span>异常暂扣分润：</span>
                <span>{{catchzankoufenrun}} GAC</span>
            </div>
        </div>

        <div class="item1">
            <div class="item_list">
                <span>应分润金额 / 承兑总额：</span>
                <span>{{chengduizonge}}</span>
            </div>
        </div>
        <div class="btnSure">
            <el-button type="primary" style="margin-left:10px;" @click="sureFenRunClick">确定分润</el-button>
        </div>
        <div class="tab-container">
         <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
          <el-table-column align="center" label="承兑人">
            <template slot-scope="scope">
              <span>{{scope.row.accountName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="承兑金额">
            <template slot-scope="scope">
              <span>{{Number(scope.row.matchTotalAmount/10000).toFixed(4)}} GAC</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="应分润金额（GAC）">
            <template slot-scope="scope">
              <span>{{Number(scope.row.distributeAmount/10000).toFixed(4)}} GAC</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="异常暂扣分润（GAC）">
            <template slot-scope="scope">
              <span>{{Number(scope.row.exceptAmount/10000).toFixed(4)}} GAC</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="220px;" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope" >
              <router-link :to="'/financial/pre-fenrun-detail/'+scope.row.id" class="link-type">
                <span style="color:#3d99f7">详情</span>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>

    <!--分润详情-->
    <el-dialog
      title="提示"
      :visible.sync="fenrunDialogVisible"
      width="30%">
      <span>确定要进行分润吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fenrunDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fenrunTipsClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--后台执行-->
    <el-dialog
      title="提示"
      :visible.sync="fenruningVisible"
      width="30%">
      <div>正在执行分润中...........</div>
      <div style="margin-top:10px;">分润后，可查询历史分润记录</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fenrunClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--分润成功-->
    <el-dialog
      title="提示"
      :visible.sync="fenrunSuccessVisible"
      width="30%">
      <span>分润成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sucessKnowClick">知道了</el-button>
        <el-button type="primary" @click="SuccessClick">查看分润情况</el-button>
      </span>
    </el-dialog>


    </div>
</template>
<script>
/*
import { confirmSelectUnBenefitPeriods } from '@/api/acceptor'
*/
import { Message } from 'element-ui'
export default {
  data() {
    return {
      fenrunDialogVisible: false,
      fenruningVisible: false,
      fenrunSuccessVisible: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      endDate: '',
      period: '',
      chengduiTotal: '',
      lirunTotal: '',
      shoukuanfee: '',
      zhuanzhangFee: '',
      maibiFee: '',
      saveMainId: '',
      fenrunbili: '',
      yingfenrunjine: '',
      catchzankoufenrun: '',
      chengduizonge: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        periods: this.$router.history.current.params.timeperiod,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      }/*
      confirmSelectUnBenefitPeriods(param).then(res => {
        if (res.data.code === 200) {
          this.period = res.data.data.main.beginDate
          this.endDate = res.data.data.main.endDate
          this.saveMainId = res.data.data.main.id
          this.chengduiTotal = Number(res.data.data.main.matchTotalAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.lirunTotal = Number(res.data.data.main.totalChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.shoukuanfee = Number(res.data.data.main.inChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.zhuanzhangFee = Number(res.data.data.main.outChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.maibiFee = Number(res.data.data.main.sellGAcChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.fenrunbili = res.data.data.main.distributeRate || Number(0).toFixed(4)
          this.yingfenrunjine = Number(res.data.data.main.distributeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.catchzankoufenrun = Number(res.data.data.main.exceptAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.chengduizonge = res.data.data.main.benefitPerGAC || Number(0).toFixed(4)
          this.list = res.data.data.detail.rows
          this.total = res.data.data.detail.totalCount
          this.listLoading = false
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })*/
    },
    /**
     * 分润 确定
     */
    fenrunTipsClick() {
      /*
       * this.fenruningVisible = true
        this.fenrunDialogVisible = false
       */
      /*
      confirmBenefitAction({ mainId: this.saveMainId }).then(res => {
        if (res.data.code === 200) {
          this.fenruningVisible = false
          this.fenrunSuccessVisible = true
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })*/
    },
    /**
         * 分润
         */
    sureFenRunClick() {
      this.fenrunDialogVisible = true
    },
    /**
     * 后台执行
     */
    fenrunClick() {
      this.fenruningVisible = false
      history.go('-1')
    },
    /**
     * 分润成功
     * 查看分润情况
     */
    SuccessClick() {
      this.$router.push({ path: '/financial/history-fenrun/' + this.$router.history.current.params.timeperiod })
    },
    /**
     * 知道啦
     */
    sucessKnowClick() {
      history.go('-1')
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    searchClick() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
<style scoped>
    .item1{
        padding:20px 15px 25px 25px;
        font-size: 16px;
        color: #000;
        clear: both;
    }
    .item_list{
        margin-right: 15px;
        float: left;
        
    }
    .item_content{
        margin-right: 5px;
    }
    .btnSure{
        float: right;
        margin: 20px 50px;
    }
    .tab-container {
        margin: 100px 30px 30px 30px;
    }
</style>
