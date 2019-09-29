<template>
  <div class="dashboard-editor-container">
    <panel-group ></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="userBtn">
        <el-radio v-model="charBtn" label="1" border>周</el-radio>
        <el-radio v-model="charBtn" label="2" border>月</el-radio>
      </div>
      <line-chart :chart-data="lineChartData" :xAxisData="xAxisData" :chartTitle="chartTitle"></line-chart>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="userBtn">
        <el-radio v-model="ecashBtn" label="1" border>周</el-radio>
        <el-radio v-model="ecashBtn" label="2" border>月</el-radio>
      </div>
      <line-chart :chart-data="lineChartData" :xAxisData="xAxisData" :chartTitle="chartEcashTitle"></line-chart>
    </el-row>
     
  </div>
</template>


<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165]
  }
}

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      chartTitle: '新增用户统计',
      chartEcashTitle: 'GAC交易量',
      charBtn: '1',
      ecashBtn: '1'
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .userBtn {
    position: absolute;
    right: 30px;
    z-index: 100;
  }
}
</style>
