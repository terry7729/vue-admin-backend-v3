const immsg = {
  state: {
    immsgBoxShow: false, // 聊天窗口是否显示
    immsgUnread: sessionStorage.getItem("immsgAllUnRead") || 0, // 所有未读的消息数量
  },
  mutations: {
    SET_IMMSGBOXSHOW: (state, immsgBoxShow) => {
      state.immsgBoxShow = immsgBoxShow;
    },
    SET_IMMSGUNREAD: (state, immsgUnread) => {
      state.immsgUnread = immsgUnread;
    },
  },
  actions: {
    changeImmsgBoxShow({
      commit
    }, immsgBoxShow) {
      commit('SET_IMMSGBOXSHOW', immsgBoxShow)
    },
    changeImmsgUnread({commit}, immsgUnread) {
      commit('SET_IMMSGUNREAD', immsgUnread)
    },
  }
}
export default immsg
