<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="right-menu">
        <!--<lang-select class="international right-menu-item"></lang-select>-->

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="imgsrc">
            <span style="font-size:18px;">{{username}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="handleUpdatePwd" style="display:block;">{{$t('navbar.updatePwd')}}</span>
              </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <div>
       <updatepwd ref="showDialog"></updatepwd>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { closeWebsocket } from '@/utils/webSocket'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import Updatepwd from '@/components/Updatepwd'
import storagelib from '@/utils/auth'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect,
    Updatepwd
  },
  data() {
    return {
      username: storagelib.fetch('loginParam').accountname,
      imgsrc: require('./assets/icon.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut', { username: this.username }).then((res) => {
        // closeWebsocket()
        location.reload()
      })
    },
    handleUpdatePwd() {
      // console.log('test')
      this.$refs.showDialog.handleShowDialog()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 0px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.navbar .right-menu{
  margin-right: 80px;
}
.navbar .right-menu .avatar-container .avatar-wrapper .user-avatar{
    width: 32px;
    height: 32px;
    vertical-align: middle;
    border-radius: 10px;
}
.navbar .right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom{
    position: absolute;
    right: -15px;
    top: 20px;
    font-size: 12px;
}
</style>
