import axios from 'axios'

export default {
  namespaced: true,
  state: {
    factories: null,
  },
  mutations: {
    setFactories(state, data) {
      state.factories = data
    },
  },
  actions: {
    async getFactories({ commit }) {
      await axios
        .get('http://localhost:8088/dashboard/factories')
        .then((res) => {
          console.log('store/datatable/data', res.data)
          commit('setFactories', res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
