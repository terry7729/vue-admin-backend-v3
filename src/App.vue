<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App'
  }
</script> 

<style>
.el-range-editor.el-input__inner{
  padding: 3px 0px;
}
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
  width: 365px;
}
.el-date-editor .el-range-separator {
    padding: 0 3px;
}
/***********表单样式**************/
.form-search {
      margin: 40px 0px 0px 0px;
}
</style>
