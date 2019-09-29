<template>
  <div class="layout_main">
    <div class="layout_container">
      角色名称：<el-input placeholder="请输入角色名称" style="width:300px;"></el-input>
      <span class="text_error">请输入正确的角色名称（2-10字）</span>
    </div>
    <div class="layout_container">
      <div class="role_title">选择权限</div>
      <div>
        <el-tree class="role_tree" :indent="90" :data="data" show-checkbox default-expand-all node-key="id" :default-checked-keys="[22]" :props="defaultProps">
        </el-tree>
      </div>
    </div>
    <div class="layout_container">
      <el-button type="primary">确 定</el-button>
      <el-button type="default">取 消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [{
        id: 1,
        label: '首页'
      }, {
        id: 2,
        label: '用户管理',
        children: [{
          id: 22,
          label: '用户信息',
          children: [{
            id: 221,
            label: '编辑操作'
          }, {
            id: 222,
            label: '删除操作'
          }]
        }]
      }, {
        id: 3,
        label: '角色管理',
        children: [{
          id: 33,
          label: '用户信息',
          children: [{
            id: 331,
            label: '角色编辑'
          }, {
            id: 332,
            label: '角色删除'
          }, {
            id: 333,
            label: '角色禁用'
          }, {
            id: 334,
            label: '角色启用'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() { },
  methods: {

  },
}
</script>
<style scoped>
.layout_main {
  padding: 20px 30px;
}
.layout_container {
  padding: 10px;
}
.layout_container .text_error {
  color: #f56c6c;
  font-size: 12px;
  padding: 3px 0px;
}
.layout_container .role_title {
  border-bottom: solid 1px #eee;
  padding: 10px 0px;
}
</style>
<style>
/* 权限树的样式修改 */
.el-tree-node__content:hover {
  background: none;
}
.el-tree-node:focus > .el-tree-node__content {
  background: none;
}
</style>
