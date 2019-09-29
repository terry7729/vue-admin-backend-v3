<template>
  <div>
    <div class="order_container">
      <!-- 工单基本信息 -->
      <div class="order_header">
        <div class="order_header_list" style="font-weight:bold;">
          <div class="order_detail_list">
            <div class="list_label">订单号：</div>
            <div class="list_content">{{repairBillObj.tradeId || "-"}}</div>
          </div>
          <div class="order_detail_list">
            <div class="list_label">会员账号：</div>
            <div class="list_content">{{repairBillObj.subName || "-"}}</div>
          </div>
          <div class="order_detail_list">
            <div class="list_label">金额：</div>
            <div class="list_content">
              <span v-if="repairBillObj.amountRmb">{{convertMoney(repairBillObj.amountRmb)}}元</span>
              <span v-else>-</span>
            </div>
          </div>
        </div>
        <div class="order_header_list">
          <div class="order_detail_list">
            <div class="list_label">状态：</div>
            <div class="list_content">{{repairBillObj.billStatusDesc}}</div>
          </div>
          <div class="order_detail_list">
            <div class="list_label">发起人：</div>
            <div class="list_content">{{repairBillObj.creator}}</div>
          </div>
          <div class="order_detail_list">
            <div class="list_label">工单受理人：</div>
            <div class="list_content"><span v-if="repairBillObj.receiver">{{repairBillObj.receiver}}</span><span v-else>未分配</span></div>
          </div>
        </div>
        <div class="order_header_list">
          <div class="order_detail_list">
            <div class="list_label">用户名称：</div>
            <div class="list_content">{{repairBillObj.userName || "-"}}</div>
          </div>
          <div class="order_detail_list">
            <div class="list_label">工单号：</div>
            <div class="list_content">{{repairBillObj.repairBillNo || "-"}}</div>
          </div>
          <div class="order_detail_list">
            <div class="list_label">创建时间：
            </div>
            <div class="list_content">{{repairBillObj.createTime}}</div>
          </div>
        </div>
      </div>
      <!-- 工单内容和工单操作 -->
      <div class="order_body">
        <div class="order_body_creator">{{repairBillObj.creator}}创建了工单<span style="color:#999;padding-left:10px;">{{repairBillObj.createTime}}</span></div>
        <div class="order_body_content">{{repairBillObj.content}}</div>
        <div class="order_body_images clearfix" v-if="repairBillObj.absoluteImgUrlList&&repairBillObj.absoluteImgUrlList.length>0">
          <div style="width:47%;float:left;" v-for="item in repairBillObj.absoluteImgUrlList">
            <img style="max-width:100%;" :src="item" @click="openLookBigImgModal(item)" />
          </div>
        </div>
        <div class="order_body_log" v-if="repairBillObj.repairBillLogList">
          <div v-for="(item,index) in repairBillObj.repairBillLogList" :key="index" style="padding:5px 10px;">
            <div v-html="item" @click="openImage($event)"></div>
          </div>
        </div>
        <div class="order_body_operate" v-if="repairBillObj.billStatus != '2'">
          <div style="position:relative;">
            <el-input type="textarea" v-model="traceBillContent" placeholder="请输入跟进内容，点击回车发送" maxlength="100" :rows="5" @input="traceBillError='';" @keydown.native="enterTraceBill($event)"></el-input>
            <div style="font-size:13px;color:#c9ced5;position:absolute;right:15px;bottom:5px;">ctrl↵换行 或者 ⌘↵换行</div>
          </div>
          <div style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;" v-if="traceBillError">{{traceBillError}}</div>
        </div>
        <div class="order_body_btn">
          <el-button style="display:inline-block;" type="primary" @click="traceBill()" v-if="repairBillObj.billStatus != '2'">发送</el-button>
          <el-button style="display:inline-block;" type="primary" @click="openFinishModal()" v-if="repairBillObj.billStatus != '2'">完结工单</el-button>
          <el-button style="display:inline-block;" type="primary" @click="openRebootModal()" v-if="repairBillObj.billStatus == '2'">重启工单</el-button>
        </div>
      </div>
    </div>

    <!-- 完结工单 -->
    <el-dialog title="完结工单" :visible.sync="finishBillModal" width="740px" append-to-body>
      <div>
        <el-input v-model="handleRemark" type="textarea" :rows="6" maxlength="300" placeholder="请输入处理结果" @input="handleRemarkError='';" @paste.native="contentPasteImage($event)"></el-input>
        <div style="color:#b0b3b9;font-size:13px;padding-top:3px;">可在输入框内复制粘贴截图上传，单次最多可上传三张截图</div>
        <div v-if="handleRemarkError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{handleRemarkError}}</div>
        <div class="list_content" style="padding-top:10px;">
          <div class="upload_container">
            <span v-if="handleImgs">
              <span v-for="(item,index) in handleImgs" :key="item.imageShortUrl" class="upload_image_list">
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
        <el-button class="btn_submit" type="default" @click="finishBillModal=false;handleRemarkError='';handleRemark='';handleImgs=[];">取 消</el-button>
        <el-button class="btn_submit" type="primary" @click="finishBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重启工单 -->
    <el-dialog title="重启工单" :visible.sync="rebootBillModal" width="500px" append-to-body>
      <div>
        <el-input v-model="rebootReason" type="textarea" :rows="6" maxlength="300" placeholder="请输入重启工单理由" @input="rebootReasonError='';"></el-input>
        <div v-if="rebootReasonError" style="text-align:left;font-size:12px;color:#f95353;padding-top:5px;">{{rebootReasonError}}</div>
      </div>
      <div slot="footer" style="text-align:center;">
        <el-button class="btn_submit" type="default" @click="rebootBillModal=false;rebootReasonError='';rebootReason='';">取 消</el-button>
        <el-button class="btn_submit" type="primary" @click="rebootBill()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <el-dialog title="查看大图" :visible.sync="lookBigImgModal" width="1080px" append-to-body>
      <div style="text-align:center;">
        <img :src="lookBigImgUrl" style="max-width:100%;" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { qryRepairBillDetail, finishBill, traceBill, rebootBill, addImgFile } from '@/api/repairBill.js'
export default {
  data() {
    return {
      // 查看大图
      lookBigImgModal: false,
      lookBigImgUrl: '',

      // 工单详情对象
      repairBillObj: {},

      // 跟进工单
      traceBillContent: '',
      traceBillError: '',

      // 完结工单
      finishBillModal: false,
      handleRemark: '', // 工单处理结果
      handleRemarkError: '', // 错误提示
      handleImgs: [],//完结工单的图片

      // 重启工单
      rebootBillModal: false,
      rebootReason: '',
      rebootReasonError: '',

      isCtrlOrCommand: false,//ctrl或者command被按
    }
  },
  props: ["detailObj"],
  created() {
    // 获得工单详情
    this.getRepairBillDetail()
  },
  computed: {
  },
  methods: {
    /**
     * 获得工单详情
     */
    getRepairBillDetail() {
      qryRepairBillDetail({ id: this.detailObj.id }).then(res => {
        if (res.data.code === 200) {
          this.repairBillObj = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 回车提交
     */
    enterTraceBill(e) {
      console.log(e);
      // 判断同时按下ctrl+enter,或者command+enter会回车换行
      if (e.ctrlKey && e.key == "Enter") {
        this.traceBillContent += "\n";
      } else if (e.metaKey && e.key == "Enter") {
        this.traceBillContent += "\n";
      }
      else {
        // 否则，只有单独按回车键的时候才会回车提交数据，并组织默认换行事件
        if (e.key == "Enter") {
          e.preventDefault();
          this.traceBill();
          return false;
        }
      }
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
      traceBill({ id: this.repairBillObj.id, handleRemark: this.traceBillContent }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.getRepairBillDetail()
          this.traceBillContent = ''
          this.traceBillError = ''
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 完结工单
     */
    finishBill() {
      if (this.handleRemark == null || this.handleRemark == '') {
        this.handleRemarkError = '请输入处理结果'
        return
      }
      // 获得图片地址
      let handleImgs = [];
      if (this.handleImgs && this.handleImgs.length > 0) {
        this.handleImgs.forEach((v, i) => {
          handleImgs.push(v.imageShortUrl);
        })
        this.handleImgs = handleImgs;
      }

      finishBill({ id: this.repairBillObj.id, handleRemark: this.handleRemark, handleImgs: this.handleImgs.join(",") }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          // 清空完结工单填写的信息，并关闭弹出框
          this.handleRemark = ''
          this.handleRemarkError = ''
          this.handleImgs = [];
          this.finishBillModal = false;
          //  刷新父页面数据，并关闭弹出框
          this.$emit("refreshData");
          this.closeDetailRepairBill();
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 重启工单
     */
    rebootBill() {
      if (this.rebootReason == null || this.rebootReason == '') {
        this.rebootReasonError = '请输入重启工单理由'
        return
      }
      rebootBill({ id: this.repairBillObj.id, rebootReason: this.rebootReason }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.getRepairBillDetail()
          this.rebootReason = ''
          this.rebootReasonError = ''
          this.rebootBillModal = false;
          this.$emit("refreshData")
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
  * 关闭父窗口弹框
  */
    closeDetailRepairBill() {
      this.$emit("closeDetailRepairBill");
    },
    /**
     * 打开完成工单的提示
     */
    openFinishModal() {
      this.handleRemark = '';
      this.handleRemarkError = '';
      this.handleImgs = [];
      this.finishBillModal = true;
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
              status: 'finished',
              uid: file.lastModified,
            }
            console.log(imageFile);
            this.onUploadChange(imageFile)
            break;
          }
        }
      }
    },
    /**
     * 上传图片
     */
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
      if (this.handleImgs.length > 2) {
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
            this.handleImgs.push({ imageData: reader.result, imageFullUrl: res.data.data.imageFullUrl, imageShortUrl: res.data.data.imageShortUrl, })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      }
    },
    /**
     * 图片删除
     */
    removeImage(index) {
      this.handleImgs.splice(index, 1)
    },
    /**
    * 打开重启订单
    */
    openRebootModal() {
      this.rebootBillModal = true;
      this.rebootReason = '';
      this.rebootReasonError = '';
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
        console.log(url);
        this.openLookBigImgModal(url);
      }
    },
    /**
     * 转换钱
     */
    convertMoney(num) {
      return Number(num / 10000).toFixed(2);
    },
  }
}
</script>
<style scoped>
.clearfix::after {
  content: "";
  height: 0;
  overflow: hidden;
  clear: both;
}
.order_container {
  z-index: 9999;
}
/* 工单基本信息 */
.order_container .order_header {
  border-bottom: solid 1px #eee;
}
.order_header .order_header_list {
  display: flex;
}

.order_header .order_header_list .order_detail_list {
  padding-bottom: 20px;
  flex: 1;
  display: flex;
}

.order_header .order_header_list .order_detail_list .list_label {
  font-size: 14px;
  width: 100px;
  text-align: right;
}

.order_header .order_header_list .order_detail_list .list_content {
  color: #606266;
  flex: 1;
}
/* 工单内容 */
.order_body {
}
.order_body .order_body_creator {
  padding: 10px 0px 5px 0px;
}
.order_body .order_body_content {
  padding: 5px 0px;
}
.order_body .order_body_images {
  width: 100%;
  text-align: center;
}
.order_body .order_body_images img {
  margin: 10px;
  float: left;
}
.order_body .order_body_log {
  margin: 5px 0px;
  padding: 3px;
  border-radius: 4px;
  background: #f7f7f8;
}
.order_body .order_body_operate {
  padding: 5px;
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

/* 操作按钮 */
.order_body_btn {
  text-align: right;
}
</style>
