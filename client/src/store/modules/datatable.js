import axios from 'axios'

export default {
  namespaced: true,
  state: {
    factories: null,
    columns: null,
  },
  mutations: {
    setFactories(state, data) {
      state.factories = data
    },
    deleteRow(state, id) {
      let index = state.factories.rows.findIndex((item) => item.id == id)
      state.factories.rows.splice(index, 1)
    },
    addNewRow(state, row) {
      state.factories.rows.push(row.data.rows[0])
    },
    addNewColumn(data) {
      console.log('column', data)
      /*
      state.factories.columns.splice(data.index, 0, {
        attname: data.item.value,
        format_type: data.item.type,
      })
      */
    },
    deleteColumn() {},
  },
  actions: {
    async getFactories({ commit, state }) {
      await axios
        .get('http://localhost:8088/dashboard/factories')
        .then((res) => {
          state.columns = res.data.columns

          //timestamp date datas to date
          let dates = res.data.columns
            .filter((col) => col.format_type == 'date')
            .map((item) => item.attname)
          res.data.rows.forEach((data) => {
            Object.keys(data).forEach((item) => {
              if (dates.includes(item)) {
                data[item] = data[item].split('T')[0]
              }
            })
          })
          commit('setFactories', res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async addNewRowToFactories({ commit, state }, row) {
      await axios
        .post('http://localhost:8088/dashboard/factories', { ...row })
        .then((res) => {
          //timestamp date datas to date
          let dates = state.columns
            .filter((col) => col.format_type == 'date')
            .map((item) => item.attname)
          res.data.rows.forEach((data) => {
            Object.keys(data).forEach((item) => {
              if (dates.includes(item)) {
                data[item] = data[item].split('T')[0]
              }
            })
          })

          commit('addNewRow', res)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async deleteRowFromFactories({ commit }, id) {
      await axios
        .delete('http://localhost:8088/dashboard/factories', {
          data: { id },
        })
        .then((res) => {
          commit('deleteRow', res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async addNewColumnToFactories({ commit }, column) {
      await axios
        .post('http://localhost:8088/dashboard/factories/addnewcolumn', column)
        .then((res) => {
          commit('addNewColumn', res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async deleteColumnFromFactories({ commit }, column) {
      await axios
        .delete('http://localhost:8088/dashboard/factories/deletecolumn', {
          data: { column },
        })
        .then((res) => {
          console.log('deleteColumnFromFactories', res)
          commit('deleteColumn', res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
