<template>
    <div>
        <div  style="padding:5px 15px 15px 15px;">
            <div class="titleName">
                <div class="titleFont"><span class="line" style=""></span>分润设置</div>
            </div>
            <div class="list-menu">
                <span class="list-name">
                    分润比例
                </span>
                <span class="list-name" style="color: rgb(55, 198, 255);cursor: pointer;" @click="updateFenRunClick">
                    修改
                </span>
            </div>
            <div class="list-menu">
                <span class="list-name" style="width: 170px;line-height:40px;">
                    承兑卖出分润比例
                </span>
                <span class="list-name">
                    <div v-if="flag">
                        <span style="display:inline-block">
                            <el-input  v-model="sellfentun" clearable></el-input>
                         </span>
                         <span v-show="sellfenrunMsg" style="line-height:40px; color:red; marign-left:10px; font-size:14px; display:inline-block">
                             请输入正确的承兑卖出分润比例
                         </span>
                    </div>
                    <div v-else style="line-height:40px;">
                        {{sellfentun}}
                    </div>
                </span>
            </div>
            <div class="list-menu">
                <span class="list-name" style="width: 170px;line-height:40px;">
                    支付宝收款分润比例
                </span>
                <span class="list-name">
                    <div v-if="flag">
                        <span style="display:inline-block">
                            <el-input  v-model="alipayfenrun" clearable></el-input>
                        </span>
                        <span v-show="alipayfenrunMsg" style="line-height:40px; color:red; marign-left:10px; font-size:14px; display:inline-block">
                             请输入正确的支付宝收款分润比例
                         </span>
                    </div>
                    <div v-else style="line-height:40px;">
                        {{alipayfenrun}}
                    </div>
                </span>
            </div>
            <div class="list-menu">
                <span class="list-name" style="width: 170px;line-height:40px;">
                    微信收款分润比例
                </span>
                <span class="list-name">
                    <div v-if="flag">
                        <span style="display:inline-block">
                            <el-input  v-model="wechatfenrun" clearable></el-input>
                        </span>
                        <span v-show="wechatfenrunMsg" style="line-height:40px; color:red; marign-left:10px; font-size:14px; display:inline-block">
                             请输入正确的微信收款分润比例
                         </span>
                    </div>
                    <div v-else style="line-height:40px;">
                        {{wechatfenrun}}
                    </div>
                </span>
            </div>
            <div class="list-menu">
                <span class="list-name" style="width: 170px;line-height:40px;">
                    银行卡收款分润比例
                </span>
                <span class="list-name">
                    <div v-if="flag">
                        <span style="display:inline-block">
                            <el-input  v-model="bankfenrun" clearable></el-input>
                        </span>
                        <span v-show="bankfenrunMsg" style="line-height:40px; color:red; marign-left:10px; font-size:14px; display:inline-block">
                             请输入正确的银行卡收款分润比例
                         </span>
                    </div>
                    <div v-else style="line-height:40px;">
                        {{bankfenrun}}
                    </div>
                </span>
            </div>
            <div class="list-menu">
                <span class="list-name" style="width: 170px;line-height:40px;">
                    承兑人间买卖分润比例
                </span>
                <span class="list-name">
                     <div v-if="flag">
                         <span style="display:inline-block">
                            <el-input  v-model="acceptfenrun" clearable></el-input>
                         </span>
                         <span v-show="acceptfenrunMsg" style="line-height:40px; color:red; marign-left:10px; font-size:14px; display:inline-block">
                             请输入正确的承兑人间买卖分润比例
                         </span>
                    </div>
                    <div v-else style="line-height:40px;">
                        {{acceptfenrun}}
                    </div>
                </span>
            </div>
            <div style="margin-top:30px; margin-left:200px;">
                <div v-if="flag">
                    <el-button type="primary" style="text-align:right" @click="sureClick">保存</el-button>
                </div>
            </div>
             
        </div>
    </div>
</template>

<script>
import {QueryProfitRate , setProfitRate} from '@/api/acceptor'
import { Message } from 'element-ui'
export default {
    data(){
        return{
            flag:false,
            sellfenrunMsg:false,
            alipayfenrunMsg:false,
            wechatfenrunMsg:false,
            bankfenrunMsg:false,
            acceptfenrunMsg:false,
            sellfentun:'',
            alipayfenrun:'',
            wechatfenrun:'',
            bankfenrun:'',
            acceptfenrun:'',
            saveAcceptSell:'',
            saveAlipay:'',
            saveWechat:'',
            saveBank:'',
            saveAccept:'',
            saveList:[],
            saveAcceptSellID:'',
            saveAlipayID:'',
            saveWechatID:'',
            saveBankID:'',
            saveAcceptID:'',
        }   
    },
    created(){
        this.getList()
    },
    watch:{
        wechatfenrun:function(val){
            let reg=/^0$|^0\.\d{1,3}$/
            if(!reg.test(val)){
                this.wechatfenrunMsg=true
            }else{
                this.wechatfenrunMsg=false
            }
            this.saveWechat='wechat_buy'
        },
        sellfentun:function(val){
            let reg=/^0$|^0\.\d{1,3}$/
            if(!reg.test(val)){
                this.sellfenrunMsg=true
            }else{
                this.sellfenrunMsg=false
            }
            this.saveAcceptSell='accept_sell'
        },
        bankfenrun:function(val){
            let reg=/^0$|^0\.\d{1,3}$/
            if(!reg.test(val)){
                this.bankfenrunMsg=true
            }else{
                this.bankfenrunMsg=false
            }
            this.saveBank='bank_buy'
        },
        alipayfenrun:function(val){
            let reg=/^0$|^0\.\d{1,3}$/
            if(!reg.test(val)){
                this.alipayfenrunMsg=true
            }else{
                this.alipayfenrunMsg=false
            }
            this.saveAlipay='alipay_buy'
        },
        acceptfenrun:function(val){
            let reg=/^0$|^0\.\d{1,3}$/
            if(!reg.test(val)){
                this.acceptfenrunMsg=true
            }else{
                this.acceptfenrunMsg=false
            }
            this.saveAccept='accpt_trade'
        }
    },
    methods:{
        getList(){
            QueryProfitRate().then(res=>{
                this.saveList=res.data.data.list
                res.data.data.list.map(key => {
                    if(key.profit_name==='wechat_buy'){
                        this.wechatfenrun=key.rate
                        this.saveWechatID=key.id
                    }else if(key.profit_name==='accept_sell'){
                        this.sellfentun=key.rate
                        this.saveAcceptSellID=key.id
                    }else if(key.profit_name==='bank_buy'){
                        this.bankfenrun=key.rate
                        this.saveBankID=key.id
                    }else if(key.profit_name==='alipay_buy'){
                        this.alipayfenrun=key.rate
                        this.saveAlipayID=key.id
                    }else if(key.profit_name==='accpt_trade'){
                        this.acceptfenrun=key.rate
                        this.saveAcceptID=key.id
                    }
                })
            })
        },
        updateFenRunClick(){
            this.flag=true
        },
        /**保存 */
        sureClick(){
            let reg1=/^0$|^0\.\d{1,3}$/
            let reg2=/^0$|^0\.\d{1,3}$/
            let reg3=/^0$|^0\.\d{1,3}$/
            let reg4=/^0$|^0\.\d{1,3}$/
            let reg5=/^0$|^0\.\d{1,3}$/
            if(!reg1.test(this.wechatfenrun)){
                this.wechatfenrunMsg=true
                return
            }if(!reg2.test(this.bankfenrun)){
                this.bankfenrunMsg=true
                return
            }if(!reg3.test(this.sellfentun)){
                this.sellfenrunMsg=true
                return
            }if(!reg4.test(this.alipayfenrun)){
                this.alipayfenrunMsg=true
                return
            }if(!reg5.test(this.acceptfenrun)){
                this.acceptfenrunMsg=true
                return
            }
            let param=[]
            if(this.saveAcceptSell !== ''){
                param.push({profit_name:'accept_sell',id:this.saveAcceptSellID,rate:Number(this.sellfentun)})
            }if(this.saveAlipay!==''){
                param.push({profit_name:'alipay_buy',id:this.saveAlipayID,rate:Number(this.alipayfenrun)})
            }if(this.saveWechat!==''){
                param.push({profit_name:'wechat_buy',id:this.saveWechatID,rate:Number(this.wechatfenrun)})
            }if(this.saveBank!==''){
                param.push({profit_name:'bank_buy',id:this.saveBankID,rate:Number(this.bankfenrun)})
            }if(this.saveAccept!==''){
                param.push({profit_name:'accpt_trade',id:this.saveAcceptID,rate:Number(this.acceptfenrun)})
            }
            setProfitRate(param).then(res=>{
                if(res.data.code===200){
                    this.flag=false
                    Message({
                        message: "修改成功",
                        type: 'success',
                        duration: 2 * 1000
                    })
                }else{

                }
            })
        }
    }
}
</script>

<style scoped>
    .border-none.el-input__inner{
        border:none
    }
    .border-block.el-input__inner{
        border: 1px solid #ececec
    }
    .titleName{
        border-bottom: 1px solid rgba(237, 237, 237, 1);
        overflow: hidden;
    }
    .titleFont{
        padding: 20px 20px 10px 20px;
        font-size: 18px;
        color:rgba(51,51,51,1);
        margin-bottom: 10px;
    }
    .line{
        display:inline-block;
        height:20px;
        border-radius:2px; 
        margin-right:10px;
        vertical-align: middle;
    }
    .list-menu{
        clear: both;
        margin-top:30px;
        margin-left: 15px;
        overflow: hidden;
    }
    .list-name{
        float: left;
        margin-right: 10px;
        font-size: 16px;
    }
</style>
