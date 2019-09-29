import { loginByUsername, logout } from '@/api/login'
import storagelib from '@/utils/auth'

const user = {
  state: {
    token: storagelib.fetch('token') || '',
    loginParam: storagelib.fetch('loginParam') || {},
    roles: [],
  },

  mutations: {
    TOKEN: (state, token) => {
      state.token = token
      storagelib.save('token', token)
    },
    LOGINPARAM: (state, loginParam) => {
      state.loginParam = loginParam
      storagelib.save('loginParam', loginParam)
    },
    LOGOUT: () => {
      storagelib.del('token')
      storagelib.del('loginParam')
      storagelib.del('roles')
      storagelib.del('chatImmsgUid')
      sessionStorage.clear();
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      storagelib.save('roles', roles)
    }

  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password,userInfo.salt).then(response => {
          if(response){
            if (response.data.code === 200) {
              const saveParam = {
                role: "MANAGER",
                accountname: response.data.data.no,
                username: response.data.data.no,
                password:userInfo.password,
                salt:userInfo.salt
              }
              commit('LOGINPARAM', saveParam)
              commit('TOKEN', response.data.data.token)
              resolve(response)
            } else {
              resolve(response)
            }
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    /**
     * 获取用户信息
     *
     */
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const roles = state.loginParam.role
        commit('SET_ROLES', roles)
        resolve(roles)
      }).catch(error => {
        console.log(error)
      })
    },

    // 登出
    LogOut({ commit, state }, username) {
      // return new Promise((resolve, reject) => {
        logout({ username: username.username }).then(res => {
      //     if (res.data.code === 200) {
      //       commit('LOGOUT')
      //       resolve(res)
      //     } else {
      //       resolve(res)
      //     }
      //   }).catch(error => {
      //     reject(error)
      //   })
      })
      commit('LOGOUT')

    }

  }
}

export default user
