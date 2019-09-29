<template>
    <div>
        <div class="item1">
            <div class="item_list">
                <span>时间段：</span>
                <span>{{beginDate}}   ~   {{endDate}}</span>
            </div>
            <div class="item_list">
                <span>承兑总额：</span>
                <span>{{matchTotalAmount}} GAC</span>
            </div>
        </div>
        <div class="item1">
            <div class="item_list">
                <span>利润总额：</span>
                <span>{{totalChargeAmount}} GAC</span>
            </div>
            <div class="item_list">
                <span>收款手续费利润：</span>
                <span>{{inChargeAmount}} GAC</span>
            </div>
            <div class="item_list">
                <span>转账手续费利润：</span>
                <span>{{outChargeAmount}} GAC</span>
            </div>
            <div class="item_list">
                <span>卖币手续费利润：</span>
                <span>{{sellGAcChargeAmount}} GAC</span>
            </div>
        </div>
        <div class="item1">
            <div class="item_list">
                <span>分润比例：</span>
                <span>{{distributeRate}}%</span>
            </div>
            <div class="item_list">
                <span>应分润金额：</span>
                <span>{{distributeAmount}} GAC</span>
            </div>
            <div class="item_list">
                <span>异常暂扣分润：</span>
                <span>{{exceptAmount}} GAC</span>
            </div>
        </div>
      <div class="item1">
          <div class="item_list">
                <span>应分润金额 / 承兑总额：</span>
                <span>{{benefitPerGAC}} GAC</span>
            </div>
      </div>
        <div class="tab-container">
            <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
                <el-table-column align="center" label="时间">
                    <template slot-scope="scope">
                    <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                    </template>
                </el-table-column>
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
                <el-table-column align="center" label="实分润金额（GAC）">
                    <template slot-scope="scope">
                    <span>{{Number(scope.row.realDistributeAmount/10000).toFixed(4)}} GAC</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="220px;" label="状态" class-name="small-padding fixed-width">
                    <template slot-scope="scope" >
                        <router-link :to="'/financial/history-fenrun-detail/'+scope.row.id" class="link-type">
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
    </div>
</template>
<script>
/*
import { confirmSelectHistoryBenefitPeriods } from '@/api/acceptor'
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

      beginDate: '',
      endDate: '',
      matchTotalAmount: '',
      totalChargeAmount: '',
      inChargeAmount: '',
      outChargeAmount: '',
      sellGAcChargeAmount: '',
      distributeRate: '',
      distributeAmount: '',
      exceptAmount: '',
      benefitPerGAC: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const param = {
        periods: this.$router.history.current.params.id,
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit
      }
      /*
      confirmSelectHistoryBenefitPeriods(param).then(res => {
        if (res.data.code === 200) {
          this.beginDate = res.data.data.main.beginDate
          this.endDate = res.data.data.main.endDate
          this.matchTotalAmount = Number(res.data.data.main.matchTotalAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.totalChargeAmount = Number(res.data.data.main.totalChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.inChargeAmount = Number(res.data.data.main.inChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.outChargeAmount = Number(res.data.data.main.outChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.sellGAcChargeAmount = Number(res.data.data.main.sellGAcChargeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.distributeRate = res.data.data.main.distributeRate || 0
          this.distributeAmount = Number(res.data.data.main.distributeAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.exceptAmount = Number(res.data.data.main.exceptAmount / 10000).toFixed(4) || Number(0).toFixed(4)
          this.benefitPerGAC = Number(res.data.data.main.benefitPerGAC).toFixed(4) || Number(0).toFixed(4) || Number(0).toFixed(4)
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
