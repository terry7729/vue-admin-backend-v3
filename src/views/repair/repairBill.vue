<template>
  <div>
    <!-- 工单状态 -->
    <div class="container_box">
      <span style="width:90px;display:inline-block;text-align:right;">工单：</span>
      <span class="tags" :class="{selected:listQuery.billStatus == 'all'}" @click="changeLabelStatus('billStatus','all')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.billStatus == '0'}" @click="changeLabelStatus('billStatus','0')">
        <el-badge :hidden="getAllRepairBillNum==0" :value="getAllRepairBillNum" class="tags_badge">
          <span>&nbsp;未受理工单&nbsp;</span>
        </el-badge>
      </span>
      <span class="tags" :class="{selected:listQuery.billStatus == '10'}" @click="changeLabelStatus('billStatus','10');updateMyNotReadAcceptBill();">
        <el-badge :hidden="getMyDealBillNum==0" :value="getMyDealBillNum" class="tags_badge">
          <span>&nbsp;我受理的工单&nbsp;</span>
        </el-badge>
      </span>
      <span class="tags" :class="{selected:listQuery.billStatus == '1'}" @click="changeLabelStatus('billStatus','1')">
        <span>&nbsp;受理中的工单&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.billStatus == '2'}" @click="changeLabelStatus('billStatus','2')">
        <span>&nbsp;已完结的工单&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.billStatus == '11'}" @click="changeLabelStatus('billStatus','11')">
        <span>&nbsp;我创建的工单&nbsp;</span>
      </span>
    </div>
    <!-- 角色 -->
    <div class="container_box">
      <span style="width:90px;display:inline-block;text-align:right;">角色：</span>
      <span class="tags" :class="{selected:listQuery.userRole == 'all'}" @click="changeLabelStatus('userRole','all')">
        <span>&nbsp;全部&nbsp;</span>
      </span>
      <span class="tags" :class="{selected:listQuery.userRole == 'BUSINESS'}" @click="changeLabelStatus('userRole','BUSINESS')">
        <el-badge :hidden="getBusinessBillNum==0" :value="getBusinessBillNum" class="tags_badge">
          <span>&nbsp;商家&nbsp;</span>
        </el-badge>
      </span>
      <span class="tags" :class="{selected:listQuery.userRole == 'ACCEPTER'}" @click="changeLabelStatus('userRole','ACCEPTER')">
        <el-badge :hidden="getAccepterBillNum==0" :value="getAccepterBillNum" class="tags_badge">
          <span>&nbsp;承兑人&nbsp;</span>
        </el-badge>
      </span>
    </div>
    <!-- 工单类型和其他查询条件 -->
    <div class="container_box">
      <span style="width:90px;display:inline-block;text-align:right;">类型：</span>
      <span>
        <el-select placeholder="请选择类型" v-model="listQuery.billType" clearable @change="queryDataWithLabel()">
          <el-option value label="全部"></el-option>
          <el-option-group v-for="group in getBillTypeGroupList" :key="group.value" :label="group.label">
            <el-option v-for="item in group.list" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-option-group>
        </el-select>
      </span>
      <!-- 后面的版本上 -->
      <!-- <span>
        <el-button type="text" @click="settingRepairType=true;">设置类型</el-button>
      </span>-->
      <!-- 收起和展开 -->
      <span style="float:right;">
        <i class="el-icon-arrow-up" style="font-size:18px;font-weight:bold;color:#666;cursor:pointer;" v-if="searchMoreOpen" @click="changeSearchMore()"></i>
        <i class="el-icon-arrow-down" style="font-size:18px;font-weight:bold;color:#666;cursor:pointer;" v-if="!searchMoreOpen" @click="changeSearchMore()"></i>
      </span>
    </div>

    <div v-if="searchMoreOpen">
      <div class="container_box" style="margin-top:10px;">
        <span style="width:90px;display:inline-block;text-align:right;">会员账号：</span>
        <span style="margin-right:10px;">
          <el-input v-model="listQuery.subName" placeholder="请输入会员账号" clearable></el-input>
        </span>
        <span style="margin-right:10px;">
          工单受理人：
          <span>
            <el-input v-model="listQuery.receiverNickename" placeholder="请输入工单受理人" clearable></el-input>
          </span>
        </span>
        <span style="margin-right:10px;">
          工单发起人：
          <span>
            <el-input style="width:250px;" v-model="listQuery.creatorNickename" placeholder="请输入工单发起人" clearable>
              <el-select style="width:90px;" v-model="listQuery.creatorRole" slot="prepend" placeholder="请选择">
                <el-option label="全部" value></el-option>
                <el-option label="商家" value="0"></el-option>
                <el-option label="承兑" value="2"></el-option>
                <el-option label="管理员" value="1"></el-option>
              </el-select>
            </el-input>
          </span>
        </span>
        <span style="margin-right:10px;">
          订单号：
          <span>
            <el-input v-model="listQuery.tradeId" placeholder="请输入订单号" clearable></el-input>
          </span>
        </span>
      </div>
      <div class="container_box" style="margin-top:10px;">
        <span style="width:90px;display:inline-block;text-align:right;">工单号：</span>
        <span style="margin-right:10px;">
          <el-input v-model="listQuery.repairBillNo" placeholder="请输入工单号" clearable></el-input>
        </span>
        <!-- <span style="margin-right:10px;">
          收款账号：<span>
            <el-input v-model="listQuery.tradeId" placeholder="请输入收款账号" clearable></el-input>
          </span>
        </span>-->
        <span style="margin-right:10px;">
          角色账号：
          <span>
            <el-input v-model="listQuery.userName" placeholder="请输入角色账号" clearable></el-input>
          </span>
        </span>
      </div>
      <div class="container_box" style="margin-top:10px;">
        <span style="margin-right:10px;">
          <span style="width:90px;display:inline-block;text-align:right;margin-right:5px;">创建时间：</span>
          <span>
            <el-date-picker v-model="listQuery.createTimeBegin" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="年-月-日 时:分:秒"></el-date-picker>到
            <el-date-picker v-model="listQuery.createTimeEnd" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="年-月-日 时:分:秒"></el-date-picker>
          </span>
        </span>
        <span style="margin-right:10px;">
          更新时间：
          <span>
            <el-date-picker v-model="listQuery.updateTimeBegin" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="年-月-日 时:分:秒"></el-date-picker>到
            <el-date-picker v-model="listQuery.updateTimeEnd" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="年-月-日 时:分:秒"></el-date-picker>
          </span>
        </span>
        <span>
          <el-button type="primary" @click="queryData()">查询</el-button>
          <el-button type="default" @click="resetData()">重置</el-button>
        </span>
      </div>
    </div>
    <div class="container_box" style="margin-top:10px;">
      <el-button type="primary" @click="showAddRepairBillModal()">新增工单</el-button>
      <span style="float:right;" v-if="!searchMoreOpen">
        <el-button type="primary" @click="queryData()">查询</el-button>
        <el-button type="default" @click="resetData()">重置</el-button>
      </span>
    </div>

    <!-- 表格数据 -->
    <div class="tab-container">
      <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row @sort-change="onSortChange">
        <el-table-column align="center" label="工单号">
          <template slot-scope="scope">
            <span>{{scope.row.repairBillNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.billStatusDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="工单受理人">
          <template slot-scope="scope">
            <span v-if="scope.row.receiverAccountName">{{scope.row.receiverAccountName}}</span>
            <span v-else>未分配</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="工单类型">
          <template slot-scope="scope">
            <span>{{scope.row.billTypeDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="工单发起人">
          <template slot-scope="scope">
            <span>{{scope.row.creatorDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色">
          <template slot-scope="scope">
            <span>{{scope.row.userRoleDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色账号">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员账号">
          <template slot-scope="scope">
            <span>{{scope.row.subName || "-"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额">
          <template slot-scope="scope">
            <span v-if="scope.row.amountRmb">{{Number(scope.row.amountRmb/10000).toFixed(2)}}元</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <span>{{scope.row.tradeId || "-"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" sortable="custom" prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" sortable="custom" prop="updateTime">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.billStatusDesc == '已完结'">
              <el-button type="text" @click="showCkRepairBillModal(scope.row)">查看</el-button>
              <el-button type="text" @click="showCqRepairBillModal(scope.row)">重启</el-button>
            </span>
            <span v-else>
              <el-button v-if="scope.row.receiverAccountName" type="text" @click="showZjRepairBillModal(scope.row)">转交</el-button>
              <el-button v-else type="text" @click="showFpRepairBillModal(scope.row)">分配</el-button>
              <el-button type="text" v-if="!scope.row.receiverAccountName || loginParam.accountname==scope.row.receiverAccountName" @click="addUserToRepairGroup(scope.row)">跟进</el-button>
              <el-button type="text" @click="showEditRepairBillModal(scope.row)">修改</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>

    <!-- 新建和编辑工单 -->
    <el-dialog :title="editRepairBillTitle" :visible.sync="editRepairBillModal" width="900px" class="order_modal" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="container_body">
        <!-- 用户角色 -->
        <div class="order_list">
          <div class="list_title">用户角色：</div>
          <div class="list_content">
            <el-select v-model="editRepairBillObj.userRole" :disabled="editRepairBillType=='edit'" placeholder="请选择用户角色" @change="validateRepairBill('userRole');getUserListOfRole();">
              <el-option value="BUSINESS" label="商家"></el-option>
              <el-option value="ACCEPTER" label="承兑人"></el-option>
            </el-select>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.userRole">请选择用户角色</div>
          </div>
        </div>
        <!-- 用户名称 -->
        <div class="order_list">
          <div class="list_title">用户名称：</div>
          <div class="list_content">
            <el-select v-model="editRepairBillObj.userName" filterable :disabled="!editRepairBillObj.userRole||editRepairBillType=='edit'" :placeholder="editRepairBillObj.userRole ? '请选择用户名称' : '请先选择用户角色'" @change="validateRepairBill('userName');">
              <el-option :value="item.userName" :label="item.userName" :key="item.userName" v-for="item in roleUserList">
                {{item.userName}}
                <!-- 只有角色是承兑人的时候才会取online -->
                <span v-if="editRepairBillObj.userRole=='ACCEPTER'">
                  <span v-if="item.online===0">-离线</span><span v-if="item.online===1">-在线</span>
                </span>
              </el-option>
            </el-select>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.userName">请选择用户名称</div>
          </div>
        </div>
        <!-- 工单类型 -->
        <div class="order_list" style="padding-top:0px">
          <div class="list_title">工单类型：</div>
          <div class="list_content">
            <el-select v-model="editRepairBillObj.billType" :placeholder="editRepairBillObj.userRole ? '请选择工单类型' : '请先选择用户角色'" :disabled="!editRepairBillObj.userRole" @change="validateRepairBill('billType');changeBillType();">
              <el-option v-for="item in getBillTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.billType">请选择工单类型</div>
          </div>
        </div>
        <!-- 工单受理人 -->
        <div class="order_list">
          <div class="list_title">工单受理人：</div>
          <div class="list_content">
            <el-select v-model="editRepairBillObj.receiverAccount" filterable placeholder="请选择工单受理人" @change="setReceiverAccount();validateRepairBill('receiverAccount');">
              <el-option :value="item.eosno" :label="item.eosno" :key="item.eosno" v-for="item in receiverList"></el-option>
            </el-select>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.receiverAccount">请选择工单受理人</div>
          </div>
        </div>
        <!-- 工单内容 -->
        <div class="order_list">
          <div class="list_title">工单内容：</div>
          <div class="list_content">
            <el-input type="textarea" v-model="editRepairBillObj.content" :rows="3" placeholder="请输入工单内容，截图可直接粘贴上传" @blur="validateRepairBill('content')" maxlength="100"></el-input>
            <div style="color:#b0b3b9;font-size:13px;padding-top:3px;">可在输入框内复制粘贴截图上传，单次最多可上传三张截图</div>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.content">工单内容不可为空</div>
          </div>
        </div>
        <!-- 上传图片 -->
        <div class="order_list">
          <div class="list_title">上传图片：</div>
          <div class="list_content">
            <div class="upload_container">
              <span v-if="editRepairBillObj.relativeImgUrlList">
                <span v-for="(item,index) in editRepairBillObj.relativeImgUrlList" :key="item.imageShortUrl" class="upload_image_list">
                  <img :src="item.imageData" @click="openLookBigImgModal(item.imageData)" />
                  <i class="el-icon-circle-close upload_image_remove" @click="removeImage(index)"></i>
                </span>
              </span>
              <el-upload action class="avatar-uploader" ref="uploadImg" :on-change="onUploadChange" :show-file-list="false" :auto-upload="false">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div class="desc_text">
                  <div>请上传您的图片</div>
                  <div>(*.jpg/*.png/*.jpeg)</div>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <!-- 会员账号 -->
        <div class="order_list">
          <div class="list_title">会员账号：</div>
          <div class="list_content">
            <el-input v-model="editRepairBillObj.subName" @blur="validateRepairBill('subName')" minlength="2" maxlength="60" placeholder="请输入会员账号"></el-input>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.subName">请输入正确的会员名</div>
          </div>
        </div>
        <!-- 充值金额 -->
        <div class="order_list">
          <div class="list_title">充值金额：</div>
          <div class="list_content">
            <span style="position:relative;">
              <el-input v-model="editRepairBillObj.amountRmb" @blur="validateRepairBill('amountRmb')" maxlength="10" placeholder="请输入充值金额"></el-input>
              <span style="position:absolute;color:#888;top:0;right:5px;">元</span>
            </span>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.amountRmb">请输入正确的金额</div>
          </div>
        </div>
        <!-- 订单号 -->
        <div class="order_list">
          <div class="list_title">订单号：</div>
          <div class="list_content">
            <el-input v-model="editRepairBillObj.tradeId" @blur="validateRepairBill('tradeId');" maxlength="19" placeholder="请输入支付订单号"></el-input>
            <!-- 错误提示 -->
            <div class="text_error" v-if="validateRepairBillObj.tradeId">请输入正确的支付订单号</div>
          </div>
        </div>
      </div>

      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="editRepairBillModal=false;">取消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="editRepairBillSure()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 工单详情弹出框 -->
    <el-dialog :title="currentRepairBillObj.title" :visible.sync="repairBillDetailModal" width="1080px">
      <div>
        <repairBillDetail v-if="repairBillDetailModal" :detailObj="currentRepairBillObj" @closeDetailRepairBill="closeDetailRepairBill" @refreshData="refreshData"></repairBillDetail>
      </div>
    </el-dialog>
    <!-- 完结工单 -->
    <el-dialog :title="currentRepairBillObj.title" :visible.sync="finishBillModal" width="740px">
      <div>
        <el-input v-model="handleRemark" type="textarea" :rows="6" maxlength="100" placeholder="请输入处理结果" @input="handleRemarkError='';"></el-input>
        <div style="color:#b0b3b9;font-size:13px;padding-top:3px;">可在输入框内复制粘贴截图上传，单次最多可上传三张截图</div>
        <div v-if="handleRemarkError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{handleRemarkError}}</div>
        <div class="list_content" style="padding-top:10px;">
          <div class="upload_container">
            <span v-if="editRepairBillObj.relativeImgUrlList">
              <span v-for="(item,index) in editRepairBillObj.relativeImgUrlList" :key="item.imageShortUrl" class="upload_image_list">
                <img :src="item.imageData" @click="openLookBigImgModal(item.imageData)" />
                <i class="el-icon-circle-close upload_image_remove" @click="removeImage(index)"></i>
              </span>
            </span>
            <el-upload action class="avatar-uploader" ref="uploadImg" :on-change="onUploadChange" :show-file-list="false" :auto-upload="false">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div class="desc_text">
                <div>请上传您的图片</div>
                <div>(*.jpg/*.png/*.jpeg)</div>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="finishBillModal=false;handleRemarkError='';handleRemark='';">取 消</el-button>
        <el-button class="btn_submit" type="primary" @click="finishBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重启工单 -->
    <el-dialog :title="currentRepairBillObj.title" :visible.sync="rebootBillModal" width="500px">
      <div>
        <el-input v-model="rebootReason" type="textarea" :rows="6" maxlength="100" placeholder="请输入重启工单理由" @input="rebootReasonError='';"></el-input>
        <div v-if="rebootReasonError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{rebootReasonError}}</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="rebootBillModal=false;rebootReasonError='';rebootReason='';">取 消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="rebootBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配，转交工单 -->
    <el-dialog :title="currentRepairBillObj.title" :visible.sync="receiverModal" width="500px">
      <div>
        <el-select v-model="receiver" filterable placeholder="请选择工单受理人" @change="receiverError='';" style="width:100%;">
          <el-option :value="item.eosno" :label="item.eosno" :key="item.eosno" v-for="item in receiverList">
            {{item.eosno}}（{{item.name}}）
          </el-option>
        </el-select>
        <div v-if="receiverError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{receiverError}}</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="receiverModal=false;receiverError='';">取 消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="receiverBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置商家和承兑人的工单类型 -->
    <el-dialog title="设置工单类型" :visible.sync="settingRepairType" width="600px">
      <div>
        <div>
          <el-radio-group>
            <el-radio value="0" label="商家"></el-radio>
            <el-radio value="0" label="承兑人"></el-radio>
          </el-radio-group>
        </div>
        <div style="padding:10px 0px;">
          <el-input placeholder="请输入类型" style="width:360px;"></el-input>
          <span style="display:inline-block;">
            <el-button type="danger" size="mini">删除</el-button>
          </span>
        </div>
        <div style="padding:10px 0px;">
          <el-input placeholder="请输入类型" style="width:360px;"></el-input>
          <span style="display:inline-block;">
            <el-button type="danger" size="mini">删除</el-button>
          </span>
        </div>
        <div>
          <el-button type="primary" size="mini">添加</el-button>
        </div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="settingRepairType=false;">取 消</el-button>
        <el-button class="btn_submit" type="primary" @click="settingRepairType=false;">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="1080px">
      <div style="text-align:center;">
        <img :src="lookBigImgUrl" style="max-width:100%;" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  qryRepairBillList,
  addRepairBillType,
  qryRepairBillDetail,
  updateIMInfo,
  deleteRepairBillType,
  getRepairBillType,
  updateRepairBill,
  getPreRepairBillNo,
  addNewRepairBill,
  finishBill,
  rebootBill,
  handOverOrDistributeReceiver,
  updateMyNotReadAcceptBill,
  qryManagerForSelect,
  getAccepterList,
  addImgFile,
  qryNotDistBillForMerchant,
  qryMyNotReadAcceptBill,
  getBackendUserList,
  getMerchantList
} from "@/api/repairBill.js";
import { mapGetters, mapActions } from "vuex";
import repairBillDetail from "@/views/repair/repairBillDetail.vue";
import { addUserToSessionList } from "@/api/immsg.js";
export default {
  name: "tab",
  components: { repairBillDetail },
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
      //  工单类型字典
      billTypeList: [
        {
          label: "商家",
          value: "BUSINESS",
          list: [

            {
              value: 0,
              label: "会员已转账，但承兑人没放行"
            },
            {
              value: 1,
              label: "会员没下单，直接转账"
            },
            {
              value: 3,
              label: "会员转账金额与订单不符"
            },
            {
              value: 5,
              label: "代会员出款"
            },
            {
              value: 6,
              label: "承兑人收款卡超出限额"
            },
            {
              value: 7,
              label: "延时赔偿"
            },
            {
              value: 2,
              label: "其它类型"
            }
          ]
        },
        {
          label: "承兑人",
          value: "ACCEPTER",
          list: [
            {
              value: 8,
              label: "上线"
            },
            {
              value: 9,
              label: "下线"
            },
            {
              value: 4,
              label: "无缘无故收到打款"
            },
            {
              value: 10,
              label: "收款账户与订单账户不符"
            },
            {
              value: 11,
              label: "收款金额与订单金额不符"
            },
            {
              value: 12,
              label: "已付款解冻&超时解冻"
            },
            {
              value: 13,
              label: "其它类型"
            }
          ]
        }
      ],
      // 新建订单弹出框
      addRepairBillModal: false,

      // 表格数据
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,

      btnLoading: false,

      searchMoreOpen: true, // 查询条件折叠和展开，默认展开

      // 查询条件
      listQuery: {
        billStatus: "all", // 工单状态
        userRole: "all", // 用户角色
        creatorRole: "",
        billType: "", // 工单类型
        userName: "", // 用户名称
        subName: "", //会员账号
        receiverNickename: "", // 工单受理人
        creatorNickename: "", // 工单发起人
        tradeId: "", // 订单号
        repairBillNo: "", //工单号
        createTimeBegin: date1, // 创建开始时间
        createTimeEnd: date2, // 创建结束时间
        updateTimeBegin: "", // 更新开始时间
        updateTimeEnd: "", // 更新结束时间
        orderField: "", //排序字段，createTime，updateTime
        orderStatus: "", //排序，asc，desc
        page: 1,
        limit: 10
      },

      // 新建订单弹出框
      editRepairBillModal: false,
      editRepairBillType: "add",
      editRepairBillTitle: "新增工单",
      // 新增和修改工单的数据对象
      editRepairBillObj: {
        id: "",
        preOrderId: "", // 预下单号
        billType: "", // 工单类型
        receiverAccount: "", // 工单受理人账号
        receiverNickname: "", // 工单受理人昵称
        content: "", // 工单内容
        relativeImgUrlList: [], // 相对图片地址列表
        userRole: "", // 用户角色
        userName: "", // 用户名称 ,
        tradeId: "", // 订单号，手工录入
        subName: "", //  会员账号
        amountRmb: "" // 充值金额
      },
      // 验证新增工单
      validateRepairBillObj: {
        billType: "", // 工单类型
        receiverAccount: "", // 工单受理人账号
        content: "", // 工单内容
        userRole: "", // 用户角色
        userName: "", // 用户名称 ,
        tradeId: "", // 订单号，手工录入
        subName: "", //  会员账号
        amountRmb: "" // 充值金额
      },

      // 工单受理人数据列表
      receiverList: [],
      //工单分类到底是分配还是转交
      assignType: "",

      // 当前登录的人的账号
      currentAccount: "",

      // 根据角色查询的用户列表
      roleUserList: [],

      // 跟进、查看工单详情
      repairBillDetailModal: false,

      // 操作的当前行的工单的数据对象，用来改变弹框的title和操作的id
      currentRepairBillObj: {
        id: "",
        title: ""
      },

      // 分配，转交工单
      receiverModal: false,
      receiverError: "",
      receiver: "",

      // 重启工单
      rebootBillModal: false,
      rebootReason: "",
      rebootReasonError: "",

      // 完结工单
      finishBillModal: false,
      handleRemark: "", // 工单处理结果
      handleRemarkError: "", // 错误提示

      settingRepairType: false, // 设置工单类型

      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: ""
    };
  },
  filters: {},
  computed: {
    ...mapGetters([
      "accepterBillNum",
      "businessBillNum",
      "myDealBillNum",
      "loginParam"
    ]),
    getBillTypeList() {
      const userRole = this.editRepairBillObj.userRole;
      // debugger
      for (let group of this.billTypeList) {
        if (userRole === group.value) {
          return group.list || [];
        }
      }
      return [];
    },
    getBillTypeGroupList() {
      const userRole = this.listQuery.userRole;
      // userRole = this.editRepairBillObj.userRole;
      // debugger
      return this.billTypeList.filter(group => {
        if (userRole !== "all") {
          if (userRole === group.value) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
    },
    // 获得承兑人未受理工单数量
    getAccepterBillNum() {
      if (this.accepterBillNum > 99) {
        return "99+";
      } else {
        return this.accepterBillNum;
      }
    },
    // 获得商家未受理工单数量
    getBusinessBillNum() {
      if (this.businessBillNum > 99) {
        return "99+";
      } else {
        return this.businessBillNum;
      }
    },
    // 获得总的未受理工单数量
    getAllRepairBillNum() {
      if (this.businessBillNum + this.accepterBillNum > 99) {
        return "99+";
      } else {
        return this.businessBillNum + this.accepterBillNum;
      }
    },
    // 获得我受理的工单数量
    getMyDealBillNum() {
      if (this.myDealBillNum > 99) {
        return "99+";
      } else {
        return this.myDealBillNum;
      }
    }
  },
  created() {
    // 查询列表
    this.queryData();
    // 获得工单受理人列表
    this.getReceiverList();
    // 根据角色获得用户列表，不选择角色默认获得所有用户列表
    this.qryUserForSelect();
  },
  mounted() {
    // 只要是在付款转账弹框下才会起作用粘贴截图
    document.addEventListener('paste', event => {
      if (this.editRepairBillModal) {
        this.contentPasteImage(event);
      }
    })
  },
  methods: {
    ...mapActions([
      "setAccepterBillNum",
      "setBusinessBillNum",
      "setMyDealBillNum",
      "changeImmsgBoxShow"
    ]),
    /**
     * 每次点发送，都会记录该工单的聊天的人
     */
    addUserToRepairGroup(row) {
      // 如果没有分配过工单受理人，就会自动给一个工单受理人
      let assignType = "ALLOCATION";
      if (row.receiverAccountName) {
        assignType = "DELIVER";
      }
      // 获得当前用户的账号
      let obj = this.receiverList.find(item => {
        return item.eosno === this.loginParam.accountname;
      });
      handOverOrDistributeReceiver({
        id: row.id,
        receiver: obj.eosno,
        receiverNickName: obj.name,
        assignType: assignType
      }).then(res => {
        if (res.data.code === 200) {
          // 刷新当前页面数据
          this.refreshData();
          // 分配过工单受理人，就会直接聊天
          let userList = [];
          userList.push(this.loginParam.accountname);
          if (row.accepterName) {
            userList.push(row.accepterName);
          }
          if (row.merchantName) {
            userList.push(row.merchantName);
          }
          addUserToSessionList({
            id: row.id,
            sessionUserList: userList.join(",")
          }).then(res => {
            // 判断是从会话中点击打开的，需要重新查询聊天列表
            // 点击会话的当前工单的id
            sessionStorage.setItem("immsgCurrentBillId", row.id);
            // 显示聊天窗口
            this.changeImmsgBoxShow(true);
          });
        }
      });
    },
    /**
     * 查询条件
     */
    /**
     * 点击标签查询
     */
    queryDataWithLabel() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**
     * 点击查询
     */
    queryData() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**
     * 刷新当前页面的数据（不会重置分页和查询条件）
     */
    refreshData() {
      this.getList();
    },
    /**
     * 重置查询条件
     */
    resetData() {
      this.listQuery.creatorRole = ''
      this.listQuery.billStatus = "all"; // 工单状态
      this.listQuery.userRole = "all"; // 用户角色
      this.listQuery.billType = ""; // 工单类型
      this.listQuery.userName = ""; // 用户名称
      this.listQuery.receiverNickename = ""; // 工单受理人
      this.listQuery.creatorNickename = ""; // 工单发起人
      this.listQuery.tradeId = ""; // 订单号
      this.listQuery.subName = ""; //会员账号
      this.listQuery.repairBillNo = ""; //工单号
      this.listQuery.createTimeBegin = ""; // 创建开始时间
      this.listQuery.createTimeEnd = ""; // 创建结束时间
      this.listQuery.updateTimeBegin = ""; // 更新开始时间
      this.listQuery.updateTimeEnd = ""; // 更新结束时间
      this.listQuery.orderField = ""; //排序字段，createTime，updateTime
      this.listQuery.orderStatus = ""; //排序，asc，desc
      this.listQuery.page = 1;
      // 重置完查询
      this.queryData();
    },
    /**
     * 收起和展开查询条件
     */
    changeSearchMore() {
      this.searchMoreOpen = !this.searchMoreOpen;
    },
    /**
     * 点击按钮查询的
     */
    getList() {
      const params = {
        creatorRole: this.listQuery.creatorRole,
        billStatus: this.listQuery.billStatus == "all" ? "" : this.listQuery.billStatus, // 工单状态
        userRole: this.listQuery.userRole == "all" ? "" : this.listQuery.userRole, // 用户角色
        billType: this.listQuery.billType, // 工单类型
        userName: this.listQuery.userName, // 用户名称
        subName: this.listQuery.subName.replace(/\s+/g, ""), //会员账号
        receiverNickename: this.listQuery.receiverNickename.replace(/\s+/g, ""), // 工单受理人
        creatorNickename: this.listQuery.creatorNickename.replace(/\s+/g, ""), // 工单发起人
        tradeId: this.listQuery.tradeId.replace(/\s+/g, ""), // 订单号
        repairBillNo: this.listQuery.repairBillNo.replace(/\s+/g, ""), //工单号
        createTimeBegin: this.listQuery.createTimeBegin, // 创建开始时间
        createTimeEnd: this.listQuery.createTimeEnd, // 创建结束时间
        updateTimeBegin: this.listQuery.updateTimeBegin, // 更新开始时间
        updateTimeEnd: this.listQuery.updateTimeEnd, // 更新结束时间
        orderField: this.listQuery.orderField,
        orderStatus: this.listQuery.orderStatus,
        currentPage: this.listQuery.page,
        pageSize: this.listQuery.limit
      };
      this.listLoading = true;
      qryRepairBillList(params).then(res => {
        setTimeout(() => {
          this.listLoading = false;
        }, 200);
        if (res.data.code === 200) {
          this.list = res.data.data;
          this.total = res.data.page.totalCount;
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      }).catch(() => {
        this.listLoading = false;
      });
    },
    /**
     * 改变工单状态
     */
    changeLabelStatus(label, status) {
      if (this.listQuery[label] !== status) {
        this.listQuery.billType = "";
      }
      this.listQuery[label] = status;
      this.listQuery.page = 1;
      this.queryDataWithLabel();
    },
    /**
     * 更改我受理的未读工单数量
     */
    updateMyNotReadAcceptBill() {
      updateMyNotReadAcceptBill({}).then(res => {
        this.setMyDealBillNum(0);
      });
    },
    /**
     * 设置选择的工单受理人名称
     */
    setReceiverAccount() {
      for (let obj of this.receiverList) {
        if (obj.accountName == this.editRepairBillObj.receiverAccount) {
          this.editRepairBillObj.receiverNickname = obj.nickName;
        }
      }
    },

    /**
     * 新增工单
     */
    /**
     * 新增和编辑工单
     */
    editRepairBillSure() {
      // 验证
      let validateFlag = true;
      for (const obj in this.validateRepairBillObj) {
        // 如果循环时候只要有一项返回验证false，就会标记验证失败
        if (!this.validateRepairBill(obj)) {
          validateFlag = false;
        }
      }
      // 验证通过
      if (validateFlag) {
        // 获得图片地址
        let imageShortUrlList = [];
        if (
          this.editRepairBillObj.relativeImgUrlList &&
          this.editRepairBillObj.relativeImgUrlList.length > 0
        ) {
          this.editRepairBillObj.relativeImgUrlList.forEach((v, i) => {
            imageShortUrlList.push(v.imageShortUrl);
          });
          this.editRepairBillObj.relativeImgUrlList = imageShortUrlList;
        }
        if (this.btnLoading) return;
        this.btnLoading = true;
        // 增加工单
        if (this.editRepairBillType == "add") {
          addNewRepairBill(this.editRepairBillObj).then(res => {
            this.btnLoading = false;
            if (res.data.code === 200) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              // 关闭弹框，重新加载数据
              this.editRepairBillModal = false;
              this.resetRepairBill();
              this.queryData();
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        }
        // 修改工单
        if (this.editRepairBillType == "edit") {
          let params = {
            id: this.editRepairBillObj.id,
            billType: this.editRepairBillObj.billType,
            receiver: this.editRepairBillObj.receiverAccount,
            content: this.editRepairBillObj.content,
            relativeImgUrlList: imageShortUrlList,
            tradeId: this.editRepairBillObj.tradeId,
            subName: this.editRepairBillObj.subName,
            amountRmb: this.editRepairBillObj.amountRmb
          };
          updateIMInfo(params).then(res => {
            this.btnLoading = false;
            if (res.data.code === 200) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              // 关闭弹框，重新加载数据
              this.editRepairBillModal = false;
              this.resetRepairBill();
              this.queryData();
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        }
      }
    },
    /**
     * 获得预先工单号
     */
    getPreRepairBillNo() {
      getPreRepairBillNo().then(res => {
        if (res.data.code === 200) {
          this.editRepairBillObj.preOrderId = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    /**
     * 验证工单
     */
    validateRepairBill(obj) {
      // 验证规则
      let reg = "";
      // 验证的结果
      let flag = false;

      // 要验证的值
      let value = this.editRepairBillObj[obj];
      // 验证会员账户
      if (obj == "subName") {
        if (value) {
          if (value.length <= 2 || value.length > 30) {
            flag = false;
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
      }
      // 订单号非必填
      else if (obj == "tradeId") {
        reg = /^[A-Za-z0-9]{2,30}$/;
        if (value) {
          if (!reg.test(value) || value.length < 9) {
            flag = false;
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
      }
      // 重置金额非必填
      else if (obj == "amountRmb") {
        reg = /^[1-9][0-9]*\.[0-9]{1,2}$|^0\.[0-9]{1,2}$|^[1-9][0-9]*$|^0$/;
        if (value) {
          if (!reg.test(value)) {
            flag = false;
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
      }
      // 其他只验证是否是非空
      else {
        if (value || value === 0) {
          flag = true;
        } else {
          flag = false;
        }
      }
      // 返回验证结果
      this.validateRepairBillObj[obj] = !flag;
      return flag;
    },
    /**
     * 通过选择角色，获得用户列表
     */
    getUserListOfRole() {
      // 重置用户名称
      this.editRepairBillObj.userName = "";
      this.validateRepairBillObj.userName = "";
      this.editRepairBillObj.billType = null;
      // 查询
      this.qryUserForSelect();
    },
    /**
     * 根据角色，查询商家列表
     */
    qryUserForSelect() {
      // 用户角色选择的是商家
      if (this.editRepairBillObj.userRole === "BUSINESS") {
        getMerchantList().then(res => {
          if (res.data.code === 200) {
            this.roleUserList = res.data.data.apply_merchant_list;
          }
        });
        // 填充工单类型
        this.editRepairBillObj.billType = ''
        this.editRepairBillObj.receiverAccount = ''
      }
      // 用户角色选择的是承兑人，会自动填充工单类型，工单受理人
      else if (this.editRepairBillObj.userRole === "ACCEPTER") {
        getAccepterList({
          acceptorKey: "",
          pageNo: 1,
          pageSize: 9999,
        }).then(res => {
          if (res.data.code === 200) {
            this.roleUserList = res.data.data.resultList
          }
        });
        // 填充工单类型
        this.editRepairBillObj.billType = 13;
        this.editRepairBillObj.receiverAccount = this.$store.getters.loginParam.accountname;
      }
    },
    /**
     * 工单内容的粘贴事件，可以截图后在输入框粘贴会直接上传图片
     * 注：api受浏览器的限制，只能支持较新的浏览器才支持
     */
    contentPasteImage(e) {
      // 获得粘贴板内容
      let clipboardData = e.clipboardData || e.originalEvent.clipboardData;
      // 粘贴操作
      if (clipboardData.types && clipboardData.items.length > 0) {
        for (let item of clipboardData.items) {
          // 遍历粘贴板内容，判断只有图片的时候才会上传
          if (item && item.kind == "file" && item.type.match(/^image/)) {
            // 将粘贴板的文件转为file
            let file = item.getAsFile();
            // 将文件组装成elementui上传组件支持解析的结构，再调用onuploadchange方法
            let imageFile = {
              name: file.name,
              percentage: 100,
              size: file.size,
              raw: file,
              from: "paste",
              status: "finished",
              uid: file.lastModified
            };
            console.log(imageFile);
            this.onUploadChange(imageFile);
            break;
          }
        }
      }
    },
    /**
     * 上传图片
     */
    onUploadChange(file) {
      const _this = this;
      // 验证文件类型
      const IMGTYPE = ["image/jpeg", "image/png", "image/jpg"];
      // 验证文件大小
      const MAXSIZE = file.size / 1024 / 1024 < 2;

      if (IMGTYPE.indexOf(file.raw.type) < 0) {
        this.$message({
          message: "请上传(*.jpg/*.png/*.jpeg)格式的图片",
          type: "error"
        });
        return;
      }
      if (!MAXSIZE) {
        this.$message({
          message: "图片大小不能超过2MB!",
          type: "error"
        });
        return;
      }
      // 判断文件最多3个
      if (this.editRepairBillObj.relativeImgUrlList.length > 2) {
        this.$message({
          message: "您已达到（3个）图片上限",
          type: "error"
        });
        return;
      }
      // 读取文件
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      // 读取成功，请求后台
      reader.onload = e => {
        addImgFile({
          imageContent: reader.result,
          imageType: "CLOUD_FLASH_PAY"
        }).then(res => {
          if (res.data.code === 200) {
            this.editRepairBillObj.relativeImgUrlList.push({
              imageData: reader.result,
              imageFullUrl: res.data.data.imageFullUrl,
              imageShortUrl: res.data.data.imageShortUrl
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        });
      };
    },
    /**
     * 图片删除
     */
    removeImage(index) {
      this.editRepairBillObj.relativeImgUrlList.splice(index, 1);
    },

    /**
     * 选择类型后，自动填充到工单原因里
     */
    changeBillType(val) {
      // if (!this.editRepairBillObj.content) {
      let resultArr = this.billTypeList[0].list.concat(
        this.billTypeList[1].list
      );
      for (let item of resultArr.values()) {
        if (this.editRepairBillObj.billType === item.value) {
          this.editRepairBillObj.content = item.label;
          break;
        }
      }
      //   if (this.editRepairBillObj.billType == "0") {
      //     this.editRepairBillObj.content = '会员已转账，但承兑人没放行';
      //   }
      //   if (this.editRepairBillObj.billType == "1") {
      //     this.editRepairBillObj.content = '会员没有下单，直接转账';
      //   }
      //   if (this.editRepairBillObj.billType == "2") {
      //     this.editRepairBillObj.content = '其它类型';
      //   }
      //   if (this.editRepairBillObj.billType == "3") {
      //     this.editRepairBillObj.content = '用户转错金额';
      //   }
      //   if (this.editRepairBillObj.billType == "4") {
      //     this.editRepairBillObj.content = '无缘无故收到打款';
      //   }
      //   if (this.editRepairBillObj.billType == "5") {
      //     this.editRepairBillObj.content = '延时赔偿';
      //   }
      //   if (this.editRepairBillObj.billType == "6") {
      //     this.editRepairBillObj.content = '上线申请';
      //   }
      //   if (this.editRepairBillObj.billType == "7") {
      //     this.editRepairBillObj.content = '下线申请';
      //   }
      // // }
    },

    /**
     * 列表操作
     */
    /**
     * 排序
     */
    onSortChange(col) {
      console.log(col);
      this.listQuery.orderField = col.prop;
      if (col.order) {
        if (col.order == "ascending") {
          this.listQuery.orderStatus = "asc";
        }
        if (col.order == "descending") {
          this.listQuery.orderStatus = "desc";
        }
      } else {
        this.listQuery.orderStatus = "";
      }
      // 根据排序查询
      this.queryData();
    },

    /**
     * 重启工单
     */
    rebootBill() {
      if (this.rebootReason == null || this.rebootReason == "") {
        this.rebootReasonError = "请输入重启工单理由";
        return;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      rebootBill({
        id: this.currentRepairBillObj.id,
        rebootReason: this.rebootReason
      }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.rebootReason = "";
          this.rebootReasonError = "";
          this.rebootBillModal = false;
          this.refreshData();
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    /**
     * 完结工单
     */
    finishBill() {
      if (this.handleRemark == null || this.handleRemark == "") {
        this.handleRemarkError = "请输入处理结果";
        return;
      }
      // 获得图片地址
      let imageShortUrlList = [];
      if (
        this.editRepairBillObj.relativeImgUrlList &&
        this.editRepairBillObj.relativeImgUrlList.length > 0
      ) {
        this.editRepairBillObj.relativeImgUrlList.forEach((v, i) => {
          imageShortUrlList.push(v.imageShortUrl);
        });
        this.editRepairBillObj.relativeImgUrlList = imageShortUrlList;
      }
      finishBill({
        id: this.currentRepairBillObj.id,
        handleRemark: this.handleRemark,
        handleImgs: this.editRepairBillObj.relativeImgUrlList.join(",")
      }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          // 清空完结工单填写的信息，并关闭弹出框
          this.handleRemark = "";
          this.handleRemarkError = "";
          this.editRepairBillObj.relativeImgUrlList = [];
          this.finishBillModal = false;
          //
          this.refreshData();
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    /**
     * 查看工单
     */
    showCkRepairBillModal(row) {
      // 设置操作的当前对象
      this.repairBillDetailModal = true;
      this.currentRepairBillObj.id = row.id;
      this.currentRepairBillObj.title = "查看工单";
    },
    /**
     * 跟进工单
     */
    showGjRepairBillModal(row) {
      // 设置操作的当前对象
      this.repairBillDetailModal = true;
      this.currentRepairBillObj.id = row.id;
      this.currentRepairBillObj.title = "跟进工单";

      // 如果没有分配过工单受理人，就会自动给一个工单受理人
      if (!row.receiverAccountName) {
        // 获得当前用户的账号
        let receiver = JSON.parse(window.localStorage.getItem("loginParam"))
          .accountname;
        let obj = {};
        obj = this.receiverList.find(item => {
          return item.eosno === receiver;
        });
        handOverOrDistributeReceiver({
          id: this.currentRepairBillObj.id,
          receiver: obj.eosno,
          receiverNickName: obj.name,
          assignType: "ALLOCATION"
        }).then(res => {
          if (res.data.code === 200) {
            // 刷新当前页面数据
            this.refreshData();
          }
        });
      }
    },
    /**
     * 关闭工单详情弹框
     */
    closeDetailRepairBill() {
      this.repairBillDetailModal = false;
      this.currentRepairBillObj.id = "";
      this.currentRepairBillObj.title = "";
    },
    /**
     * 分配工单
     */
    showFpRepairBillModal(row) {
      // 设置操作的当前对象
      this.currentRepairBillObj.id = row.id;
      this.currentRepairBillObj.title = "分配工单";
      // 分配工单弹框
      this.receiverModal = true;
      this.receiverError = "";
      // 判断是否有工单受理人，如果没有，就默认获取当前账户
      if (row.receiverAccountName) {
        this.receiver = row.receiverAccountName;
      } else {
        // 获得当前用户的账号
        this.receiver = JSON.parse(
          window.localStorage.getItem("loginParam")
        ).accountname;
      }
      this.assignType = "ALLOCATION";
      // 获得工单受理人列表
      this.getReceiverList();
    },
    /**
     * 转交工单
     */
    showZjRepairBillModal(row) {
      // 设置操作的当前对象
      this.currentRepairBillObj.id = row.id;
      this.currentRepairBillObj.title = "转交工单";
      // 分配工单弹框
      this.receiverModal = true;
      this.receiverError = "";
      // 判断是否有工单受理人，如果没有，就默认获取当前账户
      if (row.receiverAccountName) {
        this.receiver = row.receiverAccountName;
      } else {
        // 获得当前用户的账号
        this.receiver = JSON.parse(
          window.localStorage.getItem("loginParam")
        ).accountname;
      }
      this.assignType = "DELIVER";
      // 获得工单受理人列表
      this.getReceiverList();
    },
    /**
     * 完结工单
     */
    showWjRepairBillModal(row) {
      // 设置操作的当前对象
      this.currentRepairBillObj.id = row.id;
      this.currentRepairBillObj.title = "完结工单";
      // 完结工单弹框
      this.handleRemark = "";
      this.handleRemarkError = "";
      // 完结工单每次点开会清空之前上传的图片信息
      this.editRepairBillObj.relativeImgUrlList = [];
      this.finishBillModal = true;
    },
    /**
     * 重启工单
     */
    showCqRepairBillModal(row) {
      // 设置操作的当前对象
      this.currentRepairBillObj.id = row.id;
      this.currentRepairBillObj.title = "重启工单";
      // 重启工单弹框
      this.rebootBillModal = true;
      this.rebootReason = "";
      this.rebootReasonError = "";
    },
    /**
     * 新增工单弹出框
     */
    showAddRepairBillModal() {
      this.resetRepairBill();
      this.editRepairBillTitle = "新增工单";
      this.editRepairBillType = "add";
      this.editRepairBillModal = true;
      this.editRepairBillObj.relativeImgUrlList = [];
      // 获得预订单id
      this.getPreRepairBillNo();
    },
    /**
     * 编辑工单弹框
     */
    showEditRepairBillModal(row) {
      this.resetRepairBill();
      this.editRepairBillTitle = "编辑工单";
      this.editRepairBillType = "edit";
      this.editRepairBillModal = true;
      qryRepairBillDetail({ id: row.id }).then(res => {
        if (res.data.code == 200) {
          this.editRepairBillObj = {
            id: res.data.data.id,
            billType: res.data.data.billType, // 工单类型
            receiverAccount: res.data.data.receiverAccount, // 工单受理人账号
            receiverNickname: res.data.data.receiver,
            content: res.data.data.content, // 工单内容
            relativeImgUrlList: [], // 相对图片地址列表
            tradeId: res.data.data.tradeId, // 订单号，手工录入
            userName: res.data.data.userName,
            userRole: res.data.data.userRole,
            subName: res.data.data.subName, //  会员账号
            amountRmb: Number(res.data.data.amountRmb).toFixed(2) // 充值金额
          };
          if (
            res.data.data.absoluteImgUrlList &&
            res.data.data.absoluteImgUrlList.length > 0
          ) {
            res.data.data.absoluteImgUrlList.forEach((v, i) => {
              this.editRepairBillObj.relativeImgUrlList.push({
                imageData: v,
                imageFullUrl: v,
                imageShortUrl: res.data.data.relativeImgUrlList[i]
              });
            });
          }
        }
      });
    },
    /**
     * 查看单大图
     */
    openLookBigImgModal(url) {
      this.lookBigImgUrl = url;
      this.lookBigImgModal = true;
    },
    /**
     * 跳转到工单详情页面
     */
    toRepairBillDetail(row) {
      this.$router.push({ path: "repair-detail", query: { id: row.id } });
    },
    /**
     * 重置工单添加
     */
    resetRepairBill() {
      this.editRepairBillObj.id = "";
      this.editRepairBillObj.preOrderId = "";
      this.editRepairBillObj.billType = "";
      this.editRepairBillObj.receiverAccount = "";
      this.editRepairBillObj.receiverNickname = "";
      this.editRepairBillObj.content = "";
      this.editRepairBillObj.relativeImgUrlList = [];
      this.editRepairBillObj.userRole = "";
      this.editRepairBillObj.userName = "";
      this.editRepairBillObj.tradeId = "";
      this.editRepairBillObj.subName = "";
      this.editRepairBillObj.amountRmb = "";
    },
    /**
     * 分配，转交工单
     */
    receiverBill() {
      if (this.receiver == null || this.receiver == "") {
        this.receiverError = "请选择工单受理人";
        return;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      let obj = {};
      obj = this.receiverList.find(item => {
        return item.eosno === this.receiver;
      });

      handOverOrDistributeReceiver({
        id: this.currentRepairBillObj.id,
        receiver: obj.eosno,
        receiverNickName: obj.name,
        assignType: this.assignType
      }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          // 刷新当前页面数据
          this.refreshData();
          // 关闭弹出框
          this.receiverModal = false;
          this.receiverError = "";
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
    /**
     * 查询工单受理人列表
     */
    getReceiverList() {
      let param = {
        from: JSON.parse(window.localStorage.getItem("loginParam")).accountname,
        eosno: "",
        start_page: 1,
        page_num: 9999,
        status: "1"
      };
      getBackendUserList(param).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.receiverList = res.data.data.users_array;
          }
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    /**
     * 分页
     */
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    /**
     * 转换钱
     */
    convertMoney(num) {
      return Number(num / 10000).toFixed(2);
    }
  }
};
</script>
<style>
.el-select-group__title {
  text-align: center;
}
.el-dialog__body {
  padding: 10px 20px;
}
</style>
<style scoped>
/* 页面整体样式 */
.container_box {
  margin: 10px 30px 0 30px;
  font-size: 15px;
}
.tab-container {
  margin: 20px 30px 30px 30px;
}

/* 查询文本框大小 */
.container_box .el-input,
.container_box .el-select {
  width: 175px;
}
/* 工单状态的样式 */
.tags {
  font-size: 14px;
  margin-right: 10px;
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

/* 新建工单弹出框样式 */
.order_modal .order_list {
  display: flex;
  padding: 5px 20px;
}
.order_modal .order_list .list_title {
  width: 100px;
  text-align: right;
  padding-top: 10px;
}
.order_modal .order_list .list_content {
  flex: 1;
  padding-left: 10px;
  text-align: left;
}
.order_modal .order_list .list_content .text_error {
  font-size: 12px;
  color: #f95353;
  padding-top: 5px;
}

/* 全局暴露的上传图片样式 */
.upload_container .upload_image_list {
  height: 120px;
  width: 120px;
  display: inline-block;
  border-radius: 4px;
  position: relative;
  margin-right: 15px;
  margin-bottom: 15px;
}

.upload_container .upload_image_list img {
  height: 120px;
  width: 120px;
}

.upload_container .upload_image_list .upload_image_remove {
  font-size: 22px;
  color: #999;
  position: absolute;
  top: -12px;
  right: -12px;
  transition: all 0.2s;
  cursor: pointer;
}

.upload_container .upload_image_list .upload_image_remove:hover {
  color: #555;
}

.upload_container .avatar-uploader {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  background: #f2f2f2;
}

.upload_container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.upload_container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 90px;
  text-align: center;
}

.upload_container .avatar-uploader .desc_text {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #8c939d;
}

.upload_container .avatar-uploader .desc_text:hover {
  color: #8c939d;
}
</style>
