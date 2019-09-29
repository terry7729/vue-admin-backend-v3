<template>
  <div style="position:relative;">
    <span style="font-size:13px;position:absolute;right:30px;top:5px;">
      <el-button type="text" @click="toExceptionOrder()">前往异常单查询</el-button>
    </span>
    <div class="search_box">
      <div class="search_list">
        <span>
          订单号：
          <el-select v-model="orderStatusModel" placeholder="请选择" style="width:100px;">
            <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input placeholder="请输入订单号" v-model="orderid" maxlength="20" clearable></el-input>
        </span>
        <span>
          会员名：
          <el-input placeholder="请输入会员名" v-model="memberAccount" maxlength="20" clearable></el-input>
        </span>
        <span>
          发起用户：
          <el-input placeholder="请输入发起用户名" v-model="accountname" maxlength="20" clearable></el-input>
        </span>
        <span>
          承兑人：
          <el-input placeholder="请输入承兑人" v-model="acceptorname" maxlength="20" clearable></el-input>
        </span>
        <span>
          支付来源：
          <el-select v-model="sourceItem" placeholder="请选择">
            <el-option v-for="item in paySourceItem" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
      </div>
      <div class="search_list">
        <span>
          订单时间：
          <el-date-picker v-model="pickerdate" style="width:160px;" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" default-time="00:00:00"></el-date-picker>
          <span>至</span>
          <el-date-picker v-model="pickerdate1" style="width:160px;" type="datetime" default-time="23:59:59" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间"></el-date-picker>
        </span>
        <span>
          完成时间：
          <el-date-picker v-model="finishPickerdate" type="datetime" style="width:160px;" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="开始时间"></el-date-picker>
          <span>至</span>
          <el-date-picker v-model="finishPickerdate1" type="datetime" style="width:160px;" value-format="yyyy-MM-dd HH:mm:ss"   default-time="23:59:59" placeholder="结束时间"></el-date-picker>
        </span>
        <span>
          支付通道：
          <el-select v-model="payChannel" placeholder="请选择">
            <el-option v-for="item in payChannelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
        <!-- <span>
          设备：
          <el-select v-model="deviece" placeholder="请选择">
            <el-option v-for="item in deviceList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </span>-->
      </div>
      <div class="search_list">
        <span>
          订单状态：
          <el-select v-model="orderstate" placeholder="请选择">
            <el-option v-for="item in orderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
        <span>
          订单类型：
          <el-select v-model="odertype" placeholder="请选择">
            <el-option v-for="item in orderState" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
        <span>
          交易额：
          <el-input placeholder="最小金额" maxlength="11" style="width:120px" clearable v-form-number v-model.number="minAmount"></el-input>
          <span>至</span>
          <el-input placeholder="最大金额" maxlength="11" style="width:120px" clearable v-form-number v-model.number="maxAmount"></el-input>
        </span>
        <span>
          <el-button type="primary" style="margin-left:10px;" @click="searchClick">查询</el-button>
          <el-button type style="margin-left:5px;" @click="resetClick">重置</el-button>
          <el-button type="primary" style="margin-left:5px;" @click="openRepairOrderDialog()">补单</el-button>
          <!-- <el-button type="primary" style="margin-left:5px;" :loading="exportLoading" @click="exportClick">导出</el-button> -->
        </span>
      </div>
    </div>

    <div class="tab-container">
      <el-table :key="tableKey" :data="list" v-loading="listLoading" border fit highlight-current-row>
        <el-table-column align="center" label="序号" width="65">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.$index+1}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{(scope.row.repair_origin_orderid&&scope.row.repair_origin_orderid!=0) ? '补单-' : ''}}{{scope.row.orderid}}</div>
          </template>
        </el-table-column>

        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;" v-if="scope.row.order_type=='ACTIVE_BUY'">买入</div>
            <div style="text-align:center;" v-else-if="scope.row.order_type=='ACTIVE_SELL'">卖出</div>
            <div style="text-align:center;" v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="支付来源" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;" v-if="scope.row.paySourceType==''">全部</div>
            <div style="text-align:center;" v-if="scope.row.paySourceType=='1'">APP买入</div>
            <div style="text-align:center;" v-if="scope.row.paySourceType=='2'">APP卖出</div>
            <div style="text-align:center;" v-if="scope.row.paySourceType=='3'">快捷承兑</div>
            <div style="text-align:center;" v-if="scope.row.paySourceType=='4'">商家出款</div>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;" v-if="scope.row.order_status===2 && scope.row.order_type==='ACTIVE_BUY'">待付款</div>
            <div style="text-align:center;" v-if="scope.row.order_status===2 && scope.row.order_type==='ACTIVE_SELL'">待付款</div>
            <div style="text-align:center;" v-if="scope.row.order_status===201 || scope.row.order_status===0">{{handleStatus('处理失败-',scope.row.str_pre_order_status)}}</div>
            <div style="text-align:center;" v-if="scope.row.order_status===3">已付款</div>
            <span v-if="scope.row.order_status===101">
              <div style="text-align:center;" v-if="scope.row.cancel_type===0">用户取消</div>
              <div style="text-align:center;" v-if="scope.row.cancel_type===1">系统自动取消</div>
              <div style="text-align:center;" v-if="scope.row.cancel_type===2">运营人员取消</div>
            </span>
            <span v-if="scope.row.order_status===203">
              <div style="text-align:center;" v-if="scope.row.cancel_type===0">用户取消未解冻</div>
              <div style="text-align:center;" v-if="scope.row.cancel_type===1">系统自动取消未解冻</div>
              <div style="text-align:center;" v-if="scope.row.cancel_type===2">运营人员取消未解冻</div>
            </span>
            <div style="text-align:center;" v-if="scope.row.order_status===4">已完成</div>
            <div style="text-align:center;" v-if="scope.row.order_status===300">{{handleStatus('处理中-',scope.row.str_order_status)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="支付通道" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{transformPayChannel(scope.row.payment_channel)||"-"}}</div>
          </template>
        </el-table-column>
        <el-table-column label="发起人" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.eosno===''  || scope.row.eosno===null">
              <div style="text-align:center;">-</div>
            </div>
            <div v-else>
              <div style="text-align:center;">{{scope.row.eosno}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="承兑人" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.to_no==='' || scope.row.to_no===null">
              <div style="text-align:center;">-</div>
            </div>
            <div v-else>
              <div style="text-align:center;color:#409EFF;cursor:pointer;" @click="checkAcceptorInfor(scope.row)">{{scope.row.to_no}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量(GAC)" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{Number(scope.row.quan/10000).toFixed(4)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="单价(CNY)" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{Number(scope.row.gac_price).toFixed(2)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="交易额(CNY)" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{Number(scope.row.deal_quan/10000).toFixed(2)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单时间" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.create_timestamp }}</div>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" align="center">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.finish_time || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="会员名" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.sub_name==='' || scope.row.sub_name===null">
              <div style="text-align:center;">--</div>
            </div>
            <div v-else>
              <div style="text-align:center;">{{scope.row.sub_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="补单原因/转账截图" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tran_screen&&scope.row.tran_screen.length>0" @click="showPayImageModal(scope.row.tran_screen,scope.row.remark)">
              <i class="el-icon-picture" style="font-size: 30px;color: #409EFF;cursor:pointer;"></i>
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="220px;" label="操作" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!-- 买入操作 -->
            <template v-if="scope.row.order_type=='ACTIVE_BUY'">
              <el-button size="mini" type="text" v-if="scope.row.repair_origin_orderid && scope.row.repair_origin_orderid!=scope.row.orderid" @click="searchRepairOrder(scope.row.repair_origin_orderid)" style="margin-right:10px;">查看关联订单</el-button>
              <el-button size="mini" type="text" v-if="scope.row.peer_order_no && scope.row.peer_order_no!=0" @click="searchRepairOrder(scope.row.peer_order_no)">查看补单</el-button>
              <el-button size="mini" type="text" v-if="isRepairOrder(scope.row) && scope.row.paySourceType==3" @click="openRepairOrderDialog(scope)">补单</el-button>
              <template v-if="scope.row.order_status==2">
                <el-button size="mini" type="text" @click="handleCancelClick(scope.row,scope)">取消订单</el-button>
                <el-button size="mini" type="text" @click="handlePayClick(scope.row,scope)">放行</el-button>
              </template>
              <template v-if="scope.row.order_status==3">
                <el-button size="mini" type="text" @click="handleCancelClick(scope.row,scope)">取消订单</el-button>
                <el-button size="mini" type="text" @click="handlePayClick(scope.row,scope)">放行</el-button>
              </template>
            </template>
            <!-- 卖出操作 -->
            <template v-else-if="scope.row.order_type=='ACTIVE_SELL'">
              <template v-if="scope.row.order_status==2">
                <el-button size="mini" type="text" @click="handleCancelClick(scope.row,scope)">取消订单</el-button>
              </template>
              <template v-if="scope.row.order_status==3">
                <el-button size="mini" type="text" @click="handleCancelClick(scope.row,scope)">取消订单</el-button>
                <el-button size="mini" type="text" s @click="handlePayClick(scope.row,scope)">放行</el-button>
              </template>
            </template>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!--重新分配订单-->
    <el-dialog title="重新分配" :visible.sync="resartdialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户" prop="accountName">
          <el-input v-model="ruleForm.accountName" placeholder="请输入账户名" style="width:100%; margin-left:0px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resartdialogClick('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="handleRestartSureClick('ruleForm')">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--重新分配订单下一步-->
    <el-dialog title="重新分配" :visible.sync="orderdialogVisible" width="30%">
      <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账户名：">
          <span>{{username}}</span>
        </el-form-item>
        <el-form-item label="承兑人姓名：">
          <span>{{accepterusernmae}}</span>
        </el-form-item>
        <div style="padding:0 0 25px 15px;">确定将订单{{accepterId}}重新分配给该承兑人？</div>
        <el-form-item>
          <el-button type="primary" @click="handleOrderSureClick">确 定</el-button>
          <el-button @click="dialogPrevisibleClick('ruleForm')">上一步</el-button>
          <el-button @click="orderdialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--银行卡显示-->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="承兑人">
          <span>{{bankAccepter}}</span>
        </el-form-item>
        <el-form-item :label="bankType">
          <span>{{bankGetType}}</span>
        </el-form-item>
        <el-form-item :label="bankTypeCard">
          <span>{{bankGetCard}}</span>
        </el-form-item>
        <el-form-item label="持卡人姓名">
          <span>{{bankUserName}}</span>
        </el-form-item>
        <el-form-item label="开户银行" prop="sellfee">
          <span>{{bankName}}</span>
        </el-form-item>
        <el-form-item label="开户支行" prop="sellfee">
          <span>{{bankBranch}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--微信显示-->
    <el-dialog :visible.sync="dialogWechantVisible" width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="承兑人">
          <span>{{wechantAccepter}}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{wechantName}}</span>
        </el-form-item>
        <el-form-item label="微信账号">
          <span>{{wechantAccount}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--支付宝显示-->
    <el-dialog :visible.sync="dialogAlipayVisible" width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="承兑人">
          <span>{{alipayAccepter}}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{alipayName}}</span>
        </el-form-item>
        <el-form-item label="支付宝账号">
          <span>{{alipayAccount}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--云闪付显示-->
    <el-dialog :visible.sync="dialogQuikPassVisible" width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="承兑人">
          <span>{{quikPassAccepter}}</span>
        </el-form-item>
        <el-form-item :label="bankType">
          <span>{{quikPassGetType}}</span>
        </el-form-item>
        <el-form-item :label="bankTypeCard">
          <span>{{quikPassGetCard}}</span>
        </el-form-item>
        <el-form-item label="持卡人姓名">
          <span>{{quikPassUserName}}</span>
        </el-form-item>
        <el-form-item label="开户银行" prop="sellfee">
          <span>{{quikPassName}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--卖出未付款-->
    <el-dialog :visible.sync="waitDialogVisible" width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="承兑人">
          <span>{{accepter}}</span>
          <div style="color:red;margin-left: -50px;">承兑人还未付款</div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--支付宝显示-->
    <el-dialog :visible.sync="payDialogVisible" width="30%">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="承兑人">
          <span>{{payAccepter}}</span>
        </el-form-item>
        <el-form-item :label="payType">
          <span>{{payGetType}}</span>
        </el-form-item>
        <el-form-item label="姓名(支付宝)">
          <span>{{payGetCard}}</span>
        </el-form-item>
        <el-form-item :label="payAccount">
          <span>{{payUserName}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 转账截图 -->
    <el-dialog title="转账截图" :visible.sync="isShowPayImagesModal" width="width:600px;">
      <div>
        <div class="clearfix">
          <img v-for="(item,index) in payedImageUrl" @click="openLookBigImgModal(item)" style="width:31%;float:left;margin:5px;" :src="item" />
        </div>
        <div class="clearfix" style="margin:10px 0px;padding:10px 0px;">备注：{{payedRemark||"-"}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowPayImagesModal=false;payedImageUrl=[];payedRemark='';">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="1080px">
      <div style="text-align:center;">
        <img :src="lookBigImgUrl" style="max-width:100%;" />
      </div>
    </el-dialog>
    <!-- 新建和修改补单操作 -->
    <el-dialog title="补单" :visible.sync="repairOrder.visible" class="form-repair-order" width="800px">
      <el-form :model="repairOrder.formData" :rules="repairOrder.rules" ref="repairOrderFormRef" label-suffix="：" label-width="100px">
        <el-form-item label="发起人" prop="sponsor">
          <el-select v-model="repairOrder.formData.sponsor" filterable placeholder="请输入发起人搜索后选择">
            <el-option v-for="item in repairOrder.remoteList.sponsorList" :key="item.id" :label="item.accountName" :value="item.accountName">{{item.accountName+'（' + item.merchantName+'）'}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承兑人" prop="accepter">
          <el-select v-model="repairOrder.formData.accepter" @change="reqPayCardInfoList" filterable placeholder="请输入承兑人搜索后选择">
            <el-option v-for="item in repairOrder.remoteList.accepterList" :key="item.id" :label="item.accountName" :value="item.accountName">{{item.accountName+'（' + item.fullName+'）'}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款账号" prop="payCardId">
          <el-select :disabled="!repairOrder.formData.accepter" @change="payCardInfoChange" v-model="repairOrder.formData.payCardId" filterable :title="!repairOrder.formData.accepter ? '需先选择承兑人' : ''" :placeholder="!repairOrder.formData.accepter ? '请先选择承兑人' : '请选择付款账号'" :loading="repairOrder.loading.payCardId">
            <el-option-group v-for="group in repairOrder.remoteList.payCardInfoList" :key="group.cardType" :label="group.cardType">
              <el-option v-for="item in group.payCardInfoList" :key="item.id" :label="item.cardNo" :value="item.id">{{item.bankAccName + '（' + item.cardNo+'）'}}</el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="会员名" prop="fastSubName">
          <el-input v-model="repairOrder.formData.fastSubName" maxlength="20" placeholder="请输入会员名"></el-input>
        </el-form-item>
        <el-form-item label="交易金额" prop="amount">
          <!-- v-form-number -->
          <el-input v-model.number="repairOrder.formData.amount" placeholder="请输入交易金额" @input="inputForAbnormalBill">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label='异常单号'>
          <el-select v-model="repairOrder.formData.abnormalBillNo" filterable :disabled="renderAbnormalDisabled" :placeholder="!repairOrder.formData.payCardId?'请选择承兑人/付款账号':'请选择异常单号'">
            <el-option v-for="item in exceptionOrderOfWeekList" :label="item.AbnormalBillNo+' '+Number(item.Amount/10000)+'元 '+item.ReceivingTime" :value="item.AbnormalBillNo">
              {{item.AbnormalBillNo}}&nbsp;&nbsp;&nbsp;&nbsp;金额：{{Number(item.Amount/10000).toFixed(2)}}元 &nbsp;&nbsp;&nbsp;&nbsp;到账时间：{{item.ReceivingTime}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单时间" prop="applyTime">
          <el-date-picker v-model="repairOrder.formData.applyTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择订单时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="补单原因">
          <el-select placeholder="请选择补单原因" v-model="repairOrder.formData.repairReason1" @change="selectrepairReason">
            <el-option value="会员已转账，但承兑人没放行" label="会员已转账，但承兑人没放行"></el-option>
            <el-option value="会员没下单，直接转账" label="会员没下单，直接转账"></el-option>
            <el-option value="会员转账金额与订单不符" label="会员转账金额与订单不符"></el-option>
            <el-option value="代会员出款" label="代会员出款"></el-option>
            <el-option value="承兑人收款卡超出限额" label="承兑人收款卡超出限额"></el-option>
            <el-option value="延时赔偿" label="延时赔偿"></el-option>
            <el-option value="其它类型" label="其它类型"></el-option>
          </el-select>
          <el-input type="textarea" rows="4" v-model="repairOrder.formData.repairReason" placeholder="请输入补单原因" style="width:530px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repairOrder.visible = false">取 消</el-button>
        <el-button type="primary" :disabled="repairOrder.budanBtnDisabled" @click="sumbitRepairOrder()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 取消订单提示 -->
    <el-dialog title="温馨提示" :visible.sync="cancelOrderModal" width="640px">
      <div>
        <i class="el-icon-info" style="font-size:18px;color:#E6A23C;margin-right:10px;"></i>
        确定取消该订单吗？
      </div>
      <div slot="footer">
        <el-button type="default" @click="cancelOrderModal=false;">取消</el-button>
        <el-button type="primary" @click="cancelOrderSubmit()" :disabled="btnDisabled">确定</el-button>
      </div>
    </el-dialog>
    <!-- 放行订单提示 -->
    <el-dialog title="温馨提示" :visible.sync="fangxingOrderModal" width="640px">
      <div>
        <i class="el-icon-info" style="font-size:18px;color:#E6A23C;margin-right:10px;"></i>
        确定放行该订单吗？
      </div>
      <div slot="footer">
        <el-button type="default" @click="fangxingOrderModal=false;">取消</el-button>
        <el-button type="primary" @click="fangxingOrderSubmit()" :loading="btnDisabled">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {
  orderManageList,
  cancelOrder,
  startAcceptor,
  reStartOrder,
  exportList,
  queryPayCardInfoDetail,
  unfreezeAccepterGAC,
  dischargedTrade,
  repairOrder,
  getPayCardInfo,
  getMerchantList,
  getAccepterList,
  checkMsgBusiNew,
  passOrder
} from "@/api/accountManage";
import { getAbnormalBillOfWeek } from '@/api/exceptionOrder.js'
import { Message } from "element-ui";
import { notify } from "@/utils/index";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import Vue from "vue";
export default {
  data() {
    // 获取默认当天的时间，yyyy-mm-dd HH:mm:ss
    const getDefaultDate = function () {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + '-' + (month > 9 ? month : ('0' + month)) + '-' + (day > 9 ? day : ('0' + day));
    }
    let date1 = getDefaultDate() + ' 00:00:00';
    let date2 = getDefaultDate() + ' 23:59:59';


    return {
      orderStatusModel: '0',
      orderStatus: [{
        label: '全部',
        value: '0'
      }, {
        label: '正常单',
        value: '1'
      }, {
        label: '补单',
        value: '2'
      }],
      // 取消订单
      cancelOrderModal: false,
      fangxingOrderModal: false,
      btnDisabled: false,
      sourceItem: "",
      paySourceItem: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "APP买入",
          value: "1"
        },
        {
          label: "APP卖出",
          value: "2"
        },
        {
          label: "快捷承兑",
          value: "3"
        },
        {
          label: "商家出款",
          value: "4"
        }
      ],
      exportLoading: false,
      paySource: "",
      payChannelList: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "银行卡转账",
          value: "BANK_CARD"
        },
        {
          label: "支付宝转银行卡",
          value: "ALIPAY_BANK"
        },
        {
          label: "微信转银行卡",
          value: "WECHAT_BANK"
        },
        {
          label: "支付宝扫码",
          value: "ALIPAY"
        },
        {
          label: "微信扫码",
          value: "WECHAT"
        },
        {
          label: "云闪付",
          value: "QUICKPASS"
        },
        {
          label: "支付宝H5",
          value: "BUSINESS_ALIPAY"
        },
        {
          label: "支付宝扫码转银行卡",
          value: "BUSINESS_ALIPAY_BANK"
        }
      ],
      // img: {
      //   visible: false,
      //   payedImageUrl: '',
      //   payedRemark: ''
      // },
      msgTime: 0,
      //  交易额
      minAmount: "",
      maxAmount: "",
      finishPickerdate: "",
      finishPickerdate1: "",
      dialogQuikPassVisible: false,
      quikPassAccepter: "",
      quikPassGetType: "",
      quikPassGetCard: "",
      quikPassUserName: "",
      quikPassName: "",
      dialogWechantVisible: false,
      wechantAccepter: "",
      wechantName: "",
      wechantAccount: "",
      dialogAlipayVisible: false,
      alipayAccepter: "",
      alipayName: "",
      alipayAccount: "",
      waitDialogVisible: false,
      payRow: "",
      payScope: "",
      pickerdate: date1,
      pickerdate1: date2,
      tableKey: 0,
      list: null,
      total: null,
      totallist: null,
      listLoading: true,
      odertype: "",
      orderstate: "",
      payChannel: "",
      accountname: "",
      acceptorname: "",
      orderid: this.$router.history.current.params.orderId.indexOf(":orderId") >= 0 ? "" : this.$router.history.current.params.orderId,
      username: "",
      accepterusernmae: "",
      accepterId: "",
      accepter: "",
      memberAccount: "",
      resartdialogVisible: false,
      orderdialogVisible: false,
      dialogVisible: false,
      bankAccepter: "",
      bankGetType: "",
      bankGetCard: "",
      bankUserName: "",
      bankName: "",
      bankBranch: "",
      bankType: "",
      bankTypeCard: "",
      payDialogVisible: false,
      payAccepter: "",
      payGetType: "",
      payGetCard: "",
      payAccount: "",
      payType: "",
      payUserName: "",
      saveRow: {},
      saveScope: {},
      manual_bill: 0,
      setTime: {
        timer: null
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      ruleForm: {
        accountName: ""
      },
      rules: {
        accountName: [
          { required: true, message: "请输入6~12位帐号", trigger: "blur" },
          { min: 6, max: 12, message: "请输入6~12位帐号", trigger: "blur" }
        ]
      },
      paySourceList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "APP买入"
        },
        {
          value: "2",
          label: "APP卖出"
        },
        {
          value: "3",
          label: "快捷承兑"
        },
        {
          value: "4",
          label: "商家出款"
        }
      ],
      orderType: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "MATCH_FAIL",
          label: "处理失败"
        },
        {
          value: "WAIT_PAY",
          label: "待付款"
        },
        {
          value: "PAYED",
          label: "已付款"
        },
        {
          value: "FINISH",
          label: "已完成"
        },
        {
          value: "CANCEL",
          label: "已取消"
        },
        {
          value: "CANCELFROZEN",
          label: "超时取消"
        },
        {
          value: "ORDER_STATUS_PROCESSING",
          label: "处理中"
        }
      ],
      orderState: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "ACTIVE_BUY",
          label: "买入"
        },
        {
          value: "ACTIVE_SELL",
          label: "卖出"
        }
      ],
      deviece: "",
      deviceList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "未知"
        },
        {
          value: "1",
          label: "手机端"
        },
        {
          value: "2",
          label: "PC"
        }
      ],
      isShowPayImagesModal: false,
      payedImageUrl: [],
      payedRemark: "",

      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: "",

      orderLastTime: new Date().getTime(),
      orderHistoryIds: [],
      //  补单
      repairOrder: {
        loading: {
          sponsor: false,
          accepter: false,
          payCardId: false,
          repairOrder: false
        },
        remoteList: {
          sponsorList: [],
          accepterList: [],
          payCardInfoList: []
        },
        rules: {
          sponsor: [
            {
              required: true,
              message: "请输入发起人并选择",
              trigger: ["blur", "change"]
            }
          ],
          accepter: [
            {
              required: true,
              message: "请输入承兑人并选择",
              trigger: ["blur", "change"]
            }
          ],
          payCardId: [
            {
              required: true,
              message: "请选择付款账号",
              trigger: ["blur", "change"]
            }
          ],
          fastSubName: [
            {
              required: true,
              message: "请输入会员名",
              trigger: ["blur", "change"]
            }
          ],
          applyTime: [
            {
              required: true,
              message: "请选择关联订单时间",
              trigger: ["blur", "change"]
            }
          ],
          amount: [
            {
              required: true,
              message: "请输入交易金额",
              trigger: ["blur", "change"]
            },
            {
              validator: (rule, value, callback) => {
                if (/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(value)) {
                  callback();
                } else {
                  callback(new Error("交易金额为数字，可以保留2位小数"))
                }
              }, trigger: ["blur", "change"]
            }
          ]
        },
        formData: {
          amount: null,
          create_timestamp: "",
          applyTime: "",
          sponsor: "",
          accepter: "",
          payCardId: "",
          payCardUq: "",
          fastSubName: "",
          accepter: "",
          tradeApplyUq: "",
          abnormalBillNo: '',
          repairReason: '',
          repairReason1: '',
          transferTime: '',
        },
        visible: false,

        budanBtnDisabled: false, // 补单的按钮是否可用，防止用户多次点提交
        budanBtnTimer: null,
      },
      exceptionOrderOfWeekList: [],// 最近7天的异常单信息列表
    };
  },
  computed: {
    renderAbnormalDisabled() {
      if (this.repairOrder.formData.accepter && this.repairOrder.formData.payCardId) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    this.renderExceptionParams();
    this.getList();
    this.getTimetotal();
    this.setTime.timer = setInterval(() => {
      // this.getTimetotal();
    }, 5000);
  },
  watch: {
    totallist: function (newData, oldData) {
      this.totallist = newData;
      notify("你有新订单", "order");
    }
  },
  beforeDestroy() {
    clearInterval(this.setTime.timer);
    this.setTime.timer = null;
  },
  methods: {
    /**
     * @description: 转换支付通道的显示
     * @param {type} 
     * @return: 
     */
    transformPayChannel(data) {
      if (!data) return ''
      for (let item of this.payChannelList) {
        if (item.value === data) {
          return item.label
        }
      }
    },
    /**
     * 订单处理的状态
     */
    handleStatus(prestr, status) {
      if (status == "ORDER_WAIT_USER_ACK_ORDER") {
        return prestr + '等待用户确认单号';
      }
      else if (status == "ORDER_REQ_MATCH_ACCEPTER") {
        return prestr + '买单正在向承兑人中心申请';
      }
      else if (status == "ORDER_MATCH_ACCEPTER_SUCCEEDED") {
        return prestr + '买单匹配承兑人成功';
      }
      else if (status == "ORDER_STATUS_FREEZING") {
        return prestr + '正在冻结资金';
      }
      else if (status == "ORDER_STATUS_FREEZING_SUCCEEDED") {
        return prestr + '冻结余额成功';
      }
      else if (status == "ORDER_STATUS_SELL_REQ__MATCH_ACCEPTER") {
        return prestr + '卖单申请匹配承兑人';
      }
      else if (status == "ORDER_STATUS_SELL_MATCH_ACCEPTER_SUCCEEDED") {
        return prestr + '卖单匹配承兑人成功';
      }
      else if (status == "ORDER_STATUS_THAWING") {
        return prestr + '正在解冻';
      }
      else if (status == "ORDER_STATUS_THAWING_SUCCEEDED") {
        return prestr + '解冻成功';
      }
      else if (status == "ORDER_STATUS_USER_CONFIRM_PAY") {
        return prestr + '用户已经付款';
      }
      else if (status == "ORDER_STATUS_PASSING") {
        return prestr + '放行中';
      }
      else if (status == "ORDER_AUDIT_NOT_PASS") {
        return prestr + '审核未通过';
      }
      else if (status == "ORDER_TO_BE_AUDIT") {
        return prestr + '待审核';
      }
      else if (status == "ORDER_EOS_OP_BEGIN") {
        return prestr + '链上进行操作';
      }
      else if (status == "ORDER_STATUS_PASSING") {
        return prestr + '放行中';
      }
      else if (status == "ORDER_CREATED") {
        return prestr + '订单已创建';
      }
      else if (status == "ORDER_AUDIT_PASS") {
        return prestr + '审核通过';
      }
      else if (status == "ORDER_AUDIT_NOT_PASS") {
        return prestr + '审核没通过';
      }
      else if (status == "ORDER_FAILED") {
        return prestr + '订单失败';
      }
      else if (status == "ORDER_FINISHED") {
        return prestr + '订单成功';
      }
      else if (status == "ORDER_CANCELED") {
        return prestr + '订单被取消';
      }
      else if (status == "ORDER_STATUS_ENDRET_UNKNOWN") {
        return prestr + '订单完成状态未知';
      }
      else if (status == "ORDER_STATUS_PAYMENT_ACCOUNT_HAS_SENT_USER") {
        return prestr + '已经返回给客户端接受付款的账号';
      }
      else if (status == "ORDER_EOS_OP_SUCESS") {
        return prestr + '链上操作成功';
      } else {
        return prestr + '其他'
      }
    },

    /**
     * 导出
     * @param {*} data: any
     */
    exportClick() {
      /** *************************************** 表单校验 ************************************************* */
      if (!this.pickerdate || !this.pickerdate1) {
        Message({
          message: "请选择订单时间段",
          type: "error",
          duration: 3 * 1000
        });
        return;
      }

      // 验证开始时间不能大于结束时间
      if (
        new Date(this.pickerdate.replace(/-/g, "/")).getTime() >=
        new Date(this.pickerdate1.replace(/-/g, "/")).getTime()
      ) {
        Message({
          message: "订单开始时间不能大于等于结束时间",
          type: "error",
          duration: 3 * 1000
        });
        return;
      }

      //判断导出是否有超过七天
      let getDate =
        new Date(this.pickerdate1.replace(/-/g, "/")).getTime() -
        new Date(this.pickerdate.replace(/-/g, "/")).getTime();
      let getSevenDayMsec = 1000 * 60 * 60 * 24 * 7;
      if (getDate > getSevenDayMsec) {
        Message({
          message: "只能导出7天内的流水账单!",
          type: "error",
          duration: 3 * 1000
        });
        return;
      }
      /** *************************************** 整理查询条件 ************************************************* */

      let param = {
        finishedStartDate: this.finishPickerdate,
        finishedEndDate: this.finishPickerdate1,
        accepterName: this.acceptorname.replace(/\s+/g, ""),
        accountName: this.accountname.replace(/\s+/g, ""),
        endDate: this.pickerdate1,
        startDate: this.pickerdate,
        status: this.orderstate,
        tradeType: this.odertype,
        paySource: this.paySource,
        tradeId: this.orderid.replace(/\s+/g, ""),
        fastSubName: this.memberAccount.replace(/\s+/g, "")
      };
      /** *************************************** 请求操作 ***************************************************** */
      // 导出默认先查询页面展示最新的结果再导出
      this.searchClick();
      this.exportLoading = true;
      console.log("export: ", param);
      exportList(param)
        .then(res => {
          this.exportLoading = false;
          if (!res || !res.data) {
            this.$message({
              message: "网络异常，请联系运维",
              type: "error"
            });
            return;
          }
          if (res.data.code && res.data.code !== 200) {
            this.$message({
              message: res.data.message,
              type: "error"
            });
            return;
          }
          const blob = new Blob([res.data]);
          var elink = document.createElement("a");
          elink.download = "订单.xlsx";
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch(res => {
          this.$message({
            message: "抱歉，导出数据失败",
            type: "error"
          });
          this.exportLoading = false;
        });
    },
    /****************************** 获取服务器下拉数据 *************************/
    // 发起人联想搜索
    reqAccountnameList() {
      getMerchantList({ searchKey: "", pageNo: 1, pageSize: 1000 })
        .then(res => {
          if (!res || !res.data) {
            Message({
              message: "网络异常，请联系运维",
              type: "error",
              duration: 5 * 1000
            });
            return;
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message,
              type: "error",
              duration: 5 * 1000
            });
            return;
          }
          this.repairOrder.remoteList.sponsorList = res.data.data || [];
        })
        .catch(res => {
          this.repairOrder.loading.sponsor = false;
        });
    },
    // 承兑人联想搜索
    reqAcceptornameList() {
      getAccepterList({ searchKey: "", currentPage: 1, pageSize: 1000 }).then(
        res => {
          if (!res || !res.data) {
            Message({
              message: "网络异常，请联系运维",
              type: "error",
              duration: 5 * 1000
            });
            return;
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message,
              type: "error",
              duration: 5 * 1000
            });
            return;
          }
          this.repairOrder.remoteList.accepterList = res.data.data.list || [];
        }
      );
    },
    /**
     * 手动获取id
     * 直接将el-select的:value=设置为item对象会出现视图不能立即展示和表单无法校验的问题
     */
    getPayCard(payCardId) {
      if (payCardId) {
        const payCardInfoList =
          this.repairOrder.remoteList.payCardInfoList || [];
        for (let i = 0; i < payCardInfoList.length; i++) {
          const group = payCardInfoList[i];
          for (let k = 0; k < group.payCardInfoList.length; k++) {
            const payCardInfo = group.payCardInfoList[k];
            if (payCardInfo.id == payCardId) {
              return payCardInfo;
            }
          }
        }
        return null;
      }
      return null;
    },
    /**
     * 通过卡号获得卡的id
     */
    getPayCardIdByCardNo(cardNo) {
      if (cardNo) {
        const payCardInfoList =
          this.repairOrder.remoteList.payCardInfoList || [];
        for (let i = 0; i < payCardInfoList.length; i++) {
          const group = payCardInfoList[i];
          for (let k = 0; k < group.payCardInfoList.length; k++) {
            const payCardInfo = group.payCardInfoList[k];
            if (payCardInfo.cardNo == cardNo) {
              return payCardInfo;
            }
          }
        }
        return null;
      }
      return null;
    },
    /**
     * 设置付款账号值
     * 不做一次赋值就无法立即显示出刚选的数据
     */
    payCardInfoChange(payCardId) {
      let payCard = this.getPayCard(payCardId) || {};
      this.repairOrder.formData.payCardId = payCard.id || null;
      this.repairOrder.formData.payCardUq = payCard.cardNo || null;
      this.repairOrder.formData.cardType = payCard.userCardType || null;
      this.repairOrder.formData.abnormalBillNo = '';
      // 用这种强制触发视图更新
      this.repairOrder.formData = JSON.parse(JSON.stringify(this.repairOrder.formData));

      this.getAbnormalBillOfWeek();
    },

    // 承兑人付款账号列表
    reqPayCardInfoList() {
      this.repairOrder.remoteList.payCardInfoList = [];
      if (!this.repairOrder.formData.accepter) {
        return;
      }
      this.repairOrder.loading.payCardInfo = true;
      getPayCardInfo({
        accepterName: this.repairOrder.formData.accepter,
        pageNo: 1,
        pageSize: 1000
      }).then(res => {
        this.repairOrder.loading.payCardInfo = false;
        if (!res || !res.data) {
          Message({
            message: "网络异常，请联系运维",
            type: "error",
            duration: 5 * 1000
          });
          return;
        }
        if (res.data.code !== 200) {
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
          return;
        }
        this.repairOrder.remoteList.payCardInfoList = res.data.data || [];
        this.repairOrder.formData.abnormalBillNo = '';
        //  获取卡号其他信息
        if (this.repairOrder.formData.payCardId) {
          this.payCardInfoChange(this.repairOrder.formData.payCardId);
        }
        // 默认绑定卡号
        if (this.repairOrder.formData.payCardUq) {
          let payCard = this.getPayCardIdByCardNo(this.repairOrder.formData.payCardUq);
          this.repairOrder.formData.payCardId = payCard.id || null;
          this.repairOrder.formData.payCardUq = payCard.cardNo || null;
          this.repairOrder.formData.cardType = payCard.userCardType || null;
        }
        this.repairOrder.formData = JSON.parse(JSON.stringify(this.repairOrder.formData))
      })
        .catch(res => {
          this.repairOrder.loading.payCardInfo = false;
        });
    },

    /**
     * 打开补单弹窗
     */
    openRepairOrderDialog(scope) {
      this.repairOrder.visible = true;
      // 获得所有的发起人和承兑人
      this.reqAccountnameList();
      this.reqAcceptornameList();
      if (this.$refs["repairOrderFormRef"]) {
        this.repairOrder.formData = {};
        this.$refs["repairOrderFormRef"].resetFields();
      }
      if (scope) {
        this.repairOrder.formData = {
          tradeApplyUq: scope.row.orderid,
          sponsor: scope.row.eosno,
          accepter: scope.row.to_no,
          fastSubName: scope.row.sub_name,
          amount: (Number(scope.row.quan) / 10000).toFixed(2),
          applyTime: scope.row.create_timestamp,
          payCardUq: scope.row.mrCardUq
        };
        console.log(this.repairOrder.formData);
        if (this.repairOrder.formData.accepter) {
          this.reqPayCardInfoList();
          this.getAbnormalBillOfWeek();
        }
      }
    },
    /**
     * 是否能补单
     * 订单状态为运营取消，用户取消，换卡取消，超时取消已解冻
     */
    isRepairOrder(row) {
      const applyDate = new Date(row.create_timestamp.replace(/-/g, "/"));
      //  已经有补单
      if (row.peer_order_no) {
        return false;
      }
      // 3天内的订单可以补单
      else if (applyDate.getTime() < (new Date().getTime() - 3 * 24 * 60 * 60 * 10000)) {
        return false;
      } else {
        if (row.order_status == 101 || row.order_status == 203) {
          return true;
        } else {
          return false;
        }
      }
    },
    /**
     * 查看补单/关联订单
     */
    searchRepairOrder(orderid) {
      this.resetClick();
      this.orderid = orderid || "";
      this.searchClick();
    },
    /**格式化时间 */
    formatDate(date, fmt) {
      var currentDate = new Date(date);
      var o = {
        "M+": currentDate.getMonth() + 1, //月份
        "d+": currentDate.getDate(), //日
        "h+": currentDate.getHours(), //小时
        "m+": currentDate.getMinutes(), //分
        "s+": currentDate.getSeconds(), //秒
        "q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
        S: currentDate.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },

    /**
     * 提交补单
     */
    sumbitRepairOrder() {
      if (!this.repairOrder.budanBtnDisabled) {
        this.$refs["repairOrderFormRef"].validate(valid => {
          if (valid) {
            let reqData = this.repairOrder.formData;
            delete reqData.payCardInfo;

            this.repairOrder.budanBtnDisabled = true;
            repairOrder(reqData).then(res => {
              this.repairOrder.budanBtnDisabled = false;
              if (res.data.code == 200) {
                this.repairOrder.loading.repairOrder = false;
                this.repairOrder.visible = false;
                this.$confirm('补单成功，是否要查看补单？', '温馨提示', {
                  type: 'warning'
                }).then(() => {
                  this.searchRepairOrder(res.data.data);
                }).catch(_ => {
                  this.getList();
                })
              } else {
                this.$message({
                  message: res.data.message,
                  type: "error",
                });
              }
            }).catch(res => {
              this.repairOrder.budanBtnDisabled = false;
            });
          }
        });
      }
    },
    /** 放行用户 */
    handlePayClick(row) {
      if (this.$store.getters.loginParam.accountname === 'qapple_vv'
        || this.$store.getters.loginParam.accountname === 'qapple_she'
        || this.$store.getters.loginParam.accountname === 'qa_mason'
        || this.$store.getters.loginParam.accountname === 'qapple_karl'
        || this.$store.getters.loginParam.accountname === 'qa_888'
        || this.$store.getters.loginParam.accountname === 'kendaller'
        || this.$store.getters.loginParam.accountname === 'jason'
        || this.$store.getters.loginParam.accountname === 'yangyang'
        || this.$store.getters.loginParam.accountname === 'admin'
        || this.$store.getters.loginParam.accountname==='abby') {
        this.saveRow = row;
        this.fangxingOrderModal = true;
      } else {
        this.$message({
          type: 'error',
          message: '你无权限操作此功能'
        });
      }
    },
    fangxingOrderSubmit() {
      if (this.btnDisabled) return;
      this.btnDisabled = true;
      passOrder({
        from: this.$store.getters.loginParam.accountname,
        orderid: this.saveRow.orderid
      }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          // 加了定时，防止放行后查询是放行中的状态，延迟一些时间可以查询到最终的状态
          setTimeout(() => {
            this.getList();
            this.saveRow = '';
            this.btnDisabled = false;
            this.fangxingOrderModal = false;
          }, 800);
        } else {
          this.btnDisabled = false;
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      }).catch(_ => {
        this.btnDisabled = false;
        this.saveRow = '';
        this.fangxingOrderModal = false;
      })
    },

    /**
     * 取消订单
     */
    handleCancelClick(row) {
      if (row.order_type === 'ACTIVE_SELL') {
        if (this.$store.getters.loginParam.accountname === 'qapple_vv'
          || this.$store.getters.loginParam.accountname === 'qapple_she'
          || this.$store.getters.loginParam.accountname === 'qa_mason'
          || this.$store.getters.loginParam.accountname === 'qapple_karl'
          || this.$store.getters.loginParam.accountname === 'qa_888'
          || this.$store.getters.loginParam.accountname === 'kendaller'
          || this.$store.getters.loginParam.accountname === 'jason'
          || this.$store.getters.loginParam.accountname === 'yangyang'
          || this.$store.getters.loginParam.accountname === 'admin'
          || this.$store.getters.loginParam.accountname==='abby') {
          this.saveRow = row;
          this.cancelOrderModal = true;
        } else {
          this.$message({
            type: 'error',
            message: '你无权限操作此功能'
          });
        }
      } else {
        this.saveRow = row;
        this.cancelOrderModal = true;
      }
    },
    cancelOrderSubmit() {
      this.btnDisabled = true;
      cancelOrder({
        from: this.$store.getters.loginParam.accountname,
        orderid: this.saveRow.orderid
      }).then(res => {
        this.btnDisabled = false;
        if (res.data.code == 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          this.getList();
          this.cancelOrderModal = false;
          this.saveRow = '';
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      }).catch(_ => {
        this.cancelOrderModal = false;
        this.saveRow = '';
        this.btnDisabled = false;
      })
    },

    /** 接触承兑人冻结 */
    handleFreezonClick(row, scope) {
      const param = {
        orderid: row.orderid
      };
      unfreezeAccepterGAC(param).then(res => {
        if (res.data.code === 200) {
          this.list[scope.$index].order_status = 202;
          this.list[scope.$index].cancelType = 1;
        } else {
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
        }
      });
    },
    checkAcceptorInfor(row) {
      if (!row.to_no) return false;
      if (row.mrCardType === "ALIPAY") {
        this.alipayAccepter = row.to_no;
        this.alipayName = row.mrBankAccName;
        this.alipayAccount = row.mrCardUq;
        this.dialogAlipayVisible = true;
      } else if (row.mrCardType === "BUSINESS_ALIPAY") {
        this.alipayAccepter = row.to_no;
        this.alipayName = row.bankAccName;
        this.alipayAccount = row.mrCardUq;
        this.dialogAlipayVisible = true;
      } else if (row.mrCardType === "WECHAT") {
        this.wechantAccepter = row.to_no;
        this.wechantName = row.mrBankAccName;
        this.wechantAccount = row.mrCardUq;
        this.dialogWechantVisible = true;
      } else if (row.mrCardType === "BANK_CARD") {
        this.bankType = "收款方式";
        this.bankTypeCard = "收款银行卡";
        this.bankAccepter = row.to_no;
        this.bankGetType = "银行转账";
        this.bankGetCard = row.mrCardUq;
        this.bankUserName = row.mrBankAccName;
        this.bankName = row.mrBankName;
        this.bankBranch = row.mrBankSubName;
        this.dialogVisible = true;
      } else if (row.mrCardType === "BUSINESS_ALIPAY_BANK") {
        this.bankType = "收款方式";
        this.bankTypeCard = "收款银行卡";
        this.quikPassAccepter = row.to_no;
        this.quikPassGetType = "支付宝扫码转银行卡";
        this.quikPassGetCard = row.mrCardUq;
        this.quikPassUserName = row.mrBankAccName;
        this.quikPassName = row.mrBankName;
        this.dialogQuikPassVisible = true;
      } else if (row.mrCardType === "WECHAT_BANK") {
        this.bankType = "收款方式";
        this.bankTypeCard = "收款银行卡";
        this.quikPassAccepter = row.to_no;
        this.quikPassGetType = "微信转银行卡";
        this.quikPassGetCard = row.mrCardUq;
        this.quikPassUserName = row.mrBankAccName;
        this.quikPassName = row.mrBankName;
        this.dialogQuikPassVisible = true;
      } else {
        this.bankType = "收款方式";
        this.bankTypeCard = "收款银行卡";
        this.quikPassAccepter = row.to_no;
        this.quikPassGetType = "云闪付";
        this.quikPassGetCard = row.mrCardUq;
        this.quikPassUserName = row.mrBankAccName;
        this.quikPassName = row.mrBankName;
        this.dialogQuikPassVisible = true;
      }
    },
    /**
     * 查看单大图
     */
    openLookBigImgModal(url) {
      this.lookBigImgUrl = url;
      this.lookBigImgModal = true;
    },
    /**
     * 展示上传支付凭证的图片
     */
    showPayImageModal(imgs, remark) {
      this.isShowPayImagesModal = true;
      this.payedImageUrl = imgs;
      this.payedRemark = remark;
    },
    /**获取当前时间 */
    currentFormat(fmt) {
      let date = new Date();
      let month = date.getMonth();
      let day = date.getDate();
      var o = {
        "M+": month + 1, //月份
        "d+": day //日
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    getTimetotal() {
      checkMsgBusiNew({
        msgTime: this.orderLastTime,
        count: -1,
        markHistoryIdList: this.orderHistoryIds,
        toUserType: 1,
        msgType: "NEW_ORDER"
      }).then(res => {
        if (!res || !res.data) {
          return;
        }
        if (res.data.code !== 200) {
          Message({
            message: "网络异常，请联系运维",
            type: "error",
            duration: 5 * 1000
          });
          return;
        }

        if (res.data.code !== 200) {
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
          return;
        }
        if (res.data.data.msgList && res.data.data.msgList.length > 0) {
          this.orderLastTime = res.data.data.lastMsgTime;
          this.orderHistoryIds = [];
          res.data.data.msgList.forEach((v, i) => {
            this.orderHistoryIds.push(v.msgId);
          });
        }
      });
    },
    getList() {
      this.listLoading = true;
      const param = {
        from: this.$store.getters.loginParam.accountname,
        order_no: this.orderid.replace(/\s+/g, ""),
        sub_no: this.memberAccount.replace(/\s+/g, ""),
        eosno: this.accountname.replace(/\s+/g, ""),
        accepter: this.acceptorname.replace(/\s+/g, ""),
        start_time_min: this.pickerdate,
        start_time_max: this.pickerdate1,
        finish_time_min: this.finishPickerdate,
        finish_time_max: this.finishPickerdate1,
        quan_min: String(this.minAmount),
        quan_max: String(this.maxAmount),
        type: this.odertype,
        order_status: this.orderstate,
        payment_channel: this.payChannel,
        manual_bill: this.manual_bill,
        start_page: this.listQuery.page,
        page_num: this.listQuery.limit,
        manual_bill: this.orderStatusModel, //订单类型 正常单-异常单
        source_item: this.sourceItem //支付来源
      };
      orderManageList(param)
        .then(response => {
          if (response.data.code === 200) {
            this.list = response.data.data.orders_list;
            this.total = response.data.data.total_record_num;
            setTimeout(() => {
              this.listLoading = false;
            }, 100);
          } else {
            this.listLoading = false;
            Message({
              message: response.data.message,
              type: "error",
              duration: 5 * 1000
            });
          }
        })
        .catch(e => { });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    /**
     * 查询
     */
    searchClick() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**
     * 重置
     */
    resetClick() {
      this.paySource = "";
      this.finishPickerdate = "";
      this.finishPickerdate1 = "";
      this.acceptorname = "";
      this.accountname = "";
      this.pickerdate1 = "";
      this.pickerdate = "";
      this.orderstate = "";
      this.minAmount = "";
      this.maxAmount = "";
      this.payChannel = "";
      this.odertype = "";
      this.orderid = "";
      this.memberAccount = "";
      this.sourceItem = "";
    },
    /**
     * 重新分配订单输入账号弹出框，下一步点击
     */
    handleRestartSureClick(formName) {
      const reg = /^[1-5a-z][a-z1-5]{5,12}$/;
      if (
        reg.test(this.ruleForm.accountName) &&
        this.ruleForm.accountName !== ""
      ) {
        // console.log(this.saveRow, '++++')
        this.resartdialogVisible = false;
        this.orderdialogVisible = true;
        this.username = this.saveRow.publish;
        this.accepterusernmae = this.ruleForm.accountName;
        this.ruleForm.accountName = "";
        this.accepterId = this.saveRow.orderid;
      } else {
        new Error("请输入6~12位帐号");
      }
    },
    /**
     * 重新分配订单取消
     */
    resartdialogClick(formName) {
      this.resartdialogVisible = false;
      this.ruleForm.accountName = "";
    },
    /**
     * 重新分配订单下一步
     */
    handleOrderSureClick() {
      startAcceptor({
        orderid: this.accepterId,
        accountname: this.accepterusernmae
      }).then(res => {
        if (res.data.code === 200) {
          this.orderdialogVisible = false;
          this.list[this.savescope.$index].consumer = res.data.data;
          Message({
            message: "重新分配订单成功",
            type: "success",
            duration: 3 * 1000
          });
        } else {
          this.listLoading = false;
          Message({
            message: res.data.message,
            type: "error",
            duration: 5 * 1000
          });
        }
      });
    },
    /**
     * 解决小数乘法精度丢失的问题
     */
    accMul(arg1, arg2) {
      if (!arg1 || !arg2) return "";
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try { m += s1.split(".")[1].length } catch (e) { }
      try { m += s2.split(".")[1].length } catch (e) { }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    /**
       * 补单时候显示异常单列表
       */
    inputForAbnormalBill() {
      this.repairOrder.formData.abnormalBillNo = '';
      this.getAbnormalBillOfWeek();
    },
    getAbnormalBillOfWeek(accepterName, receivingName, amountRmb) {
      this.exceptionOrderOfWeekList = [];
      getAbnormalBillOfWeek({
        accepterName: this.repairOrder.formData.accepter,
        receivingName: this.repairOrder.formData.payCardUq || "",
        amountRmb: this.accMul(this.repairOrder.formData.amount, 10000).toString()
      }).then(res => {
        if (res.data.code == 200) {
          this.exceptionOrderOfWeekList = res.data.data;
        }
      })
    },
    renderExceptionParams() {
      let params = sessionStorage.getItem("exceptionOrderParams");
      if (params) {
        params = JSON.parse(params);
        this.acceptorname = params.acceptorname;
        this.pickerdate = params.startdate;
        this.pickerdate1 = params.enddate;
        this.minAmount = params.minamount;
        this.maxAmount = params.maxamount;
      }
    },
    toExceptionOrder() {
      this.$router.push({
        path: "/service/abnormal-manage",
      })
      let params = {
        acceptorname: this.acceptorname,
        startdate: this.pickerdate,
        enddate: this.pickerdate1,
        minamount: this.minAmount,
        maxamount: this.maxAmount,
      };
      sessionStorage.setItem("exceptionOrderParams", JSON.stringify(params))
    },
    selectrepairReason(val) {
      if (!this.repairOrder.formData.repairReason) {
        this.repairOrder.formData.repairReason = val;
      }
    },
  }
};
</script>

<style lang="scss">
.viewer-title {
  color: #ffffff;
  font-size: 16px;
  opacity: 1;
  font-weight: 600;
  background: #606266;
  padding: 6px 10px;
}
</style>

<style  lang="scss" scoped>
.form-repair-order {
  .el-input,
  .el-select {
    width: 80%;
    .el-input {
      width: 100%;
    }
  }
}
.small-img {
  width: 35px;
  height: 35px;
  &:hover {
    cursor: pointer;
  }
}
.viewer-title {
  font-size: 14px;
  color: #ffffff;
  margin-left: 0px;
  font-weight: 500;
}
.el-input {
  width: auto;
}
.contaner-box {
  margin: 30px 30px 0 30px;
  overflow: hidden;
}
.box-spacing {
  display: block;
  margin-left: 20px;
  float: left;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}
.search_box {
  padding: 20px 30px;
  font-size: 14px;
}
.search_box .search_list {
  margin-top: 10px;
}
</style>