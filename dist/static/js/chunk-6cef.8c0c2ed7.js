(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6cef"],{Opf9:function(t,e,a){"use strict";var n=a("Wb71");a.n(n).a},Wb71:function(t,e,a){},kdw4:function(t,e,a){"use strict";a.d(e,"k",function(){return u}),a.d(e,"e",function(){return o}),a.d(e,"c",function(){return s}),a.d(e,"f",function(){return l}),a.d(e,"a",function(){return c}),a.d(e,"b",function(){return d}),a.d(e,"d",function(){return m}),a.d(e,"n",function(){return f}),a.d(e,"o",function(){return p}),a.d(e,"m",function(){return g}),a.d(e,"h",function(){return h}),a.d(e,"t",function(){return _}),a.d(e,"s",function(){return b}),a.d(e,"r",function(){return v}),a.d(e,"j",function(){return C}),a.d(e,"g",function(){return A}),a.d(e,"l",function(){return y}),a.d(e,"q",function(){return x}),a.d(e,"p",function(){return S}),a.d(e,"i",function(){return j});var n=a("t3Un"),i=a("Qyje"),r=a.n(i);function u(t){return Object(n.a)({url:"accepter/apply/list",method:"get",params:t})}function o(t){return Object(n.a)({url:"accepter/apply/review",method:"post",data:r.a.stringify(t)})}function s(t){return Object(n.a)({url:"accepter/list",method:"get",params:t})}function l(t){return Object(n.a)({url:"accepter/update",method:"post",data:r.a.stringify(t)})}function c(t){return Object(n.a)({url:"accepter/alterStatus",method:"post",data:r.a.stringify(t)})}function d(t){return Object(n.a)({url:"accepter/delete",method:"post",params:t})}function m(t){return Object(n.a)({url:"accepter/punish",method:"post",data:r.a.stringify(t)})}function f(t){return Object(n.a)({url:"manager/tradeBill/queryTradeBill",method:"get",params:t})}function p(t){return Object(n.a)({url:"manager/autoShareProfit/queryShareBenefit",method:"get",params:t})}function g(t){return Object(n.a)({url:"manager/autoShareProfit/queryBenefitDetail",method:"get",params:t})}function h(t){return Object(n.a)({url:"manager/autoShareProfit/confirmExceptionBenefit",method:"post",data:r.a.stringify(t)})}function _(t){return Object(n.a)({url:"manager/autoShareProfit/updateExceptStatus",method:"post",data:r.a.stringify(t)})}function b(){return Object(n.a)({url:"manager/autoShareProfit/selectUnBenefitYear",method:"get"})}function v(t){return Object(n.a)({url:"manager/autoShareProfit/selectUnBenefitPeriods",method:"get",params:t})}function C(t){return Object(n.a)({url:"manager/autoShareProfit/confirmSelectUnBenefitPeriods",method:"post",data:r.a.stringify(t)})}function A(t){return Object(n.a)({url:"manager/autoShareProfit/confirmBenefitAction",method:"get",params:t})}function y(t){return Object(n.a)({url:"manager/autoShareProfit/queryAccepterBenefitDetail",method:"get",params:t})}function x(){return Object(n.a)({url:"manager/autoShareProfit/selectHistoryBenefitYear",method:"get"})}function S(t){return Object(n.a)({url:"manager/autoShareProfit/selectHistoryBenefitPeriods",method:"get",params:t})}function j(t){return Object(n.a)({url:"manager/autoShareProfit/confirmSelectHistoryBenefitPeriods",method:"post",data:r.a.stringify(t)})}},lxyW:function(t,e,a){"use strict";a.r(e);var n=a("kdw4"),i=a("XJYT"),r={data:function(){return{listQuery:{page:1,limit:10},tableKey:0,list:null,total:null,listLoading:!0,beginDate:"",endDate:"",matchTotalAmount:"",totalChargeAmount:"",inChargeAmount:"",outChargeAmount:"",sellGAcChargeAmount:"",distributeRate:"",distributeAmount:"",exceptAmount:"",benefitPerGAC:""}},created:function(){this.getList()},methods:{getList:function(){var t=this,e={periods:this.$router.history.current.params.id,pageNo:this.listQuery.page,pageSize:this.listQuery.limit};Object(n.i)(e).then(function(e){200===e.data.code?(t.beginDate=e.data.data.main.beginDate,t.endDate=e.data.data.main.endDate,t.matchTotalAmount=Number(e.data.data.main.matchTotalAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.totalChargeAmount=Number(e.data.data.main.totalChargeAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.inChargeAmount=Number(e.data.data.main.inChargeAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.outChargeAmount=Number(e.data.data.main.outChargeAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.sellGAcChargeAmount=Number(e.data.data.main.sellGAcChargeAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.distributeRate=e.data.data.main.distributeRate||0,t.distributeAmount=Number(e.data.data.main.distributeAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.exceptAmount=Number(e.data.data.main.exceptAmount/1e4).toFixed(2)||Number(0).toFixed(2),t.benefitPerGAC=Number(e.data.data.main.benefitPerGAC).toFixed(2)||Number(0).toFixed(2)||Number(0).toFixed(2),t.list=e.data.data.detail.rows,t.total=e.data.data.detail.totalCount,t.listLoading=!1):(t.listLoading=!1,Object(i.Message)({message:e.data.message,type:"error",duration:5e3}))})},handleSizeChange:function(t){this.listQuery.limit=t,this.getList()},handleCurrentChange:function(t){this.listQuery.page=t,this.getList()}}},u=(a("Opf9"),a("KHd+")),o=Object(u.a)(r,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"item1"},[a("div",{staticClass:"item_list"},[a("span",[t._v("时间段：")]),t._v(" "),a("span",[t._v(t._s(t.beginDate)+"   ~   "+t._s(t.endDate))])]),t._v(" "),a("div",{staticClass:"item_list"},[a("span",[t._v("承兑总额：")]),t._v(" "),a("span",[t._v(t._s(t.matchTotalAmount)+" GAC")])])]),t._v(" "),a("div",{staticClass:"item1"},[a("div",{staticClass:"item_list"},[a("span",[t._v("利润总额：")]),t._v(" "),a("span",[t._v(t._s(t.totalChargeAmount)+" GAC")])]),t._v(" "),a("div",{staticClass:"item_list"},[a("span",[t._v("收款手续费利润：")]),t._v(" "),a("span",[t._v(t._s(t.inChargeAmount)+" GAC")])]),t._v(" "),a("div",{staticClass:"item_list"},[a("span",[t._v("转账手续费利润：")]),t._v(" "),a("span",[t._v(t._s(t.outChargeAmount)+" GAC")])]),t._v(" "),a("div",{staticClass:"item_list"},[a("span",[t._v("卖币手续费利润：")]),t._v(" "),a("span",[t._v(t._s(t.sellGAcChargeAmount)+" GAC")])])]),t._v(" "),a("div",{staticClass:"item1"},[a("div",{staticClass:"item_list"},[a("span",[t._v("分润比例：")]),t._v(" "),a("span",[t._v(t._s(t.distributeRate)+"%")])]),t._v(" "),a("div",{staticClass:"item_list"},[a("span",[t._v("应分润金额：")]),t._v(" "),a("span",[t._v(t._s(t.distributeAmount)+" GAC")])]),t._v(" "),a("div",{staticClass:"item_list"},[a("span",[t._v("异常暂扣分润：")]),t._v(" "),a("span",[t._v(t._s(t.exceptAmount)+" GAC")])])]),t._v(" "),a("div",{staticClass:"item1"},[a("div",{staticClass:"item_list"},[a("span",[t._v("应分润金额 / 承兑总额：")]),t._v(" "),a("span",[t._v(t._s(t.benefitPerGAC)+" GAC")])])]),t._v(" "),a("div",{staticClass:"tab-container"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,attrs:{data:t.list,border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{align:"center",label:"时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("parseTime")(e.row.createTime,"{y}-{m}-{d} {h}:{i}:{s}")))])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"承兑人"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.accountName))])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"承兑金额"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(Number(e.row.matchTotalAmount/1e4).toFixed(2))+" GAC")])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"应分润金额（GAC）"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(Number(e.row.distributeAmount/1e4).toFixed(2))+" GAC")])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"实分润金额（GAC）"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(Number(e.row.realDistributeAmount/1e4).toFixed(2))+" GAC")])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",width:"220px;",label:"状态","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("router-link",{staticClass:"link-type",attrs:{to:"/financial/history-fenrun-detail/"+e.row.id}},[a("span",{staticStyle:{color:"#3d99f7"}},[t._v("详情")])])]}}])})],1),t._v(" "),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{background:"","current-page":t.listQuery.page,"page-sizes":[10,20,30,50],"page-size":t.listQuery.limit,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)])},[],!1,null,"65c97e7e",null);o.options.__file="historyFenRun.vue";e.default=o.exports}}]);