<template>
    <div>
        <div class="item1">
            <div class="item_list">
                <span>时间段：</span>
                <span>{{periodStartTime}} ~ {{periodEndTime}}</span>
            </div>
            <div class="item_list">
                <span>当期应分润金额 / 承兑总额：</span>
                <span>{{acceptorTotal}} GAC</span>
            </div>
        </div>
        <div class="item1">
            <div class="item_list">
                <span>承兑人：</span>
                <span>{{accptorNmae}}</span>
            </div>
            <div class="item_list">
                <span>承兑金额：</span>
                <span>{{acceptorAmount}} GAC</span>
            </div>
            <div class="item_list">
                <span>应分润总额：</span>
                <span>{{yingfenrunTotal}} GAC</span>
            </div>
            <div class="item_list">
                <span>异常暂扣分润：</span>
                <span>{{yichangfenrun}} GAC</span>
            </div>
        </div>
        <div class="tab-container">
            <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column align="center" label="时间">
                    <template slot-scope="scope">
                    <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单号">
                    <template slot-scope="scope">
                    <span>{{scope.row.tradeId}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="承兑金额（GAC）">
                    <template slot-scope="scope">
                    <span>{{Number(scope.row.accepteAmount/10000).toFixed(4)}} GAC</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="承兑类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.acceptType==='FLATMONEYTOKEN'" >法币兑GAC</span>
                        <span v-if="scope.row.acceptType==='TOKENFLATMONEY'" >GAC兑法币</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应分润金额(GAC)">
                    <template slot-scope="scope">
                        <span>{{Number(scope.row.planBenefitAmount/10000).toFixed(4)}} GAC</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="220px;" label="状态" class-name="small-padding fixed-width">
                    <template slot-scope="scope" >
                        <span v-if="scope.row.acceptType==='ABNORMAL'" style="color:red">异常暂扣</span>
                        <span v-else>正常</span>
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
/*
import { queryAccepterBenefitDetail } from '@/api/acceptor'
*/
import { Message } from 'element-ui'
export default {
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      periodStartTime: '',
      periodEndTime: '',
      acceptorTotal: '',
      accptorNmae: '',
      acceptorAmount: '',
      yingfenrunTotal: '',
      yichangfenrun: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        mainId: this.$router.history.current.params.id,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      /*
      queryAccepterBenefitDetail(param).then(res => {
        if (res.data.code === 200) {
          this.periodStartTime = res.data.data.beginDate
          this.periodEndTime = res.data.data.endDate
          this.acceptorTotal = res.data.data.benefitPerGAC
          this.accptorNmae = res.data.data.benefitPeriodDetail.accountName
          this.acceptorAmount = Number(res.data.data.benefitPeriodDetail.matchTotalAmount / 10000).toFixed(4)
          this.yingfenrunTotal = Number(res.data.data.benefitPeriodDetail.distributeAmount / 10000).toFixed(4)
          this.yichangfenrun = Number(res.data.data.benefitPeriodDetail.exceptAmount / 10000).toFixed(4)
          this.list = res.data.data.accepterBenefitPageInfo.rows
          this.total = res.data.data.accepterBenefitPageInfo.totalCount
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
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
    .tab-container {
        margin: 100px 30px 30px 30px;
    }
</style>
