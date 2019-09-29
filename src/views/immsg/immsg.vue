<template>
  <div>
    <el-container class="immsg_container">
      <el-header class="immsg_header">
        <!-- 搜索 -->
        <div class="header_search" style="width:300px;">
          <input type="text" v-model="inputSearch" placeholder="搜索" @keyup.enter="getLastSessionGroupList()">
        </div>
        <!-- 聊天标题 -->
        <div class="header_title" :class="{selected:currentChat==0}" @click="switchChat(0)" v-if="merchantChatObj.name">
          <div class="title_text">
            商户{{merchantChatObj.name||"-"}}
            <el-badge v-if="merchantChatObj.unread>0" :value="merchantChatObj.unread" class="item"> </el-badge>
          </div>
        </div>
        <div class="header_title" :class="{selected:currentChat==1}" @click="switchChat(1)" v-if="acceptorChatObj.name">
          <div class="title_text">
            承兑人{{acceptorChatObj.name||"-"}}
            （<span v-if="acceptorChatObj.online==0 || !acceptorChatObj.online">离线</span><span v-if="acceptorChatObj.online==1">在线</span><span v-if="acceptorChatObj.online==2">已移除</span>）
            <el-badge v-if="acceptorChatObj.unread>0" :value="acceptorChatObj.unread" class="item"></el-badge>
          </div>
        </div>
        <!-- 退出按钮 -->
        <div class="header_exit">
          <el-button type="danger" size="mini" @click="hideChat()">隐藏</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="300px" class="immsg_order">
          <div class="order_box">
            <el-collapse v-model="currentMenu">
              <el-collapse-item title="处理中" name="1">
                <div class="order_list" v-for="(item,index) in immsgChatMenuList" v-if="item.status==1" :class="{'selected':item.selected}" @click="immsgChatMenuOfClick(item,index)">
                  <div class="list_content content">
                    <div class="cotent_left">工单号：{{item.repairBillNo}} 处理中
                    </div>
                    <div class="content_right">
                      <el-badge :value="renderUnread(item.unread)" class="item" v-if="item.unread>0"></el-badge>
                    </div>
                  </div>
                  <div class="list_content desc">
                    <div class="cotent_left">会员名：{{item.userName}}</div>
                    <div class="content_right" style="width:100px;">{{renderTime(item.updateTime)}}</div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="已完结" name="2">
                <div class="order_list" v-for="(item,index) in immsgChatMenuList" v-if="item.status==2" :class="{'selected':item.selected}" @click="immsgChatMenuOfClick(item,index)">
                  <div class="list_content content">
                    <div class="cotent_left">工单号：{{item.repairBillNo}} 已完结</div>
                    <div class="content_right">
                      <el-badge :value="renderUnread(item.unread)" class="item" v-if="item.unread>0"></el-badge>
                    </div>
                  </div>
                  <div class="list_content desc">
                    <div class="cotent_left">会员名：{{item.userName}}</div>
                    <div class="content_right" style="width:100px;">{{renderTime(item.updateTime)}}</div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="待处理" name="0">
                <div class="order_list" v-for="(item,index) in immsgChatMenuList" v-if="item.status==0" :class="{'selected':item.selected}" @click="immsgChatMenuOfClick(item,index)">
                  <div class="list_content content">
                    <div class="cotent_left">工单号：{{item.repairBillNo}} 待处理</div>
                    <div class="content_right">
                      <el-badge :value="renderUnread(item.unread)" class="item" v-if="item.unread>0"></el-badge>
                    </div>
                  </div>
                  <div class="list_content desc">
                    <div class="cotent_left">会员名：{{item.userName}}</div>
                    <div class="content_right" style="width:100px;">{{renderTime(item.updateTime)}}</div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-aside>
        <el-main>
          <el-container>
            <el-main>
              <!-- 聊天窗口组件 -->
              <Chat ref="chat" :merchantChatObj="merchantChatObj" :acceptorChatObj="acceptorChatObj" :repairBillObj="repairBillObj" :currentChat="currentChat" @openFinishBill="openFinishBill" @openRebootBill="openRebootBill" @addUserToRepairGroup="addUserToRepairGroup" @setChatToListTop="setChatToListTop" @countImmsgChatUnRead="countImmsgChatUnRead"></Chat>
            </el-main>
            <!-- 右侧订单信息 -->
            <el-aside width="280px" class="immsg_info">
              <div class="info_box">
                <!-- 订单信息 -->
                <div class="info_title">订单信息</div>
                <div class="info_list">
                  <div class="list_label">商家名称</div>
                  <div class="list_content">{{repairBillObj.merchantName||"-"}}</div>
                </div>
                <div class="info_list">
                  <div class="list_label">原订单号</div>
                  <div class="list_content">
                    {{repairBillObj.tradeId || "-"}}
                    <span v-if="repairBillObj.tradeId==null || repairBillObj.tradeId==''">
                      <span class="text-success" v-if="repairBillObj.billStatus==1" @click="openRelationOrder()">关联订单号</span>
                      <span class="text-success" v-if="repairBillObj.billStatus==1" @click="openRepairOrder('add')">新建补单</span>
                    </span>
                    <span v-else>
                      <span class="text-success" v-if="repairBillObj.tradeId&&repairBillObj.billStatus==1" @click="openRelationOrder()">修改</span>
                    </span>
                  </div>
                </div>
                <div class="info_list">
                  <div class="list_label">补单号</div>
                  <div class="list_content">
                    <span v-if="repairBillObj.tradeId==null||repairBillObj.tradeId==''">
                      <span class="text-disabled">补单</span>
                    </span>
                    <span v-else>
                      <span v-if="repairBillObj.repairTradeId">
                        <span>
                          补单-{{repairBillObj.repairTradeId}}
                        </span>
                        <span class="text-success" v-if="repairBillObj.billStatus==1" @click="openEditRepairOrder()">修改</span>
                      </span>
                      <span v-else>
                        <span class="text-success" v-if="repairBillObj.billStatus==1" @click="openRepairOrder('relation')">补单</span>
                      </span>
                    </span>
                  </div>
                </div>
                <!-- <div class="info_list">
                  <div class="list_label">异常单号</div>
                  <div class="list_content">{{repairBillObj.abnormalBillNo||"-"}}&nbsp;&nbsp;&nbsp;
                    <span v-if="repairBillObj.billStatus==1">
                      <span v-if="repairBillObj.abnormalBillNo" class="text-success" @click="showExceptionOrderOfWeekModal()">修改</span>
                      <span v-else class="text-success" @click="showExceptionOrderOfWeekModal()">关联异常单</span>
                    </span>
                  </div>
                </div> -->
                <div class="info_list">
                  <div class="list_label">会员账号</div>
                  <div class="list_content">{{repairBillObj.subName||"-"}}&nbsp;&nbsp;&nbsp;<span v-if="repairBillObj.billStatus==1" class="text-success" @click="showEditSubNameModal()">修改</span>
                  </div>
                </div>
                <div class="info_list">
                  <div class="list_label">金额</div>
                  <div class="list_content">{{convertMoney(repairBillObj.amountRmb) || "-"}}元&nbsp;&nbsp;&nbsp;<span v-if="repairBillObj.billStatus==1" class="text-success" @click="showEditAmountModal()">修改</span>
                  </div>
                </div>
                <!-- 工单信息 -->
                <div class="info_title">工单信息</div>
                <div class="info_list">
                  <div class="list_label">工单号</div>
                  <div class="list_content">{{repairBillObj.repairBillNo||"-"}}</div>
                </div>
                <div class="info_list">
                  <div class="list_label">创建时间</div>
                  <div class="list_content">{{repairBillObj.createTime||"-"}}</div>
                </div>
                <div class="info_list">
                  <div class="list_label">发起人</div>
                  <div class="list_content">{{repairBillObj.creatorAccount||"-"}}</div>
                </div>
                <div class="info_list">
                  <div class="list_label">状态</div>
                  <div class="list_content">{{repairBillObj.billStatusDesc||"-"}}</div>
                </div>
                <div class="info_list">
                  <div class="list_label">工单受理人</div>
                  <div class="list_content">
                    <span>{{repairBillObj.receiverAccount||"-"}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span v-if="repairBillObj.receiverAccount && repairBillObj.billStatusDesc=='受理中'">
                      <span class="text-success" v-if="repairBillObj.billStatus==1" @click="showReceiverBillModal()">转交</span>
                    </span>
                    <span v-else>
                      <span class="text-success" v-if="repairBillObj.billStatus==1" @click="showReceiverBillModal()">分配</span>
                    </span>
                  </div>
                </div>
                <div class="info_list">
                  <div class="list_content">内部记录：<span class="text-success" v-if="repairBillObj.billStatus==1" @click="traceBillModal=true;">跟进</span></div>
                  <div class="list_content">
                    <div>{{repairBillObj.creatorAccount}}创建了工单</div>
                    <div style="color:#999;">{{repairBillObj.createTime}}</div>
                    <div style="padding:3px 0px;">{{repairBillObj.content}}</div>
                    <div style="padding-top:5px;" v-if="repairBillObj.absoluteImgUrlList&&repairBillObj.absoluteImgUrlList.length>0">
                      <span v-for="item in repairBillObj.absoluteImgUrlList">
                        <img :src="item" style="max-width:80px;margin-right:10px;" @click="openLookBigImgModal(item)">
                      </span>
                    </div>

                    <div v-for="(item,index) in repairBillObj.repairBillLogList" :key="index" style="padding:5px;background:#eee;color:#555;border-radius:4px;">
                      <div v-html="item" @click="openImage($event)"></div>
                    </div>

                  </div>
                </div>
              </div>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </el-container>

    <!-- 用到的一些操作的弹出框 -->
    <!-- 修改会员账号 -->
    <el-dialog title="修改会员账号" :visible.sync="editSubNameModal" width="360px" append-to-body>
      <div>
        <el-input type="text" v-model="editSubName" minlength="2" maxlength="30" placeholder="请输入会员账号"></el-input>
        <div style="font-size:12px;color:red;padding-top:3px;" v-if="editSubNameError">请输入2-30位字符</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="default" @click="editSubNameModal=false;editSubName='';editSubNameError='';">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="editSubNameSure()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改金额 -->
    <el-dialog title="修改金额" :visible.sync="editAmountModal" width="360px" append-to-body>
      <div>
        <el-input type="text" maxlength="20" v-model="editAmount" placeholder="请输入金额"></el-input>
        <div style="font-size:12px;color:red;padding-top:3px;" v-if="editAmountError">请输入正确的金额</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button type="default" @click="editAmountModal=false;editAmount='';editAmountError='';">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="editAmountSure()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配，转交工单 -->
    <el-dialog :title="receiverTitle" :visible.sync="receiverModal" width="500px" append-to-body>
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
    <!-- 跟进工单 -->
    <el-dialog title="跟进工单" :visible.sync="traceBillModal" width="500px" append-to-body>
      <div>
        <el-input v-model="traceBillContent" type="textarea" placeholder="请输入跟进内容" rows="4"></el-input>
        <div v-if="traceBillError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{traceBillError}}</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="traceBillModal=false;traceBillContent='';traceBillError='';">取 消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="traceBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查询修改关联订单的列表 -->
    <el-dialog title="关联订单" :visible.sync="relationOrderModal" width="860px" id="collectOrder1" append-to-body>
      <div>
        <el-input v-model="relationOrderContent" placeholder="搜索/选择订单号/会员号">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="queryRelationOrder()"></el-button>
        </el-input>
        <el-card shadow="always">
          <div v-if="relationOrderList&&relationOrderList.length>0">
            <div v-for="(item,index) in relationOrderList" style="padding:8px 0px;">
              <el-radio v-model="relationOrderId" :label="item.tradeApplyUq">订单号：
                <span v-if="item.originTradeUq!==null && item.originTradeUq!=='null' && item.originTradeUq!==''">补单-</span>
                {{item.tradeApplyUq}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                会员号：{{item.fastSubName}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                金额：{{convertMoney(item.userGac)}}</el-radio>
            </div>
          </div>
          <div v-else style="color:#999;font-size:13px;text-align:center;">暂无数据</div>
        </el-card>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="relationOrderCancel()">取 消</el-button>
        <el-button class="btn_submit" :loading="btnLoading" type="primary" @click="relationOrderSure()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 补单-查询补单列表 -->
    <el-dialog title="修改补单" :visible.sync="editRepairOrderModal" width="860px" append-to-body>
      <div>
        <el-input v-model="editRepairOrderContent" placeholder="搜索/选择订单号/会员号">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="queryEditRepairOrder()"></el-button>
        </el-input>
        <el-card shadow="always">
          <div v-if="editRepairOrderList&&editRepairOrderList.length>0">
            <div v-for="(item,index) in editRepairOrderList" style="padding:8px 0px;">
              <el-radio v-model="editRepairOrderId" :label="item.tradeApplyUq">
                订单号：{{item.tradeApplyUq}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;会员号：{{item.fastSubName}}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金额：{{convertMoney(item.userGac)}}</el-radio>
            </div>
          </div>
          <div v-else style="color:#999;font-size:13px;text-align:center;">暂无数据</div>
        </el-card>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="editRepairOrderCancel()">取 消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="editRepairOrderSure()">确 定</el-button>
      </div>
    </el-dialog>
    <!--补单-新增补单弹框-->
    <el-dialog title="补单" :visible.sync="repairOrderModal" class="form-repair-order" width="560px" append-to-body>
      <el-form :model='repairOrderObj' :rules='repairOrderRules' ref='repairOrderObj' label-suffix="：" label-width='100px'>
        <el-form-item label='发起人' prop='sponsor'>
          <el-select v-model="repairOrderObj.sponsor" filterable placeholder="请输入发起人搜索后选择" style="width:260px;">
            <el-option v-for="item in repairOrderSponsorList" :key="item.id" :label="item.accountName" :value="item.accountName">
              {{item.accountName+'（' + item.merchantName+'）'}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='承兑人' prop='accepter'>
          <el-select v-model="repairOrderObj.accepter" @change="getPayCardInfo" filterable placeholder="请输入承兑人搜索后选择" style="width:260px;">
            <el-option v-for="item in repairOrderAcceptorList" :key="item.id" :label="item.accountName" :value="item.accountName">
              {{item.accountName+'（' + item.fullName+'）'}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='付款账号' prop='payCardId'>
          <el-select :disabled="!repairOrderObj.accepter" @change="changePayCardInfo" v-model="repairOrderObj.payCardId" filterable :title="!repairOrderObj.accepter ? '需先选择承兑人' : ''" :placeholder="!repairOrderObj.accepter ? '请先选择承兑人' : '请选择付款账号'" style="width:260px;">
            <el-option-group v-for="group in repairOrderPayCardInfoList" :key="group.cardType" :label="group.cardType">
              <el-option v-for="item in group.payCardInfoList" :key="item.id" :label="item.cardNo" :value="item.id">
                {{item.bankAccName}}-{{item.bankName}}-{{item.cardNo}}
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label='会员名' prop='fastSubName'>
          <el-input v-model='repairOrderObj.fastSubName' maxlength="20" placeholder="请输入会员名"></el-input>
        </el-form-item>
        <el-form-item label='交易金额' prop='amount'>
          <el-input v-model='repairOrderObj.amount' placeholder="请输入交易金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="订单时间" prop="applyTime">
          <el-date-picker :picker-options="pickerOptions" v-model="repairOrderObj.applyTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择订单时间" style="width:260px;">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repairOrderCancel('repairOrderObj')">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="repairOrderSure('repairOrderObj')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 完结工单 -->
    <el-dialog title="完结工单" :visible.sync="finishBillModal" width="740px" append-to-body>
      <div>
        <el-input v-model="handleRemark" type="textarea" :rows="6" maxlength="100" placeholder="请输入处理结果" @input="handleRemarkError='';" @paste.native="contentPasteImage($event)"></el-input>
        <div style="color:#b0b3b9;font-size:13px;padding-top:3px;">可在输入框内复制粘贴截图上传，单次最多可上传三张截图</div>
        <div v-if="handleRemarkError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{handleRemarkError}}</div>
        <div class="list_content" style="padding-top:10px;">
          <div class="upload_container">
            <span v-if="relativeImgUrlList">
              <span v-for="(item,index) in relativeImgUrlList" :key="item.imageShortUrl" class="upload_image_list">
                <img :src="item.imageData" @click="openLookBigImgModal(item.imageData)" />
                <i class="el-icon-circle-close upload_image_remove" @click="removeImage(index)"></i>
              </span>
            </span>
            <el-upload action="" class="avatar-uploader" ref="uploadImg" :on-change="onUploadChange" :show-file-list="false" :auto-upload="false">
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
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="finishBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重启工单 -->
    <el-dialog title="重启工单" :visible.sync="rebootBillModal" width="740px" append-to-body>
      <div>
        <el-input v-model="rebootReason" type="textarea" :rows="6" maxlength="100" placeholder="请输入重启工单理由" @input="rebootReasonError='';"></el-input>
        <div v-if="rebootReasonError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{rebootReasonError}}</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="rebootBillModal=false;">取 消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="rebootBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 关联异常单 -->
    <el-dialog title="关联异常单" :visible.sync="exceptionOrderOfWeekModal" width="740px" append-to-body>
      <div style="text-align:center;margin-bottom:30px;">
        <el-select v-model="abnormalBillNo" filterable placeholder="请选择异常单号" style="width:400px;">
          <el-option v-for="item in exceptionOrderOfWeekList" :label="item.abnormalBillNo" :value="item.abnormalBillNo">
            <span>
              {{item.abnormalBillNo}}&nbsp;&nbsp;&nbsp;&nbsp;金额：{{Number(item.amount/10000).toFixed(2)}}元 &nbsp;&nbsp;&nbsp;&nbsp;到账时间：{{item.receivingTime}}
            </span>
          </el-option>
        </el-select>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="exceptionOrderOfWeekModal=false;abnormalBillNo='';">取 消</el-button>
        <el-button class="btn_submit" type="primary" :loading="btnLoading" @click="exceptionOrderOfWeekSure()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="860px" append-to-body>
      <div style="text-align:center;">
        <img :src="lookBigImgUrl" style="max-width:100%;" />
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getLastSessionGroupList, qryIMRepairBillDetail, qryIMFastPayTrade, qryIMFastPayRepairTrade, IMRepairOrder, updateIMAmount, updateIMRepairTrade, updateIMSubName, updateIMTandeId, getUidByAccount, addUserToSessionList, relationRepairOrder, qryPayCardMatchInfo, updateAbnormalBill } from '@/api/immsg.js'
import { orderManageList, repairOrder, getPayCardInfo, getMerchantList, getAccepterList } from '@/api/accountManage'
import { qryRepairBillList, traceBill, qryRepairBillListWithLabel, getPreRepairBillNo, addNewRepairBill, finishBill, rebootBill, handOverOrDistributeReceiver, updateMyNotReadAcceptBill, qryManagerForSelect, qryUserForSelect, addImgFile, qryNotDistBillForMerchant, qryMyNotReadAcceptBill, getBackendUserList } from '@/api/repairBill.js'
// import { getAbnormalBillOfWeek } from '@/api/exceptionOrder.js'
import { mapGetters, mapActions } from "vuex"
import Chat from '@/views/immsg/chat.vue'
export default {
  name: "immsg",
  components: {
    Chat
  },
  filtrs: {},
  props: [],
  data() {
    return {
      // 聊天相关的
      unreadImmsg: 0, // 未读消息的数量，通过计算得来的
      immsgChatMenuList: [],//  聊天的菜单的数据
      inputSearch: '',// 搜索聊天菜单
      currentMenu: ["0", "1", "2"], // 当前菜单，为数组的时候可以默认展开多个
      currentChat: 0, // 当前聊天的是谁， 0：商家，1：承兑人

      // 给到聊天子组件的数据
      // 商家聊天的状态
      merchantChatObj: {
        repairBillNo: '',//工单号
        name: '', // 账户名称
        uid: '', // 唯一聊天的标识
        status: 0,// 0：没有输入，1：正在输入中
        unread: 0,// 未读信息条数
      },
      // 承兑人聊天的状态
      acceptorChatObj: {
        repairBillNo: '',//工单号
        name: '', // 账户名称
        uid: '', // 唯一聊天的标识
        status: 0,// 0：没有输入，1：正在输入中
        online: 0,// 0：不在线，1：在线
        unread: 0,// 未读信息条数
      },

      // 工单，补单等相关的
      repairBillContent: '',// 搜索的工单号
      // 当前点击的工单的基本信息
      repairBillObj: {},

      // 修改会员名
      editSubNameModal: false,
      editSubName: '',
      editSubNameError: '',
      // 修改金额
      editAmountModal: false,
      editAmount: '',
      editAmountError: '',

      // 工单受理人数据列表
      receiverList: [],

      //校验是否是转交还是分配
      assignType: '',

      // 分配，转交工单
      receiverModal: false,
      receiverTitle: '',
      receiverError: '',
      receiver: '',

      // 跟进工单
      traceBillModal: false,
      traceBillContent: '',
      traceBillError: '',

      // 完结工单
      finishBillModal: false,
      handleRemark: '', // 工单处理结果
      handleRemarkError: '', // 错误提示

      // 重启工单
      rebootBillModal: false,
      rebootReason: '',
      rebootReasonError: '',

      // 关联订单号操作
      relationOrderModal: false,
      relationOrderContent: '',
      relationOrderId: '',
      relationOrderList: [],

      // 添加补单操作
      repairOrderModal: false, // 弹框
      repairOrderFlag: '', // 补单的状态，add：新建普通补单；relation：新建关联补单
      repairOrderSponsorList: [],// 补单发起人列表
      repairOrderAcceptorList: [],// 补单承兑人列表
      repairOrderPayCardInfoList: [],// 补单付款账号列表
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 //  new Date().getTime()
        }
      },
      // 补单编辑的对象
      repairOrderObj: {
        id: '',//工单的id
        sponsor: '',// 发起人
        accepter: '',// 承兑人
        payCardId: '',//卡id
        payCardUq: '',//付款账号
        cardType: '',// 卡类型
        fastSubName: '', // 会员号
        amount: '',// 交易金额
        applyTime: '',// 申请时间
        tradeApplyUq: '' // 需要补单的订单的单号
      },
      // 校验规则
      repairOrderRules: {
        sponsor: [
          { required: true, message: '请输入发起人并选择', trigger: ['blur', 'change'] }
        ],
        accepter: [
          { required: true, message: '请输入承兑人并选择', trigger: ['blur', 'change'] }
        ],
        payCardId: [
          { required: true, message: '请选择付款账号', trigger: ['blur', 'change'] }
        ],
        fastSubName: [
          { required: true, message: '请输入会员名', trigger: ['blur', 'change'] }
        ],
        applyTime: [
          { required: true, message: '请选择关联订单时间', trigger: ['blur', 'change'] }
        ],
        amount: [
          { required: true, message: '请输入交易金额', trigger: ['blur', 'change'] },
          {
            validator:
              (rule, value, callback) => {
                if (!/^0$|^0\.\d{1,2}$|^[1-9]\d*$|^[1-9]\d*\.\d{0,2}$/.test(value)) {
                  if (value < 10 || value > 100000000) {
                    callback(new Error('请输入10至10亿的交易金额'))
                  } else {
                    callback("请输入正确的交易金额")
                  }
                } else {
                  callback()
                }
              },
            trigger: ['blur', 'change']
          }
        ]
      },

      // 粘贴的图片
      relativeImgUrlList: [],

      // 修改补单列表操作
      editRepairOrderModal: false,
      editRepairOrderId: '',
      editRepairOrderContent: '',
      editRepairOrderList: [],

      // 修改异常订单
      exceptionOrderOfWeekModal: false,
      abnormalBillNo: '',
      exceptionOrderOfWeekList: [],

      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: '',

      // btn按钮的loading
      btnLoading: false,
    }
  },
  computed: {
    ...mapGetters(['loginParam', 'immsgBoxShow'])
  },
  watch: {},
  created() {
    // 默认加载组件的时候获取工单左侧聊天列表
    this.getLastSessionGroupList();
  },
  mounted() {
    getUidByAccount({ no: this.loginParam.accountname }).then(res => {
      if (res.data) {
        localStorage.setItem("chatImmsgUid", res.data.uid)
      }
    })
  },
  updated() { },
  methods: {
    ...mapActions(["changeImmsgUnread"]),
    /**
     * 查询最近3天的聊天列表
     */
    getLastSessionGroupList() {
      getLastSessionGroupList({ searchKey: this.inputSearch }).then(res => {
        console.log()
        if (res.data.code == 200) {
          let immsgChatMenuList = [];
          if (res.data.data && res.data.data.length > 0) {
            res.data.data.forEach((v, i) => {
              let unread = 0;
              if (sessionStorage.getItem(v.repairBillNo)) {
                unread = sessionStorage.getItem(v.repairBillNo);
              }
              // 如果留言有数量，也会加上
              if (v.repairBillMessageCount) {
                unread = Number(unread) + Number(v.repairBillMessageCount);
              }
              immsgChatMenuList.push({
                id: v.id, // id
                repairBillNo: v.repairBillNo,// 工单号
                status: v.billStatus,// 工单状态，处理中和已完成
                creator: v.creator, // 发起人
                userName: v.subName,// 会员名
                unread: unread,// 总共未读的数量
                selected: false,// 是否选中聊天
                updateTime: v.imUpdateTime,// 聊天消息的更新时间
                chatUserList: v.sessionUserList,// 参加该工单聊天的用户
              })
            })
          }
          this.immsgChatMenuList = immsgChatMenuList;
          // 加载列表，如果有聊天过的id就会默认选中当前聊天的窗口，没有的话就会取聊天列表的第一条
          if (sessionStorage.getItem("immsgCurrentBillId")) {
            this.defaultOpenFirstChat();
          } else {
            if (this.immsgChatMenuList && this.immsgChatMenuList.length > 0) {
              sessionStorage.setItem("immsgCurrentBillId", this.immsgChatMenuList[0].id);
              this.defaultOpenFirstChat();
            }
          }
          // 加载工单受理人列表，从go获取的数据
          this.getReceiverList();
        }
      })
    },
    /**
     * 加载列表，默认打开缓存中聊天的那个工单
     */
    defaultOpenFirstChat() {
      let billId = sessionStorage.getItem("immsgCurrentBillId");
      if (this.immsgChatMenuList && this.immsgChatMenuList.length > 0) {
        this.immsgChatMenuList.forEach((v, i) => {
          if (v.id == billId) {
            this.immsgChatMenuOfClick(v, i);
            return false;
          }
        })
      }
    },
    /**
     * 点击左侧工单号开始聊天
     */
    immsgChatMenuOfClick(item, index) {
      // 如果是点击的同一个，则不会重复请求
      // if (item.id == this.repairBillObj.id) return;

      // 重置左侧菜单所有的选中效果，并选中当前选择的
      this.resetRepairOrderChat();
      this.immsgChatMenuList[index].selected = true;
      this.immsgChatMenuList[index].unread = 0;
      sessionStorage.setItem(item.repairBillNo, 0);
      this.countImmsgChatAllUnRead();

      // 判断点击待处理的工单，就会自动把工单分配给当前用户
      if (item.status == 0) {
        let obj = this.receiverList.find((item) => {
          return item.eosno === this.loginParam.accountname
        });
        handOverOrDistributeReceiver({ id: item.id, receiver: this.loginParam.accountname, userName: this.loginParam.accountname, receiverNickName: obj.name, assignType: 'ALLOCATION' }).then(res => {
          if (res.data.code === 200) {
            this.setChatToListTop(item.id);
            // 请求后台，获得当前点击的工单的信息
            this.qryIMRepairBillDetail(item.id);
            // 添加到会话中
            addUserToSessionList({ id: item.id, sessionUserList: item.creator + "," + this.loginParam.accountname }).then(res => {
              // 这里不需要返回信息
            })
          } else {
            // 已经有人分配，会重新加载左侧列表，并给出错误提示
            this.getLastSessionGroupList();
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      } else {
        // 请求后台，获得当前点击的工单的信息
        this.qryIMRepairBillDetail(item.id);
      }
      // 清空聊天组件的数组
      this.$refs.chat.chatMessageList = [];
    },
    /**
     * 有新消息提醒的时候，计算对应工单消息未读的数量
     */
    countImmsgChatUnRead(repairBillNo) {
      this.immsgChatMenuList.forEach((v, i) => {
        if (v.repairBillNo == repairBillNo) {
          if (repairBillNo == this.repairBillObj.repairBillNo && this.immsgBoxShow) {
            v.unread = 0;
          } else {
            v.unread = Number(v.unread) + 1;
          }
          sessionStorage.setItem(repairBillNo, v.unread);
          return false;
        }
      })
      // 更新所有的消息记录
      this.countImmsgChatAllUnRead();
      // 更新消息时间
      this.updateImmsgChatTime();
    },
    /**
     * 计算所有聊天未读消息数量，并更新到本地缓存中
     */
    countImmsgChatAllUnRead() {
      let unread = 0;
      this.immsgChatMenuList.forEach((v, i) => {
        unread += Number(v.unread);
      })
      sessionStorage.setItem("immsgAllUnRead", unread)
      this.changeImmsgUnread(unread);
    },
    /**
     * 重置左侧菜单所有的选中效果
     */
    resetRepairOrderChat() {
      this.immsgChatMenuList.forEach((v, i) => {
        v.selected = false;
      })
    },
    /**
     * 将正在聊天的工单置顶显示，也可以应用在已处理中的重启订单
     */
    setChatToListTop(id) {
      let index, obj;
      for (let i in this.immsgChatMenuList) {
        if (this.immsgChatMenuList[i].id == id) {
          obj = this.immsgChatMenuList[i];
          index = i;
          break;
        }
      }
      obj.status = 1;
      obj.selected = true;
      this.immsgChatMenuList.splice(index, 1)
      this.immsgChatMenuList.unshift(obj);
      // 保存聊天置顶的工单id
      sessionStorage.setItem("immsgCurrentBillId", id);
    },
    /**
     * 更新详情的会员名会同步更新左侧菜单对应的会员名
     */
    updateChatMenuSubName(userName) {
      for (let obj of this.immsgChatMenuList) {
        if (obj.id == this.repairBillObj.id) {
          obj.userName = userName;
          break;
        }
      }
    },
    /**
     * 接收和发送消息的时候更新左侧列表的最后聊天时间
     */
    getDefaultTime(date = new Date()) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let digit = function (str, num = 1) {
        str = str.toString();
        return str[1] ? str : '0' + str;
      }
      return [year, month, day].map(digit).join("-") + " " + [hour, minute, second].map(digit).join(":");
    },
    updateImmsgChatTime() {
      for (let obj of this.immsgChatMenuList) {
        if (obj.id == this.repairBillObj.id) {
          obj.updateTime = this.getDefaultTime();
        }
      }
    },
    /**
     * 渲染未读数量，大于99显示99+
     */
    renderUnread(num) {
      if (num > 99) {
        return "99+"
      } else {
        return num;
      }
    },
    /**
     * 渲染时间，分为昨天，今天，以前的年月日
     */
    renderTime(str) {
      if (!str) return;
      let formatDate = function (date) {
        let y = date.getFullYear();
        let m = (Number(date.getMonth()) + 1) > 9 ? (Number(date.getMonth()) + 1) : ("0" + (Number(date.getMonth()) + 1));
        let d = Number(date.getDate()) > 9 ? Number(date.getDate()) : ("0" + Number(date.getDate()));
        return y + "-" + m + "-" + d;
      }
      // 当前时间
      let currentDate = formatDate(new Date(str));
      // 今天时间
      let nowDate = formatDate(new Date());
      // 昨天时间
      let zuoDate = new Date();
      zuoDate.setDate(zuoDate.getDate() - 1);
      zuoDate = formatDate(zuoDate);

      if (currentDate == nowDate) {
        let j = new Date(str);
        let hours = Number(j.getHours()) > 9 ? Number(j.getHours()) : "0" + Number(j.getHours());
        let minutes = Number(j.getMinutes()) > 9 ? Number(j.getMinutes()) : "0" + Number(j.getMinutes());
        return hours + ":" + minutes;
      } else if (currentDate == zuoDate) {
        let z = new Date(str);
        let hours = Number(z.getHours()) > 9 ? Number(z.getHours()) : "0" + Number(z.getHours());
        let minutes = Number(z.getMinutes()) > 9 ? Number(z.getMinutes()) : "0" + Number(z.getMinutes());
        return "昨天" + hours + ":" + minutes;
      } else {
        let cyear = currentDate.substring(0, 4);
        let nyear = nowDate.substring(0, 4);
        if (cyear == nyear) {
          let c = new Date(currentDate);
          let month = c.getMonth() + 1 > 9 ? c.getMonth() + 1 : "0" + (c.getMonth() + 1);
          let day = c.getDate() > 9 ? c.getDate() : "0" + c.getDate();
          return month + "-" + day;
        } else {
          return currentDate;
        }
      }
    },
    /**
     * 每次点发送，都会记录该工单的聊天的人
     */
    addUserToRepairGroup() {
      let userList = [];
      if (this.loginParam.accountname) {
        userList.push(this.loginParam.accountname);
      }
      if (this.repairBillObj.accepterName) {
        userList.push(this.repairBillObj.accepterName);
      }
      if (this.repairBillObj.merchantName) {
        userList.push(this.repairBillObj.merchantName);
      }
      addUserToSessionList({ id: this.repairBillObj.id, sessionUserList: userList.join(",") }).then(res => {
        // 这里不需要返回信息
      })
      // 更新消息时间
      this.updateImmsgChatTime();
    },
    /**
     * 根据工单号查询详情
     */
    qryIMRepairBillDetail(id) {
      qryIMRepairBillDetail({ id: id }).then(res => {
        if (res.data.code === 200) {
          this.repairBillObj = res.data.data;
          // 商家的聊天数据
          let merchantName = '';
          if (this.repairBillObj.submitUser) {
            merchantName = this.repairBillObj.submitUser;
          } else {
            merchantName = this.repairBillObj.merchantName;
          }
          // 判断有商家和承兑人默认会选择商家聊天窗口
          if (merchantName && this.repairBillObj.accepterName) {
            this.currentChat = 0;
          } else {
            // 判断只有商家的话就默认选择商家聊天窗口
            if (merchantName) {
              this.currentChat = 0;
            }
            // 判断只有承兑人的话就默认选择承兑人聊天窗口
            if (this.repairBillObj.accepterName) {
              this.currentChat = 1;
            }
          }
          getUidByAccount({ no: merchantName }).then(res => {
            if (res.data) {
              // 设置聊天的人，并发起聊天
              this.merchantChatObj = {
                repairBillNo: this.repairBillObj.repairBillNo,
                name: merchantName, // 账户名称
                uid: res.data.uid,
                status: 1,// 0：没有输入，1：正在输入中
                unread: 0,// 未读信息条数
              }
            }
          })
          // 承兑人的聊天数据
          getUidByAccount({ no: this.repairBillObj.accepterName }).then(res => {
            if (res.data) {
              // 设置聊天的人，并发起聊天
              this.acceptorChatObj = {
                repairBillNo: this.repairBillObj.repairBillNo,
                name: this.repairBillObj.accepterName, // 账户名称
                uid: res.data.uid,
                online: this.repairBillObj.accepterOnline,
                status: 1,// 0：没有输入，1：正在输入中
                unread: 0,// 未读信息条数
              }
            }
          })
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },

    /**
     * 选择异常单
     */
    showExceptionOrderOfWeekModal() {
      this.exceptionOrderOfWeekModal = true;
      this.abnormalBillNo = '';
      this.getAbnormalBillOfWeek();
    },
    getAbnormalBillOfWeek() {
      getAbnormalBillOfWeek({}).then(res => {
        if (res.data.code == 200) {
          this.exceptionOrderOfWeekList = res.data.data;
        }
      })
    },
    exceptionOrderOfWeekSure() {
      if (this.btnLoading) return;
      this.btnLoading = true;
      updateAbnormalBill({ abnormalBillNo: this.abnormalBillNo, tradeId: this.repairBillObj.tradeId }).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
     * 修改会员名和金额
     */
    showEditSubNameModal() {
      this.editSubName = ''
      this.editSubNameError = false
      this.editSubNameModal = true
    },
    editSubNameSure() {
      if (this.editSubName == '' || this.editSubName.length < 2) {
        this.editSubNameError = true;
        return;
      } else {
        this.editSubNameError = false;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      updateIMSubName({ id: this.repairBillObj.id, subName: this.editSubName }).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.updateChatMenuSubName(this.editSubName);
          this.editSubNameModal = false;
          this.editSubName = '';
          this.editSubNameError = '';
          this.qryIMRepairBillDetail(this.repairBillObj.id);
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },
    showEditAmountModal() {
      this.editAmountModal = true
      this.editAmount = ''
      this.editAmountError = false
    },
    editAmountSure() {
      if (!this.editAmount) {
        this.editAmountError = true;
        return;
      } else {
        this.editAmountError = false;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      updateIMAmount({ id: this.repairBillObj.id, amount: this.editAmount }).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.editAmount = '';
          this.editAmountError = '';
          this.editAmountModal = false;
          this.qryIMRepairBillDetail(this.repairBillObj.id);
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
    * 转交 or 分配工单
    */
    showReceiverBillModal() {
      // 分配工单弹框
      this.receiverModal = true;
      this.receiverError = '';
      // 判断是转交工单还是分配工单
      if (this.repairBillObj.receiverAccount) {
        this.receiverTitle = '转交工单';
        this.receiver = this.repairBillObj.receiverAccount;
        this.assignType = 'DELIVER'
      } else {
        this.receiverTitle = '分配工单';
        // 获得当前用户的账号
        this.receiver = JSON.parse(window.localStorage.getItem("loginParam")).accountname;
        this.assignType = 'ALLOCATION'
      }
      // 获得工单受理人列表
      this.getReceiverList();
    },
    getReceiverList() {
      let param = {
        "from": this.loginParam.accountname,
        "eosno": "",
        "start_page": 1,
        "page_num": 9999,
        "status" : "1"
      }
      getBackendUserList(param).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.receiverList = res.data.data.users_array
          }
        }
      })
    },
    receiverBill() {
      if (this.receiver == null || this.receiver == '') {
        this.receiverError = '请选择工单受理人'
        return
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      let obj = this.receiverList.find((item) => {
        return item.eosno === this.receiver
      });
      handOverOrDistributeReceiver({ id: this.repairBillObj.id, receiver: this.receiver, receiverNickName: obj.name, assignType: this.assignType }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          let userList = [];
          if (this.receiver) {
            userList.push(this.receiver);
          }
          if (this.repairBillObj.accepterName) {
            userList.push(this.repairBillObj.accepterName);
          }
          if (this.repairBillObj.merchantName) {
            userList.push(this.repairBillObj.merchantName);
          }
          addUserToSessionList({ id: this.repairBillObj.id, sessionUserList: userList.join(",") }).then(res => {
            // 这里不需要返回信息
          })
          this.qryIMRepairBillDetail(this.repairBillObj.id);
          // 关闭弹出框，并清空信息
          this.receiverModal = false;
          this.receiverError = '';
          this.receiver = '';
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
     * 关联订单操作，包括查询列表，点击取消和点击确定
     */
    openRelationOrder() {
      this.relationOrderContent = '';
      this.relationOrderId = '';
      this.relationOrderModal = true;
      this.relationOrderList = [];
      this.queryRelationOrder();
    },
    queryRelationOrder() {
      let param = {
        pageNo: 1,
        pageSize: 1000,
        searchKey: this.relationOrderContent,
        accepterName: this.repairBillObj.accepterName,
        merchantName: this.repairBillObj.merchantName
      }
      qryIMFastPayTrade(param).then(res => {
        if (res.data.code === 200) {
          this.relationOrderList = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          })
        }
      })
    },
    relationOrderCancel() {
      this.relationOrderContent = '';
      this.relationOrderId = '';
      this.relationOrderList = [];
      this.relationOrderModal = false;
    },
    relationOrderSure() {
      if (!this.relationOrderId) {
        this.$message({
          type: "error",
          message: "请选择关联的订单"
        })
        return;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      updateIMTandeId({ id: this.repairBillObj.id, tradeId: this.relationOrderId }).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.relationOrderCancel();
          this.qryIMRepairBillDetail(this.repairBillObj.id);
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },


    /**
     * 修改补单操作
     */
    openEditRepairOrder() {
      this.editRepairOrderModal = true;
      this.editRepairOrderId = '';
      this.editRepairOrderContent = '';
      this.editRepairOrderList = [];
      this.queryEditRepairOrder();
    },
    queryEditRepairOrder() {
      let param = {
        pageNo: 1,
        pageSize: 1000,
        searchKey: this.editRepairOrderContent,
        accepterName: this.repairBillObj.accepterName,
        merchantName: this.repairBillObj.merchantName
      }
      qryIMFastPayRepairTrade(param).then(res => {
        if (res.data.code === 200) {
          this.editRepairOrderList = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          })
        }
      })
    },
    editRepairOrderCancel() {
      this.editRepairOrderContent = '';
      this.editRepairOrderId = '';
      this.editRepairOrderList = [];
      this.editRepairOrderModal = false;
    },
    editRepairOrderSure() {
      if (!this.editRepairOrderId) {
        this.$message({
          type: "error",
          message: "请选择补单号"
        })
        return;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      updateIMRepairTrade({ tradeId: this.repairBillObj.tradeId, repairTradeId: this.editRepairOrderId }).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "操作成功"
          })
          this.editRepairOrderCancel();
          this.qryIMRepairBillDetail(this.repairBillObj.id);
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
     * 新增补单操作
     */
    openRepairOrder(flag) {
      this.repairOrderModal = true;
      this.repairOrderFlag = flag;
      if (this.$refs.repairOrderObj) {
        this.$refs.repairOrderObj.resetFields();
      }
      this.getMerchantList();
      this.getAccepterList();

      // 如果是子账号，补单会取商家的名称
      let sponsorName = '';
      if (this.repairBillObj.merchantName && this.repairBillObj.merchantName.includes("@")) {
        let arr = this.repairBillObj.merchantName.split("@")
        sponsorName = arr[1]
      }

      this.repairOrderObj = {
        id: this.repairBillObj.id,//工单的id
        sponsor: sponsorName,// 发起人
        accepter: this.repairBillObj.accepterName,// 承兑人
        fastSubName: this.repairBillObj.subName, // 会员号
        amount: this.convertMoney(this.repairBillObj.amountRmb),// 交易金额
        applyTime: this.repairBillObj.createTime,// 申请时间
      }
      if (this.repairBillObj.accepterName) {
        this.getPayCardInfo(_ => {
          if (this.repairBillObj.payCardId) {
            this.changePayCardInfo(this.repairBillObj.payCardId);
          }
        });
      }
    },
    /**
     * 获得发起人列表
     */
    getMerchantList() {
      getMerchantList({ searchKey: '', pageNo: 1, pageSize: 1000 }).then(res => {
        if (res.data.code == 200) {
          this.repairOrderSponsorList = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          })
        }
      })
    },
    /**
     * 承兑人联想搜索
     */
    getAccepterList() {
      getAccepterList({ searchKey: '', currentPage: 1, pageSize: 1000 }).then(res => {
        if (res.data.code == 200) {
          this.repairOrderAcceptorList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error',
          })
        }
      })
    },
    /**
     * 承兑人联想搜索
     */
    getPayCardInfo(callback) {
      //  请求后台
      getPayCardInfo({ accepterName: this.repairOrderObj.accepter, pageNo: 1, pageSize: 1000 }).then(res => {
        if (res.data.code == 200) {
          if (res.data.code == 200) {
            this.repairOrderPayCardInfoList = res.data.data;
            if (callback) callback();
          } else {
            this.$message({
              message: res.data.message,
              type: 'error',
            })
          }
        }
      })
    },
    /**
     * 手动获取卡的信息
     */
    getPayCardByCardId(id) {
      if (id) {
        let payCardInfoList = this.repairOrderPayCardInfoList;
        if (this.repairOrderPayCardInfoList && this.repairOrderPayCardInfoList.length > 0) {
          for (let i = 0; i < payCardInfoList.length; i++) {
            const group = payCardInfoList[i]
            for (let k = 0; k < group.payCardInfoList.length; k++) {
              const payCardInfo = group.payCardInfoList[k]
              if (payCardInfo.id == id) {
                return payCardInfo;
              }
            }
          }
        }
      }
    },
    /**
     * 选择账号后设置表单的卡号
     */
    changePayCardInfo(val) {
      let payCardInfo = this.getPayCardByCardId(val);
      this.repairOrderObj.payCardId = payCardInfo.id;
      this.repairOrderObj.payCardUq = payCardInfo.cardNo;
      this.repairOrderObj.cardType = payCardInfo.userCardType;
    },
    /**
     * 点击取消
     */
    repairOrderCancel(form) {
      if (this.$refs[form]) {
        this.$refs[form].resetFields();
      }
      this.repairOrderModal = false;
    },
    /**
     * 提交补单
     */
    repairOrderSure(form) {
      this.$refs[form].validate((validate) => {
        if (validate) {
          let params = {
            id: this.repairBillObj.id,//工单的id
            sponsor: this.repairOrderObj.sponsor,// 发起人
            accepter: this.repairOrderObj.accepter,// 承兑人
            payCardId: this.repairOrderObj.payCardId,//卡id
            payCardUq: this.repairOrderObj.payCardUq,//付款账号
            cardType: this.repairOrderObj.cardType,// 卡类型
            fastSubName: this.repairOrderObj.fastSubName, // 会员号
            amount: this.repairOrderObj.amount,// 交易金额
            applyTime: this.repairOrderObj.applyTime,// 申请时间
            tradeApplyUq: this.repairBillObj.tradeId // 需要补单的订单的单号
          };
          if (this.btnLoading) return;
          this.btnLoading = true;
          // 新建普通补单
          if (this.repairOrderFlag == "add") {
            IMRepairOrder(params).then(res => {
              this.btnLoading = false;
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                })
                this.repairOrderCancel('repairOrderObj');
                this.qryIMRepairBillDetail(this.repairBillObj.id);
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                })
              }
            }).catch(() => {
              this.btnLoading = false;
            })
          }
          // 新建关联补单
          if (this.repairOrderFlag == "relation") {
            relationRepairOrder(params).then(res => {
              this.btnLoading = false;
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "操作成功"
                })
                this.repairOrderCancel('repairOrderObj');
                this.qryIMRepairBillDetail(this.repairBillObj.id);
              } else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                })
              }
            }).catch(() => {
              this.btnLoading = false;
            })
          }
        }
      })
    },

    /**
     * 完结工单操作
     */
    openFinishBill() {
      // 完结工单弹框
      this.handleRemark = '';
      this.handleRemarkError = '';
      // 完结工单每次点开会清空之前上传的图片信息
      this.relativeImgUrlList = [];
      this.finishBillModal = true;
    },
    finishBill() {
      if (this.handleRemark == null || this.handleRemark == '') {
        this.handleRemarkError = '请输入处理结果'
        return
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      // 获得图片地址
      let imageShortUrlList = [];
      if (this.relativeImgUrlList && this.relativeImgUrlList.length > 0) {
        this.relativeImgUrlList.forEach((v, i) => {
          imageShortUrlList.push(v.imageShortUrl);
        })
        this.relativeImgUrlList = imageShortUrlList;
      }
      finishBill({ id: this.repairBillObj.id, handleRemark: this.handleRemark, handleImgs: this.relativeImgUrlList.join(",") }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          // 清空完结工单填写的信息，并关闭弹出框
          this.handleRemark = ''
          this.handleRemarkError = ''
          this.relativeImgUrlList = [];
          this.finishBillModal = false;

          // 完结工单之后，将该工单防到已完结里并置顶
          let currentRepair = null;
          let currentRepairIndex = null;
          this.immsgChatMenuList.forEach((v, i) => {
            if (v.id == this.repairBillObj.id) {
              currentRepair = v;
              currentRepairIndex = i;
            }
          })
          currentRepair.status = 2;
          currentRepair.selected = true;
          this.immsgChatMenuList.splice(currentRepairIndex, 1)
          this.immsgChatMenuList.unshift(currentRepair);
          this.qryIMRepairBillDetail(this.repairBillObj.id);
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
    * 重启工单操作
    */
    openRebootBill() {
      this.rebootReason = '';
      this.rebootReasonError = '';
      this.rebootBillModal = true;
    },
    rebootBill() {
      if (this.rebootReason == null || this.rebootReason == '') {
        this.rebootReasonError = '请输入重启工单理由'
        return
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      rebootBill({ id: this.repairBillObj.id, rebootReason: this.rebootReason }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.rebootReason = ''
          this.rebootReasonError = ''
          this.rebootBillModal = false;

          // 重启工单之后，会在处理中的分组下，并且会置顶消息聊天
          this.setChatToListTop(this.repairBillObj.id);
          this.qryIMRepairBillDetail(this.repairBillObj.id);
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
     * 填写跟进工单内容
     */
    traceBill() {
      // 校验工单内容
      if (this.traceBillContent == null || this.traceBillContent == '' || /^\s$/.test(this.traceBillContent)) {
        this.traceBillError = '请输入跟进的内容'
        return
      }
      if (this.btnLoading) return;
      this.btnLoading = true;
      traceBill({ id: this.repairBillObj.id, handleRemark: this.traceBillContent }).then(res => {
        this.btnLoading = false;
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.qryIMRepairBillDetail(this.repairBillObj.id)
          this.traceBillModal = false;
          this.traceBillContent = '';
          this.traceBillError = '';
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      }).catch(() => {
        this.btnLoading = false;
      })
    },

    /**
    * 粘贴图片操作
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
              status: 'finished',
              uid: file.lastModified,
            }
            this.onUploadChange(imageFile)
            break;
          }
        }
      }
    },
    onUploadChange(file) {
      const _this = this
      // 验证文件类型
      const IMGTYPE = ['image/jpeg', 'image/png', 'image/jpg']
      // 验证文件大小
      const MAXSIZE = file.size / 1024 / 1024 < 2;

      if (IMGTYPE.indexOf(file.raw.type) < 0) {
        this.$message({
          message: '请上传(*.jpg/*.png/*.jpeg)格式的图片',
          type: 'error'
        })
        return
      }
      if (!MAXSIZE) {
        this.$message({
          message: '图片大小不能超过2MB!',
          type: 'error'
        })
        return
      }
      // 判断文件最多3个
      if (this.relativeImgUrlList.length > 2) {
        this.$message({
          message: '您已达到（3个）图片上限',
          type: 'error'
        })
        return
      }
      // 读取文件
      var reader = new FileReader()
      reader.readAsDataURL(file.raw)
      // 读取成功，请求后台
      reader.onload = (e) => {
        addImgFile({ imageContent: reader.result, imageType: 'CLOUD_FLASH_PAY' }).then(res => {
          if (res.data.code === 200) {
            this.relativeImgUrlList.push({ imageData: reader.result, imageFullUrl: res.data.data.imageFullUrl, imageShortUrl: res.data.data.imageShortUrl, })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      }
    },
    removeImage(index) {
      this.relativeImgUrlList.splice(index, 1)
    },

    /**
     * 查看单大图
     */
    openLookBigImgModal(url) {
      this.lookBigImgUrl = url;
      this.lookBigImgModal = true;
    },
    /**
     * 通过事件机制，获得点击image图片的src
     */
    openImage(e) {
      let url = e.target.currentSrc;
      if (url) {
        this.openLookBigImgModal(url);
      }
    },
    /**
     * 隐藏聊天窗口
     */
    hideChat() {
      this.$emit("hideChat")
    },
    /**
     * 切换聊天
     */
    switchChat(type) {
      this.currentChat = type;
    },
    /**
    * 转换钱
    */
    convertMoney(num) {
      if (num) {
        return Number(num / 10000).toFixed(2);
      }
    },
  },
  destroyed() { },
}
</script>

<style>
.el-collapse-item__header {
  font-size: 15px;
  padding-left: 10px;
  color: #666666;
}
.el-collapse-item__content {
  padding-bottom: 0px;
}
.el-collapse-item__arrow {
  font-size: 16px;
  font-weight: bold;
}
.el-header {
  padding: 0px;
}
.el-main {
  padding: 0px;
}
#collectOrder1 .is-always-shadow {
  height: 600px;
  overflow-y: scroll;
}
</style>

<style scoped>
.immsg_container {
  height: 100vh;
  overflow: hidden;
  font-size: 14px;
  color: #303133;
}
/* 顶部 */
.immsg_header {
  align-items: center;
  border-bottom: solid 1px #e2e2e2;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  align-items: center;
}
/* 搜索 */
.immsg_header .header_search {
  height: 54px;
  line-height: 54px;
  box-sizing: border-box;
  text-align: center;
  padding: 0 20px;
  border-right: solid 1px #e2e2e2;
}

.immsg_header .header_search input {
  border: solid 1px #ddd;
  border-radius: 20px;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  text-align: center;
  outline: none;
  width: 100%;
  transition: all 0.2s;
}
.immsg_header .header_search input:hover {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
}
/* 聊天标题 */
.immsg_header .header_title {
  float: left;
  width: 230px;
  height: 54px;
  line-height: 54px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}
.immsg_header .header_title .title_text {
  font-size: 15px;
  color: #666;
  padding: 1px;
}
.immsg_header .header_title .title_desc {
  font-size: 13px;
  color: #a5a5a5;
  padding: 1px;
}
.immsg_header .header_title.selected {
  background: #4d5568;
}
.immsg_header .header_title.selected,
.immsg_header .header_title.selected .title_text,
.immsg_header .header_title.selected .title_desc {
  color: #fff;
}
/* 退出按钮 */
.immsg_header .header_exit {
  padding-right: 20px;
  position: absolute;
  right: 0;
}

/* 左侧选工单号 */
.immsg_order {
  height: 90vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.immsg_order .order_box .order_list {
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: solid 1px #eee;
}
.immsg_order .order_box .order_list:first-child {
  border-top: solid 5px #eee;
}
.immsg_order .order_box .order_list:last-child {
  border-bottom: solid 5px #eee;
}
.immsg_order .order_box .order_list.selected {
  background: #f1f9ff;
}

.immsg_order .order_box .order_list:hover {
  background: #f1f9ff;
}

.immsg_order .order_box .order_list .list_content {
  display: flex;
}
.immsg_order .order_box .order_list .list_content.content {
  font-size: 13px;
  color: #303133;
}
.immsg_order .order_box .order_list .list_content.desc {
  font-size: 12px;
  color: #a9a9a9;
}
.immsg_order .order_box .order_list .list_content .cotent_left {
  flex: 1;
}
.immsg_order .order_box .order_list .list_content .content_right {
  width: 30px;
  text-align: right;
}

/* 右侧工单信息 */
.immsg_info {
  height: 90vh;
}
.immsg_info .info_box {
  padding: 20px 10px;
}
.immsg_info .info_box .info_title {
  font-size: 16px;
  margin-top: 10px;
}
.immsg_info .info_box .info_list {
  padding: 6px 0px;
}
.immsg_info .info_box .info_list .list_label {
  font-size: 14px;
  color: #666666;
  padding: 2px 0px;
}
.immsg_info .info_box .info_list .list_content {
  font-size: 13px;
  color: #303133;
  padding: 2px 0px;
}

.immsg_info .text-success {
  font-size: 13px;
  color: #00b389;
  cursor: pointer;
  text-decoration: underline;
}
.immsg_info .text-disabled {
  font-size: 13px;
  color: #999;
  cursor: not-allowed;
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

/* clearfix */
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: ” “;
  clear: both;
  height: 0;
}
</style>
