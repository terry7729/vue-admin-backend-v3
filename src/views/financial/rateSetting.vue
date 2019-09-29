<template>
  <div>
    <div class="layout_container">
      <el-tabs v-model="currentTab" @tab-click="changeTabs">
        <!-- 普通用户 -->
        <el-tab-pane label="普通用户" name="ORDINARY">
          <div class="table_container">
            <div class="table_head" style="display:flex;">
              <div class="head_th" style="flex:2;">业务</div>
              <div class="head_th" style="flex:2;">场景</div>
              <div class="head_th" style="flex:2;">手续费率</div>
              <div class="head_th" style="flex:2;">最低手续费</div>
              <div class="head_th" style="flex:1;">操作</div>
            </div>
            <div class="table_body">
              <div class="body_tr" style="display:flex;" v-for="(item,index) in rateSettingList">
                <!-- 业务 -->
                <div class="body_title" style="flex:2;">
                  <span v-if="item.busiType == '10'">转账转入</span>
                  <span v-if="item.busiType == '11'">转账转出</span>
                  <span v-if="item.busiType == '20'">app钱包买入</span>
                  <span v-if="item.busiType == '21'">快捷买入</span>
                  <span v-if="item.busiType == '30'">app钱包卖出</span>
                  <span v-if="item.busiType == '31'">快捷卖出</span>
                </div>
                <div class="body_content" style="flex:7;">
                  <!-- 业务对应的明细 -->
                  <div class="content_td" style="display:flex;" v-for="(td,tdIndex) in item.fundRateInfoListVo">
                    <div class="item" style="flex:2;">{{td.fee_info}}</div>
                    <div class="item" style="flex:2;">{{Number(td.rate/100).toFixed(2)}}%</div>
                    <div class="item" style="flex:2;">{{Number(td.min_fee/10000).toFixed(2)}}</div>
                    <div class="item" style="flex:1;">
                      <el-button type="text" @click="editRate(td)">编辑</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 商家 -->
        <el-tab-pane label="商家" name="BUSINESS">
          <div class="table_container">
            <div class="table_head" style="display:flex;">
              <div class="head_th" style="flex:2;">业务</div>
              <div class="head_th" style="flex:2;">场景</div>
              <div class="head_th" style="flex:2;">手续费率</div>
              <div class="head_th" style="flex:2;">最低手续费</div>
              <div class="head_th" style="flex:1;">操作</div>
            </div>
            <div class="table_body">
              <div class="body_tr" style="display:flex;" v-for="(item,index) in rateSettingList">
                <!-- 业务 -->
                <div class="body_title" style="flex:2;">
                  <span v-if="item.busiType == '10'">转账转入</span>
                  <span v-if="item.busiType == '11'">转账转出</span>
                  <span v-if="item.busiType == '20'">app钱包买入</span>
                  <span v-if="item.busiType == '21'">快捷买入</span>
                  <span v-if="item.busiType == '30'">app钱包卖出</span>
                  <span v-if="item.busiType == '31'">快捷卖出</span>
                   <span v-if="item.busiType == '40'">快捷承兑收款</span>
                </div>
                <div class="body_content" style="flex:7;">
                  <!-- 业务对应的明细 -->
                  <div class="content_td" style="display:flex;" v-for="(td,tdIndex) in item.fundRateInfoListVo">
                    <div class="item" style="flex:2;">{{td.fee_info}}</div>
                    <div class="item" style="flex:2;">{{Number(td.rate/100).toFixed(2)}}%</div>
                    <div class="item" style="flex:2;">{{Number(td.min_fee/10000).toFixed(2)}}</div>
                    <div class="item" style="flex:1;">
                      <el-button type="text" @click="editRate(td)">编辑</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 承兑人 -->
        <el-tab-pane label="承兑人" name="ACCEPTER">
          <div class="table_container">
            <div class="table_head" style="display:flex;">
              <div class="head_th" style="flex:2;">业务</div>
              <div class="head_th" style="flex:2;">场景</div>
              <div class="head_th" style="flex:2;">手续费率</div>
              <div class="head_th" style="flex:2;">最低手续费</div>
              <div class="head_th" style="flex:1;">操作</div>
            </div>
            <div class="table_body">
              <div class="body_tr" style="display:flex;" v-for="(item,index) in rateSettingList">
                <!-- 业务 -->
                <div class="body_title" style="flex:2;">
                  <span v-if="item.busiType == '10'">转账转入</span>
                  <span v-if="item.busiType == '11'">转账转出</span>
                  <span v-if="item.busiType == '20'">app钱包买入</span>
                  <span v-if="item.busiType == '21'">快捷买入</span>
                  <span v-if="item.busiType == '30'">app钱包卖出</span>
                  <span v-if="item.busiType == '31'">快捷卖出</span>
                </div>
                <div class="body_content" style="flex:7;">
                  <!-- 业务对应的明细 -->
                  <div class="content_td" style="display:flex;" v-for="(td,tdIndex) in item.fundRateInfoListVo">
                    <div class="item" style="flex:2;">{{td.fee_info}}</div>
                    <div class="item" style="flex:2;">{{Number(td.rate/100).toFixed(2)}}%</div>
                    <div class="item" style="flex:2;">{{Number(td.min_fee/10000).toFixed(2)}}</div>
                    <div class="item" style="flex:1;">
                      <el-button type="text" @click="editRate(td)">编辑</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 系统用户 -->
        <el-tab-pane label="系统用户" name="SYSTEMACCOUNT">
          <div class="table_container">
            <div class="table_head" style="display:flex;">
              <div class="head_th" style="flex:2;">业务</div>
              <div class="head_th" style="flex:2;">场景</div>
              <div class="head_th" style="flex:2;">手续费率</div>
              <div class="head_th" style="flex:2;">最低手续费</div>
              <div class="head_th" style="flex:1;">操作</div>
            </div>
            <div class="table_body">
              <div class="body_tr" style="display:flex;" v-for="(item,index) in rateSettingList">
                <!-- 业务 -->
                <div class="body_title" style="flex:2;">
                  <span v-if="item.busiType == '10'">转账转入</span>
                  <span v-if="item.busiType == '11'">转账转出</span>
                  <span v-if="item.busiType == '20'">app钱包买入</span>
                  <span v-if="item.busiType == '21'">快捷买入</span>
                  <span v-if="item.busiType == '30'">app钱包卖出</span>
                  <span v-if="item.busiType == '31'">快捷卖出</span>
                </div>
                <div class="body_content" style="flex:7;">
                  <!-- 业务对应的明细 -->
                  <div class="content_td" style="display:flex;" v-for="(td,tdIndex) in item.fundRateInfoListVo">
                    <div class="item" style="flex:2;">{{td.fee_info}}</div>
                    <div class="item" style="flex:2;">{{Number(td.rate/100).toFixed(2)}}%</div>
                    <div class="item" style="flex:2;">{{Number(td.min_fee/10000).toFixed(2)}}</div>
                    <div class="item" style="flex:1;">
                      <el-button type="text" @click="editRate(td)">编辑</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 编辑 -->
    <el-dialog title="编辑" class="edit_modal" :visible.sync="showEditModal" width="600px">
      <div>
        <div class="list">
          <div class="list_label">用户分组：</div>
          <div class="list_content">{{roleGroup}}</div>
        </div>
        <div class="list">
          <div class="list_label">业务场景：</div>
          <div class="list_content">
            {{busiSence}}
          </div>
        </div>
        <div class="list">
          <div class="list_label">手续费率：</div>
          <div class="list_content">
            <div style="position:relative;">
              <el-input placeholder="请输入手续费率" v-model="rate" @blur="validateRate()"></el-input><span style="position:absolute;top:10px;right:10px;color:#888;">%</span>
            </div>
            <div class="text_error" v-if="rateError">请输入0~100间的数字（最多2位小数）</div>
          </div>
        </div>
        <div class="list">
          <div class="list_label">最低手续费：</div>
          <div class="list_content">
            <el-input placeholder="请输入最低手续费率" v-model="rateLow" @blur="validateRateLow()"></el-input>
            <div class="text_error" v-if="rateLowError">请输入正确的数字（最多2位小数）</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="default" @click="cancelClick()">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="entryClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { feeQuerylist, feeSetRate } from '@/api/acceptor.js'
export default {
  data() {
    return {
      currentTab: "ORDINARY",
      showEditModal: false,
      rateSettingList: [],

      id: '', // id
      roleGroup: '', // 用户分组
      busiSence: '',//业务场景
      rate: '',
      rateLow: '',
      rateError: false,
      rateLowError: false,
      saveEditRow: null,
      btnLoading: false,
    }
  },
  created() {
    this.queryData();
  },
  methods: {
    validateRate() {
      if (!/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(this.rate) || Number(this.rate) > 100) {
        this.rateError = true;
      } else {
        this.rateError = false;
      }
    },
    validateRateLow() {
      if (!/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(this.rateLow)) {
        this.rateLowError = true;
      } else {
        this.rateLowError = false;
      }
    },
    queryData() {
      this.rateSettingList = []
      feeQuerylist({ user: this.currentTab }).then(res => {
        if (res.data.code === 200) {
          let rateList = res.data.data.fee_rate_list;
          if (rateList.app_by) {
            this.rateSettingList.push({ busiType: '20', fundRateInfoListVo: rateList.app_by })
          } if (rateList.app_sell) {
            this.rateSettingList.push({ busiType: '30', fundRateInfoListVo: rateList.app_sell })
          } if (rateList.transfer_in) {
            this.rateSettingList.push({ busiType: '10', fundRateInfoListVo: rateList.transfer_in })
          } if (rateList.transfer_out) {
            this.rateSettingList.push({ busiType: '11', fundRateInfoListVo: rateList.transfer_out })
          } if (rateList.quick_buy) {
            this.rateSettingList.push({ busiType: '21', fundRateInfoListVo: rateList.quick_buy })
          } if (rateList.quick_sell) {
            this.rateSettingList.push({ busiType: '31', fundRateInfoListVo: rateList.quick_sell })
          }if (rateList.quick_buy_channel) {
            this.rateSettingList.push({ busiType: '40', fundRateInfoListVo: rateList.quick_buy_channel })
          }
        }
      })
    },
    cancelClick() {
      this.showEditModal = false;
      this.id = '';
      this.rate = '';
      this.rateLow = '';
      this.rateError = false;
      this.rateLowError = false;
    },
    entryClick() {
      let validateFlag = true;
      if (!/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(this.rate) || Number(this.rate) > 100) {
        validateFlag = false;
        this.rateError = true;
      } else {
        this.rateError = false;
      }
      if (!/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(this.rateLow)) {
        validateFlag = false;
        this.rateLowError = true;
      } else {
        this.rateLowError = false;
      }

      // 验证通过
      if (validateFlag) {
        let params = {
          id: this.id,
          produce_user: this.currentTab,
          fee_type: this.saveEditRow.fee_type,
          fee_rate: parseInt(Number(this.rate) * 100),
          min_fee: Number(this.rateLow) * 10000,
        }
        if (this.btnLoading) return;
        this.btnLoading = true;
        feeSetRate(params).then(res => {
          this.btnLoading = false;
          if (res) {
            if (res.data.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功！"
              })
              this.showEditModal = false;
              this.queryData();
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              })
            }
          }
        }).catch(() => {
          this.btnLoading = false;
        })
      }
    },
    /**
     * 编辑
     */
    editRate(row) {
      // 用户分组
      if (row.produce_user == "ORDINARY") {
        this.roleGroup = '普通用户';
      }
      if (row.produce_user == "ACCEPTER") {
        this.roleGroup = '承兑人';
      }
      if (row.produce_user == "BUSINESS") {
        this.roleGroup = '商家';
      }
      if (row.produce_user == "SYSTEMACCOUNT") {
        this.roleGroup = '系统用户';
      }
      // 业务场景
      if (row.business_type == "app_by") {
        this.busiSence = 'app钱包买入-' + row.fee_info;
      }
      if (row.business_type == "app_sell") {
        this.busiSence = 'app钱包卖出-' + row.fee_info;
      }
      if (row.business_type == "transfer_in") {
        this.busiSence = '转账转入-' + row.fee_info;
      }
      if (row.business_type == "transfer_out") {
        this.busiSence = '转账转出-' + row.fee_info;
      }
      if (row.business_type == "quick_buy") {
        this.busiSence = '快捷买入-' + row.fee_info;
      }
      if (row.business_type == "quick_sell") {
        this.busiSence = '快捷卖出-' + row.fee_info;
      }
      if (row.business_type == "quick_buy_channel") {
        this.busiSence = '快捷承兑收款-' + row.fee_info;
      }
      this.saveEditRow = row
      this.id = row.id;
      this.rate = (row.rate / 100).toFixed(2);
      this.rateLow = (row.min_fee / 10000).toFixed(2);
      this.showEditModal = true;
    },
    changeTabs(tab, event) {
      this.queryData();
    }
  }
}
</script>
<style scoped>
.layout_container {
  padding: 20px 30px;
}
.layout_container .table_container .tab_table {
  border-collapse: collapse;
  width: 900px;
}
.table_container .tab_table thead {
  background: #eee;
}

.table_container {
  width: 1000px;
}
.table_container .table_head .head_th {
  border: solid 0.5px #ddd;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  background: #f2f2f3;
}
.table_container .table_body {
  font-size: 13px;
}
.table_container .table_body .body_tr {
  border: solid 0.5px #ddd;
  align-items: center;
}
.table_container .table_body .body_title {
  margin-top: -1px;
  text-align: center;
  font-weight: bold;
  height: 35px;
  line-height: 35px;
}
.table_container .table_body .content_td .item {
  border: solid 0.5px #ddd;
  height: 35px;
  line-height: 35px;
  text-align: center;
  margin-left: -1px;
  margin-top: -1px;
}

/* 弹出框 */
.edit_modal .list {
  padding: 10px;
  display: flex;
  align-items: center;
}
.edit_modal .list .list_label {
  width: 100px;
  text-align: right;
}
.edit_modal .list .list_content {
  flex: 1;
}
.edit_modal .list .list_content .text_error {
  padding: 3px 0px;
  color: red;
  font-size: 12px;
}
</style>

