/**
 * 工单处理的vuex
 */
export default {
  state: {
    accepterBillNum: 0, // 承兑人未受理工单数量
    businessBillNum: 0, // 商家未受理工单数量
    myDealBillNum: 0// 我受理的工单数量
  },
  mutations: {
    SET_ACCEPTERBILLNUM: (state, accepterBillNum) => {
      state.accepterBillNum = accepterBillNum
    },
    SET_BUSINESSBILLNUM: (state, businessBillNum) => {
      state.businessBillNum = businessBillNum
    },
    SET_MYDEALBILLNUM: (state, myDealBillNum) => {
      state.myDealBillNum = myDealBillNum
    }
  },
  actions: {
    setAccepterBillNum({ commit }, accepterBillNum) {
      commit('SET_ACCEPTERBILLNUM', accepterBillNum)
    },
    setBusinessBillNum({ commit }, businessBillNum) {
      commit('SET_BUSINESSBILLNUM', businessBillNum)
    },
    setMyDealBillNum({ commit }, myDealBillNum) {
      commit('SET_MYDEALBILLNUM', myDealBillNum)
    }
  }
}
