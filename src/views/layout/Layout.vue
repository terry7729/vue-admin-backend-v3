<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>

    <!-- 会话按钮 -->
    <div class="immsg_btn">
      <el-badge :value="getAllImmsgUnread" :hidden="immsgUnread==0" class="item" type="warning">
        <img src="../../assets/img/immsg_logo.png" @click="toggleChat()" />
      </el-badge>
    </div>
    <!-- 会话消息组件 -->
    <transition name="el-fade-in-linear">
      <!-- 使用v-show将预先登陆im服务器渲染 -->
      <div class="immsg_box" v-show="immsgBoxShow">
        <Immsg ref="immsg" @hideChat="hideChat"></Immsg>
      </div>
    </transition>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters, mapActions } from 'vuex'
import { notify } from '@/utils/index.js'
import { qryNotDistBillForMerchant, qryMyNotReadAcceptBill } from '@/api/repairBill.js'
import Immsg from '@/views/immsg/immsg.vue'
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Immsg
  },
  mixins: [ResizeMixin],
  data() {
    return {
      timer: null,// 轮询的定时器
    }
  },
  computed: {
    ...mapGetters(['accepterBillNum', 'businessBillNum', 'myDealBillNum', "immsgBoxShow", "immsgUnread"]),
    getAllImmsgUnread() {
      if (this.immsgUnread > 99) {
        return "99+";
      } else {
        return this.immsgUnread;
      }
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
        overhidden: this.immsgBoxShow,
      }
    }
  },
  created() {
    // 轮询订单的数量
    this.loopRepairBill()
    this.timer = setInterval(() => {
      // this.loopRepairBill()
    }, 8 * 1000)
  },
  watch: {
    immsgBoxShow(val) {
      this.$refs.immsg.getLastSessionGroupList();
    }
  },
  mounted() {
    // 在工单im打开的情况下，按esc键盘可以隐藏工单im窗口
    document.addEventListener("keyup", event => {
      if (this.immsgBoxShow && event.key == "Escape") {
        this.changeImmsgBoxShow(false);
      }
    })
  },
  methods: {
    ...mapActions(['setAccepterBillNum', 'setBusinessBillNum', 'setMyDealBillNum', "changeImmsgBoxShow", "changeImmsgUnread"]),
    /**
   * 轮询订单的数量
   */
    loopRepairBill() {
      // 查询商家和承兑人未受理工单数量
      qryNotDistBillForMerchant({}).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.setAccepterBillNum(res.data.data.accepterCount)
            this.setBusinessBillNum(res.data.data.merchantCount)
          }
        }
      })
      // 查询我受理的工单数量
      qryMyNotReadAcceptBill({}).then(res => {
        if (res) {
          if (res.data.code === 200) {
            // 判断如果有新的订单，就提示语音
            if (res.data.data > this.myDealBillNum) {
              notify('你有新的工单来啦', 'repairBill');
            }
            this.setMyDealBillNum(res.data.data)
          }
        }
      })
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },

    /**
     * immsg的隐藏和展示以及改变未读数量
     */
    hideChat() {
      this.changeImmsgBoxShow(false);
    },
    toggleChat() {
      this.changeImmsgBoxShow(!this.immsgBoxShow);
    },
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style>
/* im消息会话样式 */
.el-notification {
  background: #222b33;
  border: solid 1px #222b33;
  border-radius: 2px;
  color: #fff;
  font-size: 14px;
  width: auto;
}
.el-notification__content {
  color: #fff;
}
/* 按钮 */
.immsg_btn {
  position: fixed;
  right: 30px;
  bottom: 200px;
  cursor: pointer;
  z-index: 2000;
}
/* 聊天界面全屏展示 */
.immsg_box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1999;
  background: #fff;
  height: 100vh;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.overhidden {
  overflow: hidden;
  height: 100%;
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
