<template>
  <div v-if="!item.hidden&&item.children" class="menu-wrapper">

    <router-link v-if="hasOneShowingChild(item.children) && !onlyOneChild.children&&!item.alwaysShow" :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <svg-icon v-if="onlyOneChild.meta&&onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon"></svg-icon>
        <span style="position:relative;" v-if="onlyOneChild.meta&&onlyOneChild.meta.title" slot="title">{{generateTitle(onlyOneChild.meta.title)}}
        </span>
      </el-menu-item>
    </router-link>

    <el-submenu v-else :index="item.name||item.path">
      <template slot="title">
        <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
        <span v-if="item.meta&&item.meta.title" slot="title">{{generateTitle(item.meta.title)}}</span>
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :item="child" :key="child.path" :base-path="resolvePath(child.path)"></sidebar-item>

        <router-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
            <span v-if="child.meta&&child.meta.title" slot="title">{{generateTitle(child.meta.title)}}
              <!--工单的提示数量，是所有未受理工单+所有我受理的工单数量 -->
              <span class="dot_num" v-if="child.path == 'repair-manage' && getAllRepairBillNum!=0">{{getAllRepairBillNum}}</span>
            </span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null

    }
  },
  computed: {
    ...mapGetters(['accepterBillNum', 'businessBillNum', 'myDealBillNum']),
    // 获得总的未受理工单数量
    getAllRepairBillNum() {
      if ((this.businessBillNum + this.accepterBillNum + this.myDealBillNum) > 99) {
        return '99+'
      } else {
        return this.businessBillNum + this.accepterBillNum + this.myDealBillNum
      }
    }
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(...paths) {
      return path.resolve(this.basePath, ...paths)
    },
    generateTitle
  }
}
</script>
<style scoped>
.dot_num {
  position: absolute;
  top: 25px;
  right: 80px;
  transform: translateY(-50%) translateX(100%);
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
</style>

