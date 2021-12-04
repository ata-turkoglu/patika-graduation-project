import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
  namespaced: true,
  state: {
    authenticated: null,
    authError: false,
    user: null,
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload
      setTimeout(() => {
        state.authenticated = true
      }, 1500)
    },
    userLogout(state) {
      state.user = null
    },
  },

  actions: {
    async register({ commit, state }, user) {
      state.authenticated = false
      await axios
        .post('http://localhost:8088/user/register', user)
        .then((response) => {
          let token = response.data.token
          window.localStorage.setItem('token', token)
          try {
            let responseToken = jwt.verify(
              token,
              process.env.VUE_APP_SECRET_KEY,
            )
            console.log(responseToken)
            commit('setUser', responseToken.user)
          } catch (error) {
            console.log(error)
          }
        })
        .catch((err) => {
          console.log(err)
          state.authError = true
        })
    },

    async login({ commit, state }, user) {
      state.authenticated = false
      await axios
        .post('http://localhost:8088/user/login', user)
        .then((response) => {
          let token = response.data.token
          window.localStorage.setItem('token', token)
          try {
            let responseToken = jwt.verify(
              token,
              process.env.VUE_APP_SECRET_KEY,
            )
            console.log(responseToken)
            commit('setUser', responseToken.user)
          } catch (error) {
            console.log(error)
          }
        })
        .catch((error) => {
          console.log(error)
          state.authError = true
        })
    },

    logout({ commit }) {
      commit('userLogout')
    },
  },
}
