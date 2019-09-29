import { constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        // console.log(roles)
        if (roles.indexOf('CUSTOM_SERVICE') >= 0) {
          const saveRouter = []
          for (let i = 0; i < constantRouterMap.length; i++) {
            if (constantRouterMap[i].permissions === 'customerService') {
              saveRouter.push(constantRouterMap[2])
              saveRouter.push(constantRouterMap[i])
            }
          }
          accessedRouters = saveRouter
        } else if (roles.indexOf('SUPER_ADMIN') >= 0 || roles.indexOf('MANAGER') >= 0) {
          const saveRouter = []
          const saveDashbord = []
          for (let i = 0; i < constantRouterMap.length; i++) {
            if (constantRouterMap[i].permissions === 'Manager') {
              saveRouter.push(constantRouterMap[i])
            }
          }
          saveDashbord.push(constantRouterMap[2])
          const saverouter = saveDashbord.concat(saveRouter)
          accessedRouters = saverouter
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}
export default permission
