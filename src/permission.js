import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  // storagelib.del("token");
  NProgress.start() // start progress bar
  if (store.getters.token) { // determine if there has token
    /* has token*/
    if (to.path !== '/login') {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => {
          const roles = res
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            next()
          })
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
