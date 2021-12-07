import axios from 'axios'

const setDateFormat = (columns, rowData) => {
  let dates = columns
    .filter((col) => col.format_type == 'date')
    .map((item) => item.attname)
  rowData.forEach((data) => {
    Object.keys(data).forEach((item) => {
      if (dates.includes(item) && data[item] != null) {
        data[item] = data[item].split('T')[0]
      }
    })
  })
}

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
    editRow(state, row) {
      let index = state.factories.rows.findIndex((item) => item.id == row.id)
      state.factories.rows.splice(index, 1, row)
    },
    addNewColumn(state, data) {
      let item = {
        attname: data.name,
        format_type: data.type,
      }
      state.factories.columns.push(item)
    },
    deleteColumn(state, column) {
      let index = state.factories.columns.findIndex(
        (item) => item.attname == column,
      )
      state.factories.columns.splice(index, 1)
    },
  },
  actions: {
    async getFactories({ commit, state }) {
      await axios
        .get('http://localhost:8088/dashboard/factories')
        .then((res) => {
          //store columns' data
          state.columns = res.data.columns
          //timestamp date datas to date
          setDateFormat(state.columns, res.data.rows)
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
          setDateFormat(state.columns, res.data.rows)
          commit('addNewRow', res)
          console.log(res.status + ' new row added successfully')
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
          console.log(res.status + ' row deleted successfully')
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async editRowFromFactories({ commit, state }, row) {
      await axios
        .patch('http://localhost:8088/dashboard/factories/updaterow', row)
        .then((res) => {
          //timestamp date datas to date
          setDateFormat(state.columns, res.data.rows)
          commit('editRow', res.data.rows[0])
          console.log(res.status + ' row updated successfully')
        })
        .catch((err) => {
          console.error(err)
        })
    },

    async addNewColumnToFactories({ commit }, column) {
      await axios
        .post('http://localhost:8088/dashboard/factories/addnewcolumn', column)
        .then((res) => {
          commit('addNewColumn', column)
          console.log(res.status + ' new column added successfully')
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
          commit('deleteColumn', column)
          console.log(res.status + ' column deleted successfully')
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
