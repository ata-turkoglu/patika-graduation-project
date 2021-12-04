import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /*
    authenticated: null,
    authError: false,
    user: null,
    */
  },
  mutations: {
    /*
    setUser(state, payload) {
      state.user = payload
      setTimeout(() => {
        state.authenticated = true
      }, 1500)
    },
    */
  },
  actions: {
    /*
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
    */
  },
  modules: { user },
})
