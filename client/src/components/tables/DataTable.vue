<template>
  <v-card max-width="75%" class="mt-16 mx-auto">
    <v-card-title class="title-bg">{{ tableName }}</v-card-title>
    <!--eslint-disable    -->
    <v-data-table
      :headers="tableData.columns"
      :items="tableData.rows"
      :item-key="tableData.rows.id"
      :items-per-page="itemsPerPage"
      loading="false"
      mobile-breakpoint="960"
      loading-text="Loading... Please wait"
      class="capitalize"
    >
      <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:item="{ item, index, headers }"
      >
        <tr>
          <td v-for="(col, indx) in headers" :key="indx">
            <v-simple-checkbox
              v-if="headers[indx].type == 'boolean'"
              :value="item[col.value]"
              color="blue-grey lighten-3"
              :ripple="false"
            ></v-simple-checkbox>
            <span v-else-if="headers[indx].type == 'daterange'">
              <v-chip
                v-for="(chip, idx) in item[col.value]"
                :key="idx"
                small
                color="blue-grey lighten-5"
                class="mr-2"
              >
                {{ chip }}
              </v-chip>
            </span>
            <span v-else-if="headers[indx].type == 'date'">
              <v-chip small color="blue-grey lighten-5">
                {{ item[col.value] }}
              </v-chip>
            </span>
            <div v-else-if="headers[indx].value == 'actions'">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="
                  ;(dialogs.deleteRowDialogState = true),
                    (idForDelete = item.id)
                "
              >
                mdi-delete
              </v-icon>
            </div>
            <span v-else>{{ item[col.value] }}</span>
          </td>
        </tr>
      </template>
      <template
        v-if="$vuetify.breakpoint.smAndDown"
        v-slot:item.actions="{ item }"
      >
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon
          small
          @click="
            ;(dialogs.deleteRowDialogState = true), (idForDelete = item.id)
          "
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:top>
        <v-container>
          <v-row justify="end">
            <v-btn
              color="blue-grey lighten-1"
              small
              text
              class="mt-2"
              @click="dialogs.addNewColumnDialogState = true"
            >
              Add Column
            </v-btn>
            <v-btn
              color="blue-grey lighten-1"
              small
              text
              class="mt-2"
              @click="dialogs.deleteColumnDialogState = true"
            >
              Delete Column
            </v-btn>
          </v-row>
        </v-container>
      </template>
      <template v-slot:footer.prepend>
        <v-btn
          text
          color="blue-grey lighten-1"
          small
          class="my-4"
          @click="dialogs.addNewRowDialogState = true"
        >
          Add New Row
        </v-btn>
      </template>
    </v-data-table>
    <AddNewRowDialog
      v-if="dialogs.addNewRowDialogState"
      :tableName="tableName"
      :headers="tableDataColumns"
    />
    <EditRowDialog
      v-if="dialogs.editRowDialogState"
      :tableName="tableName"
      :headers="tableDataColumns"
      :data="edittingRow"
    />
    <DeleteRowDialog
      v-if="dialogs.deleteRowDialogState"
      :tableName="tableName"
      :id="idForDelete"
    />
    <AddNewColumnDialog
      v-if="dialogs.addNewColumnDialogState"
      :tableName="tableName"
      :maxIndex="tableDataColumnsIndexes"
    />
    <DeleteColumnDialog
      :key="`delete-${tableName}`"
      v-if="dialogs.deleteColumnDialogState"
      :tableName="tableName"
      :headers="tableDataColumns"
    />
  </v-card>
</template>

<script>
import AddNewRowDialog from '../dialogs/AddNewRowDialog.vue'
import EditRowDialog from '../dialogs/EditRowDialog.vue'
import DeleteRowDialog from '../dialogs/DeleteRowDialog.vue'
import AddNewColumnDialog from '../dialogs/AddNewColumnDialog.vue'
import DeleteColumnDialog from '../dialogs/DeleteColumnDialog.vue'
export default {
  props: ['tableName', 'data'],
  components: {
    AddNewRowDialog,
    EditRowDialog,
    DeleteRowDialog,
    AddNewColumnDialog,
    DeleteColumnDialog,
  },
  data() {
    return {
      itemsPerPage: 5,
      tableData: {
        columns: [],
        rows: [],
      },
      tablekey: 1,
      dialogs: {
        addNewRowDialogState: false,
        editRowDialogState: false,
        deleteRowDialogState: false,
        addNewColumnDialogState: false,
        deleteColumnDialogState: false,
      },
      edittingRow: null,
      idForDelete: null,
    }
  },
  created() {
    this.setTableData(this.data)
  },
  watch: {
    stateData: {
      deep: true,
      handler(val) {
        if (val != null) {
          this.setTableData(val)
        }
      },
    },
  },
  computed: {
    stateData() {
      return this.$store.state.datatable[this.tableName.toLowerCase()]
    },
    tableDataColumns() {
      return this.tableData.columns.slice(1, this.tableData.columns.length - 1)
    },
    tableDataColumnsIndexes() {
      return this.tableDataColumns.length
    },
  },
  methods: {
    setTableData(data) {
      this.tableData.columns = []
      this.tableData.rows = []
      this.tableData.rows = data.rows
      data.columns.forEach((col) => {
        let obj = new Object({
          //text: col.attname.charAt(0).toUpperCase() + col.attname.slice(1),
          text: col.attname.replaceAll('_', ' '),
          value: col.attname,
          type: col.format_type,
        })
        this.tableData.columns.push(obj)
      })
      this.tableData.columns.push({
        text: 'Actions',
        value: 'actions',
        sortable: false,
      })
      this.tablekey++
    },
    editItem(item) {
      this.edittingRow = this.tableData.rows.find((el) => el.id == item.id)
      this.tableDataColumns.forEach((el) => {
        if (Object.keys(item).includes(el.value) == false) {
          this.edittingRow[el.value] = null
        }
      })
      this.dialogs.editRowDialogState = true
    },
  },
}
</script>

<style>
.title-bg {
  background-color: #78909c !important;
  color: white;
}
.capitalize {
  text-transform: capitalize;
}
</style>
