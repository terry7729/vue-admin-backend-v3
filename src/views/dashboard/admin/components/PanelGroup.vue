<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text text-router" style="color: rgb(0,165,252);">10</div>
          <div class="card-panel-num">待审核承兑人申请</div>
        </div>
      </div>
      
       <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text text-router" style="color: rgb(0,165,252);">10</div>
          <div class="card-panel-num">待处理订单申诉</div>
        </div>
      </div>

       <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text text-router" style="color: rgb(0,165,252);">10</div>
          <div class="card-panel-num">今日新增用户数</div>
        </div>
      </div>

       <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text" style="text-align: center;">10</div>
          <div class="card-panel-num">累计用户总数</div>
        </div>
      </div>

       <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text" style="text-align: center;">10</div>
          <div class="card-panel-num">今日交易量</div>
        </div>
      </div>

       <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-description">
          <div class="card-panel-text" style="text-align: center;">10</div>
          <div class="card-panel-num">GACA发行总量</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss">
  @media only screen and (min-width: 1200px)
  {
    .el-col-lg-6 {
        width: 100%;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .text-router{
    text-align: center;
    cursor: pointer;
    color: rgb(0,165,252);
  }
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel:first-child{
    padding-left:20px;
  }
  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    float: left;
    width: 16.66%;
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
