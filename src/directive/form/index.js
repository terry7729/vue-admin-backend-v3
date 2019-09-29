import Vue from 'vue'
export default{
  /**
   * @description 禁止输入空格
   * @update
   */
  formTrim: {
    update: function (el, binding, vnode) {
      let reg = /\s+/g
      //  等待state更新
      Vue.nextTick(() => {
        el.querySelector('input').value = el.querySelector('input').value.replace(reg, '')
      })
    }
  },
  /**
   * @description 限制非数字输入自定义指令
   * @update
   */
  formNumber: {
    update: function (el, binding, vnode) {
      let reg = /[^0-9.]/g
      //  等待state更新
      Vue.nextTick(() => {
        el.querySelector('input').value = el.querySelector('input').value.replace(reg, '')
      })
    }
  }
}
