<template>
  <div>
    <div class="contaner-box">
      <span style="width:80px;display:inline-block;text-align:right;">在线状态：</span>
      <span class="tags" :class="{selected:listQuery.ifOnline == 'all'}" @click="changeLabelStatus('ifOnline','all')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifOnline == '1'}" @click="changeLabelStatus('ifOnline','1')">
        <span>&nbsp;在线&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifOnline == '0'}" @click="changeLabelStatus('ifOnline','0')">
        <span>&nbsp;离线&nbsp;</span>
      </span>
    </div>
    <div class="contaner-box">
      <span style="width:80px;display:inline-block;text-align:right;">权限状态：</span>
      <span class="tags" :class="{selected:listQuery.ifPause == 'all'}" @click="changeLabelStatus('ifPause','all')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifPause == '0'}" @click="changeLabelStatus('ifPause','0')">
        <span>&nbsp;可承兑&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.ifPause == '1'}" @click="changeLabelStatus('ifPause','1')">
        <span>&nbsp;暂停承兑&nbsp;</span>
      </span>
    </div>
    <div class="contaner-box">
      <span> <span style="width:80px;display:inline-block;text-align:right;">账户名：</span>
        <el-input placeholder="请输入账户名" v-model="listQuery.accountName" clearable maxlength="50"></el-input>
      </span>
      <span style="margin-left:10px;">联系人：<el-input placeholder="请输入联系人" v-model="listQuery.fullName" clearable maxlength="50"></el-input></span>
      <span style="margin-left:10px;">
        <el-button type="primary" @click="handleSearchClick" style="margin-left:10px;">查询</el-button>
        <!-- <el-button type="primary" @click="handleMatchSettingsOpen({id: 20})" style="margin-left:10px;">test</el-button> -->
      </span>
    </div>
    <div class="app-container">

      <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="账户名">
          <template slot-scope="scope">
            <span>{{scope.row.account_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="保证金(GAC)">
          <template slot-scope="scope">
            <span>{{scope.row.deposit | cash}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限状态">
          <template slot-scope="scope">
            <span v-if="scope.row.accepterStatus==='ACCEPTABILITY'">可承兑</span>
            <span v-if="scope.row.accepterStatus==='FROZEN'" style="FROZEN:red;">暂停承兑</span>
          </template>
        </el-table-column>
        <!--
        <el-table-column align="center" label="交易次数">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>承兑人: {{scope.row.account_name}}</p>
              <p>交易次数: {{scope.row.tradeNumber}}</p>
              <p><span>完成次数: {{scope.row.finishNumber}}</span><span class="hoverRight">完成率: {{(((scope.row.finishNumber / scope.row.tradeNumber)*100) || 0)+"%"}}</span></p>
              <p>平均放行时间: {{scope.row.averageFinishTime}}</p>
              <div slot="reference" class="name-wrapper">
                <span>{{scope.row.tradeNumber}}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
          -->
        <el-table-column align="center" label="在线状态">
          <template slot-scope="scope">
            {{scope.row.ifOnline}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户总资产">
          <template slot-scope="scope">
            <span>{{Number(scope.row.totalBalGac/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户可用资产">
          <template slot-scope="scope">
            <span>{{Number(scope.row.usableGac/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="账户冻结资产">
          <template slot-scope="scope">
            <span>{{Number(scope.row.lockedBalGac/10000).toFixed(4)}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="联系人">
          <template slot-scope="scope">
            <span>{{scope.row.fullname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="评分">
          <template slot-scope="scope">
            <el-select v-model.number="scope.row.grade" placeholder="请选择" :id="'select'+scope.$index" @change="changeGradeClick($event, scope.row,scope)">
              <el-option v-for="item in graded" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <!--
           <select :id="'select'+scope.$index" style="border: 1px solid #ccc; width: 110px; height: 30px;" @change="changeGradeClick(scope.row,scope)">
            <option value ="50">50</option>
            <option value ="60">60</option>
            <option value="70">70</option>
            <option value="80">80</option>
          </select>-->
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300px;" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEditClick(scope.row,scope)">编辑</el-button>
            <el-button size="mini" v-if="scope.row.accepterStatus==='FROZEN'" type="primary" @click="handleStartClick(scope.row,scope)">启用</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.accepterStatus==='ACCEPTABILITY'" @click.native="handleStopClick(scope.row,scope)">暂停</el-button>
            <el-dropdown>
              <el-button type="primary" size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handlePenaltyClick(scope.row,scope)">罚款</el-dropdown-item>
                <el-dropdown-item @click.native="handleDeleteClick(scope.row,scope)">移除</el-dropdown-item>
                <el-dropdown-item @click.native="handleMatchSettingsOpen(scope.row,scope)">匹配设置</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button size="mini" type="primary" @click="handlePenaltyClick(scope.row,scope)">罚款</el-button>
            <el-button size="mini" v-if="scope.row.accepterStatus==='ACCEPTABILITY'" type="primary" @click="handleStopClick(scope.row,scope)">暂停</el-button>
            <el-button size="mini" type="primary" @click="handleDeleteClick(scope.row,scope)">移除</el-button>
            <el-button type="primary" size="mini" @click="handleMatchSettingsOpen(scope.row,scope)">匹配设置</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--编辑弹出框-->
    <el-dialog title="编辑承兑人信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户名" prop="account">
          <el-input v-model="ruleForm.account" disabled style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="已交保证金" prop="paydeposit">
          <el-input v-model="ruleForm.paydeposit" disabled style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="ruleForm.username" style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="ruleForm.telephone" style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitSureForm('ruleForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--罚款弹出框-->
    <el-dialog title="罚款" :visible.sync="penaltydialogVisible" width="30%">
      <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户名" prop="account">
          <label>{{penaltyName}}</label>
        </el-form-item>
        <el-form-item label="罚款金额" prop="penaltyCash">
          <el-input v-model="ruleForm1.penaltyCash" placeholder="请输入罚款金额" style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="penaltyTips">
          <el-input v-model="ruleForm1.penaltyTips" placeholder="请输入备注说明" style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetpenaltyForm('ruleForm1')">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handlePenaltySureClick('ruleForm1')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--删除确认弹出框-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定要移除该承兑人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialogClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--暂停承兑人权限-->
    <el-dialog title="提示" :visible.sync="stopDialogVisible" width="30%">
      <span>确定要暂停该承兑人的承兑权限吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="stopDialogClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--启用承兑人权限-->
    <el-dialog title="提示" :visible.sync="startDialogVisible" width="30%">
      <span>确定要启用该承兑人的承兑权限吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="startDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="startDialogClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--匹配设置-->
    <div id="pipei">
      <el-dialog class="dialog-match-settings" title="匹配设置" :visible.sync="matchSettingsDialog">
        <el-form :model='matchSettings.formData' :rules='matchSettings.rules' ref='matchSettingsFormDataRef' :inline="true" label-position="left">
          <el-form-item label='承兑人：' style="margin-bottom: 5px;">
            {{matchSettings.formData.userName || '-'}}
          </el-form-item>
          <el-form-item label='保证金：' style="margin-left:100px;margin-bottom: 5px;">
            {{matchSettings.formData.totalBzzGac + " GAC"}}
          </el-form-item>
          <el-form-item label='' prop='busiTypeList' style="display:block;margin-bottom: 0px;">
            <el-checkbox v-model="matchSettings.formData.ifMatchBuyOrder" :true-label='1' :false-label='0' @change='ifMatchBuyOrderChange'>参与买单的匹配</el-checkbox>
          </el-form-item>
          <el-form-item label='' prop='busiTypeList' style="display:block;margin-bottom: 0px;">
            <el-checkbox :disabled='!matchSettings.formData.ifMatchBuyOrder' v-model="matchSettings.formData.canBuyAcptMatch " :true-label='1' :false-label='0'>参与承兑人的买单匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchBuyOrder || !!matchSettings.formData.cashChannels' v-model="matchSettings.formData.canBuyBusiMatch " :true-label='1' :false-label='0'>参与商家的买单匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchBuyOrder' v-model="matchSettings.formData.canBuyUserMatch" style="margin-right:20px; " :true-label='1' :false-label='0'>参与个人用户的买单匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchBuyOrder' v-model="matchSettings.formData.cashChannels" style="margin-left:0px; " :true-label='1' :false-label='0' @change="cashChannelsChange">参与快捷承兑的匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchBuyOrder' v-model="matchSettings.formData.ifMerchantPay" style="margin-left:0px; " :true-label='1' :false-label='0'>参与商家买入的匹配</el-checkbox>
          </el-form-item>
          <el-form-item label='' prop='busiTypeList' style="display:block;margin-bottom: 0px;">
            <el-checkbox v-model="matchSettings.formData.ifMatchSellOrder" :true-label='1' :false-label='0' @change='ifMatchSellOrderChange'>可参与卖单的匹配</el-checkbox>
          </el-form-item>
          <el-form-item label='' prop='busiTypeList' style="display:block;margin-bottom: 0px; " :true-label='1' :false-label='0'>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchSellOrder' v-model="matchSettings.formData.canSellAcptMatch" :true-label='1' :false-label='0'>可参与承兑人的卖单匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchSellOrder' v-model="matchSettings.formData.canSellUserMatch" :true-label='1' :false-label='0'>参与个人用户的卖单匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchSellOrder' v-model="matchSettings.formData.canSellBusiMatch" style="margin-right:20px; " :true-label='1' :false-label='0'>可参与商家的卖单匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchSellOrder' v-model="matchSettings.formData.comeChannels" style="margin-left:0px; " :true-label='1' :false-label='0'>可参与商家卖出的匹配</el-checkbox>
            <el-checkbox :disabled='!matchSettings.formData.ifMatchSellOrder' v-model="matchSettings.formData.ifMemberLoan" style="margin-left:0px; " :true-label='1' :false-label='0'>可参与会员出款的卖单匹配</el-checkbox>
          </el-form-item>
          <!-- @tip: 最大最小值应以数据库为主，具体的最大限制由rules控制 -->
          <div class="number-item" style="margin-top:20px;">
            <el-form-item label='匹配买单单笔金额范围：' prop='buySimpleMinRmb'>
              <el-input-number v-model.number='matchSettings.formData.buySimpleMinRmb' size="mini" :min="9" :max="49999" :precision="0" :step="1" placeholder="不小于9的整数"></el-input-number>
            </el-form-item>
            <span>至</span>
            <el-form-item label='' prop='buySimpleMaxRmb' label-width='0px'>
              <el-input-number v-model.number='matchSettings.formData.buySimpleMaxRmb' size="mini" :min="matchSettings.formData.buySimpleMinRmb? (matchSettings.formData.buySimpleMinRmb + 1 ): 11" :max="50000" :precision="0" :step="1" placeholder="不超过50000"></el-input-number>
            </el-form-item>
          </div>
          <br />
          <div class="number-item">
            <el-form-item label='匹配卖单单笔金额范围：' prop='sellSimpleMinRmb'>
              <el-input-number v-model='matchSettings.formData.sellSimpleMinRmb' size="mini" :min="10" :max="totalBzzGacMax - 1" :precision="0" :step="1" placeholder="不小于10的整数"></el-input-number>
            </el-form-item>
            <span>至</span>
            <el-form-item label='' prop='sellSimpleMaxRmb' label-width='0px'>
              <el-input-number v-model='matchSettings.formData.sellSimpleMaxRmb' size="mini" :min="matchSettings.formData.sellSimpleMinRmb? (matchSettings.formData.sellSimpleMinRmb + 1 ): 11" :max="totalBzzGacMax" :precision="0" :step="1" placeholder="不超过保证金"></el-input-number>
            </el-form-item>
          </div>
          <br />
          <el-form-item label='可用于卖单的现金：' prop='cashAmountRmb' label-width='164px'>
            <el-input-number v-model="matchSettings.formData.cashAmountRmb" size="mini" :min="0" :max="totalBzzGacMax" :precision="0" :step="1" placeholder="不小于保证金的整数"></el-input-number>
          </el-form-item>
          <br />
          <el-form-item label='同时进行中的买单金额：' prop='buyDoingMaxLimit' label-width='164px'>
            <el-input-number v-model="matchSettings.formData.buyDoingMaxLimit" size="mini" :min="1" :max="totalBzzGacMax" :precision="0" :step="1" placeholder="请输入不小于1的整数金额"></el-input-number>
          </el-form-item>
          <br />
          <el-form-item label='同时进行中的卖单金额：' prop='sellDoingMaxLimit' label-width='164px'>
            <el-input-number v-model="matchSettings.formData.sellDoingMaxLimit" size="mini" :min="1" :max="totalBzzGacMax" :precision="0" :step="1" placeholder="请输入不小于1的整数金额"></el-input-number>
          </el-form-item>
          <br />
          <el-form-item label='可同时进行的卖单：' prop='canSellDoingMaxNo' label-width='164px'>
            <el-input-number v-model="matchSettings.formData.canSellDoingMaxNo" size="mini" :min="1" :max="100" :precision="0" :step="1" placeholder="不小于1的整数"></el-input-number>
          </el-form-item>
          <br />
          <el-form-item label='每个收款账户可同时进行的买单：' prop='canBuyDoingMaxNo'>
            <el-input-number v-model="matchSettings.formData.canBuyDoingMaxNo" size="mini" :min="1" :max="100" :precision="0" :step="1" placeholder="不小于1的整数"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancelClick">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleUpadteMatchSettings">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {  acceptorList, acceptorUpdate, acceptorAlterStatus, removeAccepter, fineAccepter, acceptorDelete, acceptorPunish,
  getMatchInfo, updateMatchInfo} from '@/api/acceptor'
import { Message } from 'element-ui'
export default {
  name: 'acceptorManagement',
  data() {
    const validateAmount = (rule, value, callback) => {
      //  debugger
      //  buySimpleMaxRmb sellSimpleMaxRmb
      const totalBzzGacMax = this.totalBzzGacMax
      const totalBzzGac = this.matchSettings.formData.totalBzzGac
      const buySimpleMinRmb = this.matchSettings.formData.buySimpleMinRmb
      const buySimpleMaxRmb = this.matchSettings.formData.buySimpleMaxRmb
      const sellSimpleMinRmb = this.matchSettings.formData.sellSimpleMinRmb
      const sellSimpleMaxRmb = this.matchSettings.formData.sellSimpleMaxRmb
      switch (rule.field) {
        //  匹配买单单笔金额范围：
        case 'buySimpleMinRmb':
          if (buySimpleMaxRmb && value >= buySimpleMaxRmb) {
            callback(new Error('不能超过最大值'))
            return
          }
          // this.$refs['matchSettingsFormDataRef'].validateField('buySimpleMaxRmb')
          break;
        //  匹配买单单笔金额范围：
        case 'buySimpleMaxRmb':
          if (value > totalBzzGac || value > 50000 || (buySimpleMinRmb && value <= buySimpleMinRmb)) {
            callback(new Error(('最小值至' + totalBzzGac + '保证金（最多5万）')))
            return
          }
          // this.$refs['matchSettingsFormDataRef'].validateField('buySimpleMinRmb')
          break;
        //  匹配卖单单笔金额范围：
        case 'sellSimpleMinRmb':
          if (sellSimpleMaxRmb && value >= sellSimpleMaxRmb) {
            callback(new Error('不能超过最大值'))
            return
          }
          // this.$refs['matchSettingsFormDataRef'].validateField('sellSimpleMaxRmb')
          break;
        //  匹配卖单单笔金额范围：
        case 'sellSimpleMaxRmb':
          if (value > totalBzzGac || (sellSimpleMinRmb && value <= sellSimpleMinRmb)) {
            callback(new Error(('最小值至' + totalBzzGac + '保证金（最多100万）')))
            return
          }
          // this.$refs['matchSettingsFormDataRef'].validateField('sellSimpleMinRmb')
          break;
        default:
          return
          console.error('acceptorManagement validateAmount switch undefind')
      }
      callback()
    }
    return {
      // @tip: 最大值有改动必须立马更新，否则当后端返回值超过最大值时，el-input-number组件会将数据直接显示为最大值，导致展示数据与实际值不符
      //  @tip: 该值与buySimpleMaxRmb的提示语句100万冗余
      totalBzzGacMax: 1000000, //  保证金最大为100万GAC，所有输入不得超出
      penaltyName: '',
      dialogVisible: false,
      deleteDialogVisible: false,
      penaltydialogVisible: false,
      username: '',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      acceptorName: '',
      savescope: '',
      stopDialogVisible: false,
      startDialogVisible: false,
      matchSettingsDialog: false,

      btnLoading: false,// 按钮操作的处理状态
      /**
       * 匹配设置
       */
      matchSettings: {
        vsiible: false,
        formData: {},
        rules: {
          canSellDoingMaxNo: [
            { required: true, message: '请输入1～100的整数', trigger: ['blur', 'change'] }
          ],
          canBuyDoingMaxNo: [
            { required: true, message: '请输入1～100的整数', trigger: ['blur', 'change'] }
          ],
          cashAmountRmb: [
            { required: true, message: '请输入不小于保证金的整数', trigger: ['blur', 'change'] }
          ],
          // 匹配买单单笔金额范围：
          buySimpleMinRmb: [
            { required: true, message: '请输入不小于9的整数', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          // 匹配买单单笔金额范围：
          buySimpleMaxRmb: [
            { required: true, message: '请输入不超过保证金的整数,最大5万', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          //  匹配卖单单笔金额范围：
          sellSimpleMinRmb: [
            { required: true, message: '请输入不小于9的整数', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          //  匹配卖单单笔金额范围：
          sellSimpleMaxRmb: [
            { required: true, message: '请输入不超过保证金的整数,最大100万', trigger: ['blur', 'change'] },
            { trigger: ['blur', 'change'], validator: validateAmount }
          ],
          buyDoingMaxLimit: [
            { required: true, message: '请输入1～100万的整数金额', trigger: ['blur', 'change'] }
          ],
          sellDoingMaxLimit: [
            { required: true, message: '请输入1～100万的整数金额', trigger: ['blur', 'change'] }
          ]
        }
      },
      // 列表查询条件
      listQuery: {
        ifOnline: 'all',//在线和离线
        ifPause: 'all',// 承兑状态
        accountName: '',//账号名称
        fullName: '',//联系人
        page: 1,
        limit: 10
      },
      graded: [{
        value: '10',
        label: '10'
      }, {
        value: '20',
        label: '20'
      }, {
        value: '30',
        label: '30'
      }, {
        value: '40',
        label: '40'
      }, {
        value: '50',
        label: '50'
      }, {
        value: '60',
        label: '60'
      }, {
        value: '70',
        label: '70'
      }, {
        value: '80',
        label: '80'
      }, {
        value: '90',
        label: '90'
      }, {
        value: '100',
        label: '100'
      },],
      gradedModel: '',
      ruleForm: {
        account: '',
        paydeposit: '',
        nickname: '',
        username: '',
        telephone: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账户名', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        paydeposit: [
          { required: true, message: '请输入已交押金', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { min: 11, max: 14, message: '请输入正确的联系电话:11位', trigger: 'blur' }
        ]
      },
      ruleForm1: {
        penaltyCash: '',
        penaltyTips: ''
      },
      rules1: {
        penaltyCash: [
          { required: true, message: '请输入正确罚款金额', trigger: 'blur' },
          { min: 1, max: 200, message: '请输入正确罚款金额', trigger: 'blur' }
        ],
        penaltyTips: [
          { required: true, message: '请输入备注说明', trigger: 'blur' },
          { min: 1, max: 200, message: '请输入备注说明', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    cash(money) {
      if (((money / 10000) + '').length > 4 && (money / 10000) >= 10000) {
        return Number((money / 10000) / 10000).toFixed(4) + '万'
      } else {
        return Number(money / 10000).toFixed(4)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取数据
     */
    getList() {
      this.listLoading = true
      const params = {
        pageNo: this.listQuery.page,
        pageSize: this.listQuery.limit,
        accountName: this.listQuery.accountName,
        fullName: this.listQuery.fullName,
        ifPause: this.listQuery.ifPause == 'all' ? '' : this.listQuery.ifPause,
        ifOnline: this.listQuery.ifOnline == 'all' ? '' : this.listQuery.ifOnline,
      }
      acceptorList(params).then(res => {
        if (res.data.code === 200) {
          this.list = res.data.data.resultList
          this.total = res.data.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    /**
     * 查询承兑人
     *
     */
    handleSearchClick() {
      this.listQuery.page = 1
      this.getList()
    },
    /**
     * 编辑弹出框
     */
    handleEditClick(val, scope) {
      this.savescope = scope
      this.ruleForm.account = val.account_name
      this.ruleForm.paydeposit = (((val.deposit / 10000) + '').length > 4 && (val.deposit / 10000) >= 10000) ? ((val.deposit / 10000) / 10000) + '万' : (val.deposit / 10000)
      this.ruleForm.nickname = val.nickname
      this.ruleForm.username = val.fullname
      this.ruleForm.telephone = val.telephone
      this.dialogVisible = true
    },
    ifMatchBuyOrderChange(value) {
      if (value) {
        this.matchSettings.formData.canBuyAcptMatch = 1
        this.matchSettings.formData.canBuyBusiMatch = 1
        this.matchSettings.formData.canBuyUserMatch = 1
        this.matchSettings.formData.cashChannels = 1
        this.matchSettings.formData.ifMerchantPay = 1;
      }
    },
    ifMatchSellOrderChange(value) {
      if (value) {
        this.matchSettings.formData.canSellAcptMatch = 1
        this.matchSettings.formData.canSellUserMatch = 1
        this.matchSettings.formData.canSellBusiMatch = 1
        this.matchSettings.formData.comeChannels = 1
        this.matchSettings.formData.ifMemberLoan = 1;
      }
    },
    /**
     * 打开匹配设置
     */
    handleMatchSettingsOpen(row, scope) {
      getMatchInfo({ id: row.id }).then(res => {
        if (res.data.code === 200) {
          this.matchSettings.formData = res.data.data
          this.matchSettings.formData.totalBzzGac = ((this.matchSettings.formData.totalBzzGac || 0) / 10000).toFixed(4)
          this.matchSettings.formData.canSellDoingMaxNo = this.matchSettings.formData.canSellDoingMaxNo || 0
          this.matchSettings.formData.canBuyDoingMaxNo = this.matchSettings.formData.canBuyDoingMaxNo || 0
          this.matchSettings.formData.cashAmountRmb = (this.matchSettings.formData.cashAmountRmb || 0) / 10000
          this.matchSettings.formData.buySimpleMinRmb = (this.matchSettings.formData.buySimpleMinRmb || 0) / 10000
          this.matchSettings.formData.buySimpleMaxRmb = (this.matchSettings.formData.buySimpleMaxRmb || 0) / 10000
          this.matchSettings.formData.sellSimpleMinRmb = (this.matchSettings.formData.sellSimpleMinRmb || 0) / 10000
          this.matchSettings.formData.sellSimpleMaxRmb = (this.matchSettings.formData.sellSimpleMaxRmb || 0) / 10000
          this.matchSettings.formData.buyDoingMaxLimit = (this.matchSettings.formData.buyDoingMaxLimit || 0) / 10000
          this.matchSettings.formData.sellDoingMaxLimit = (this.matchSettings.formData.sellDoingMaxLimit || 0) / 10000
          this.matchSettingsDialog = true
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
     * 参与快捷承兑的匹配必须先勾选参商家买单匹配
     */
    cashChannelsChange(value) {
      value && (this.matchSettings.formData.canBuyBusiMatch = 1)
    },
    /**匹配设置修改 */
    handleUpadteMatchSettings() {
      this.$refs['matchSettingsFormDataRef'].validate((valid) => {
        // debugger
        if (!valid) {
          Message({
            message: "请按提示录入正确的表单",
            type: 'error',
            duration: 3 * 1000
          })
          return false
        }
        const params = { ...this.matchSettings.formData }
        if (!params.ifMatchBuyOrder) {
          params.canBuyAcptMatch = 0
          params.canBuyBusiMatch = 0
          params.canBuyUserMatch = 0
          params.cashChannels = 0
        }
        if (!params.ifMatchSellOrder) {
          params.canSellAcptMatch = 0
          params.canSellUserMatch = 0
          params.canSellBusiMatch = 0
          params.comeChannels = 0
        }
        if (this.btnLoading) return;
        this.btnLoading = true;
        updateMatchInfo(params).then(res => {
          this.btnLoading = false;
          if (!res || !res.data) {
            Message({
              message: '服务异常，请联系运维',
              type: 'error',
              duration: 5 * 1000
            })
            return
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 5 * 1000
            })
            return
          }
          Message({
            message: '提交成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.matchSettingsDialog = false
        }).catch(() => {
          this.btnLoading = false;
        })
      })

    },
    /**取消匹配弹框 */
    handleCancelClick() {
      this.matchSettingsDialog = false
    },

    /**
     * 编辑弹出框确认操作
     *
    */
    submitSureForm(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            fullname: this.ruleForm.username,
            userName: this.ruleForm.account,
            id: this.savescope.row.id,
            telephone: this.ruleForm.telephone
          }
          if (this.btnLoading) return;
          this.btnLoading = true;
          acceptorUpdate(params).then(res => {
            this.btnLoading = false;
            if (res.data.code === 200) {
              _this.list[_this.savescope.$index].fullname = this.ruleForm.username
              _this.list[_this.savescope.$index].telephone = this.ruleForm.telephone
              Message({
                message: '修改成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
            } else {
              this.listLoading = false
              Message({
                message: res.data.message,
                type: 'error',
                duration: 5 * 1000
              })
            }
          }).catch(() => {
            this.btnLoading = false;
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 暂定弹出框
     */
    handleStopClick(val, scope) {
      this.savescope = scope
      this.stopDialogVisible = true
    },
    /**
     * 暂定弹出框确认操作
     */
    stopDialogClick() {
      const _this = this
      const param = {
        accepterStatus: 'FROZEN',
        id: this.savescope.row.id,
        userName: this.savescope.row.account_name
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      acceptorAlterStatus(param).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          _this.list[_this.savescope.$index].accepterStatus = 'FROZEN'
          this.stopDialogVisible = false
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },
    /**
     * 启用弹出框
     */
    handleStartClick(val, scope) {
      this.savescope = scope
      this.startDialogVisible = true
    },
    startDialogClick() {
      const _this = this
      const param = {
        accepterStatus: 'ACCEPTABILITY',
        id: this.savescope.row.id,
        userName: this.savescope.row.account_name
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      acceptorAlterStatus(param).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          _this.list[_this.savescope.$index].accepterStatus = 'ACCEPTABILITY'
          this.startDialogVisible = false
        } else {
          this.listLoading = false
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },
    /**
     * 移除承兑人
     */
    handleDeleteClick(val, scope) {
      this.savescope = scope
      this.deleteDialogVisible = true
    },
    /**
     * 移除承兑人确认操作
     */
    deleteDialogClick() {
      removeAccepter({ from: this.$store.getters.loginParam.accountname, accepter: this.savescope.row.account_name }).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.getList()
            this.deleteDialogVisible = false
            this.$message({
              message: '移除成功',
              type: 'success'
            })
          } else {
            this.listLoading = false
            Message({
              message: res.data.message,
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
      })
    },
    /**
   * 罚款弹出框
   */
    handlePenaltyClick(val, scope) {
      this.penaltyName = val.account_name
      this.savescope = scope
      this.penaltydialogVisible = true
    },
    /**
     * 弹出框确认操作
     */
    handlePenaltySureClick(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = {
            from: _this.$store.getters.loginParam.accountname,
            accepter: _this.penaltyName,
            quan: Number(_this.ruleForm1.penaltyCash * 10000),
            reason: _this.ruleForm1.penaltyTips
          }
          if (this.btnLoading) return;
          this.btnLoading = true;
          fineAccepter(param).then(res => {
            this.btnLoading = false;
            if (res.data.code === 200) {
              this.getList()
              this.penaltydialogVisible = false
              this.$refs[formName].resetFields()
              Message({
                message: '修改成功',
                type: 'success',
                duration: 3 * 1000
              })
            } else {
              this.$refs[formName].resetFields()
              Message({
                message: res.data.message,
                type: 'error',
                duration: 5 * 1000
              })
            }
          }).catch(() => {
            this.btnLoading = false;
          })
        } else {
          return false
        }
      })
    },
    /**
     * 修改评分
     */
    changeGradeClick($event, row, scope) {
      const params = {
        fullname: row.fullname,
        id: row.id,
        userName: row.account_name,
        telephone: row.telephone,
        grade: row.grade
      }
      acceptorUpdate(params).then(res => {
        if (res.data.code === 200) {
          Message({
            message: '修改成功',
            type: 'success',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    resetpenaltyForm(formName) {
      this.ruleForm1.penaltyCash = ''
      this.$refs[formName].resetFields()
      this.penaltydialogVisible = false
    },
    /**
     * 切换label
     */
    changeLabelStatus(label, status) {
      this.listQuery[label] = status;
      this.listQuery.page = 1;
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
<style lang='scss' scoped>
.el-input {
  width: auto;
  margin-left: 10px;
}
.contaner-box {
  margin: 10px 30px 0 30px;
  font-size: 15px;
}
.box-spacing {
  display: block;
  margin-left: 20px;
  float: left;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
.hoverRight {
  display: inline-block;
  margin-left: 20px;
}

/* 工单状态的样式 */
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
// 匹配设置表单
.dialog-match-settings {
  form {
    .el-form-item {
      .el-input-number--mini {
        width: 190px;
        .el-input {
          // width: 190px;
        }
      }
    }
    .number-item {
      > .el-form-item:nth-last-of-type(1) {
        width: 170px;
        .el-input-number--mini {
          width: 190px;
        }
      }
      span {
        display: inline-block;
        margin-right: 10px;
        vertical-align: top;
        line-height: 36px;
      }
    }
  }
}
</style>

<style>
#pipei .el-form-item__label {
  padding: 0;
}
</style>


