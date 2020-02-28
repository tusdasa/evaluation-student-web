import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    role: '',
    id: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { studentId, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ studentId: studentId.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.data)
        setToken(response.data)
        resolve()
        // const { data } = response
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    /**
     * {"code":200,"message":"success","requestId":"3e989343d7654d0badfb2e258284a43c","data":{"id":"1810212128","name":"学生一","role":1}}
     */
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, role, id } = data

        // eslint-disable-next-line no-unused-vars
        let role_name

        switch (role) {
          case 1:
            role_name = 'student'
            break
          case 2:
            role_name = 'teacher'
            break
          case 3:
            role_name = 'supervisor'
            break
          case 4:
            role_name = 'main'
            break
          default:
            role_name = 'other'
            break
        }
        commit('SET_ID', id)
        commit('SET_NAME', name)
        commit('SET_ROLE', role_name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    /**
     * removeToken() // must remove  token  first
     * resetRouter()
     * commit('RESET_STATE')
     * resolve()
     */
    return new Promise((resolve, reject) => {
      logout(state.token).then(response => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

