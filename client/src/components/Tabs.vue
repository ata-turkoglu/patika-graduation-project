<template>
  <v-card max-width="75%" class="mt-16 mx-auto">
    <v-tabs
      align-with-title
      v-model="tab"
      color="white"
      background-color="blue-grey lighten-1"
      slider-color="white"
    >
      <v-tabs-slider color="white"></v-tabs-slider>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
      <v-tab-item>
        <v-data-table
          :headers="factoryList.headers"
          :items="factoryList.items"
          :items-per-page="itemsPerPage"
          :item-key="factoryList.items.id"
          class="elevation-1"
          loading="false"
          loading-text="Loading... Please wait"
        >
          <!--eslint-disable-next-line-->
          <template v-slot:item.privileged="{ item }">
            <v-simple-checkbox
              v-model="item.privileged"
              disabled
            ></v-simple-checkbox>
          </template>
          <!--eslint-disable-next-line-->
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <!--eslint-disable-next-line-->
          <template v-slot:top>
            <v-container>
              <v-row justify="end">
                <v-btn
                  color="blue-grey lighten-1"
                  small
                  text
                  class="mt-2"
                  @click="$store.state.dialogs.addNewColumnDialogState = true"
                >
                  Add Column
                </v-btn>
                <v-btn
                  color="blue-grey lighten-1"
                  small
                  text
                  class="mt-2"
                  @click="$store.state.dialogs.deleteColumnDialogState = true"
                >
                  Delete Column
                </v-btn>
              </v-row>
            </v-container>
          </template>
          <!--eslint-disable-next-line-->
          <template v-slot:body.append>
            <v-btn
              text
              color="blue-grey lighten-1"
              small
              class="my-3"
              @click="$store.state.dialogs.addNewRowDialogState = true"
            >
              Add New Row
            </v-btn>
          </template>
        </v-data-table>
      </v-tab-item>
      <v-tab-item>
        <v-data-table
          :headers="factoryInfo.headers"
          :items="factoryInfo.items"
          :item-key="factoryInfo.items.id"
          class="elevation-1"
          loading="false"
          loading-text="Loading... Please wait"
        >
          <!--eslint-disable-next-line-->
          <template v-slot:item.discount="{ item }">
            <v-simple-checkbox
              v-model="item.discount"
              disabled
            ></v-simple-checkbox>
          </template>
          <!--eslint-disable-next-line-->
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(factoryInfo)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs>
    <AddNewRowDialog
      v-if="$store.state.dialogs.addNewRowDialogState"
      :headers="factoryListHeaders"
    />
    <EditRowDialog
      v-if="$store.state.dialogs.editRowDialogState"
      :headers="factoryListHeaders"
      :data="editingItem"
    />
    <AddNewColumnDialog
      v-if="$store.state.dialogs.addNewColumnDialogState"
      :maxIndex="factoryListHeadersIndexes"
    />
    <DeleteColumnDialog
      v-if="$store.state.dialogs.deleteColumnDialogState"
      :headers="factoryListHeaders"
    />
  </v-card>
</template>

<script>
import AddNewRowDialog from '../components/dialogs/AddNewRowDialog.vue'
import EditRowDialog from '../components/dialogs/EditRowDialog.vue'
import AddNewColumnDialog from '../components/dialogs/AddNewColumnDialog.vue'
import DeleteColumnDialog from '../components/dialogs/DeleteColumnDialog.vue'
export default {
  components: {
    AddNewRowDialog,
    EditRowDialog,
    AddNewColumnDialog,
    DeleteColumnDialog,
  },
  data() {
    return {
      tab: null,
      itemsPerPage: 5,
      items: ['Factory List', 'Factory Info'],
      factoryList: {
        headers: [],
        items: [],
      },
      factoryInfo: {
        headers: [
          { text: 'Section', value: 'section' },
          { text: 'Range', value: 'range' },
          { text: 'Usage', value: 'usage' },
          { text: 'Fee', value: 'fee' },
          { text: 'Discount', value: 'discount' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        items: [
          {
            id: '11',
            section: 'Agrega',
            range: 'March 14, 2018 - April 15,2018',
            usage: 400000,
            fee: 150000,
            discount: false,
          },
          {
            id: '12',
            section: 'Kuvars',
            range: 'March 14, 2018 - April 15,2018',
            usage: 300000,
            fee: 120000,
            discount: true,
          },
          {
            id: '13',
            section: 'Ağır Mineraller',
            range: 'March 14, 2018 - April 15,2018',
            usage: 200000,
            fee: 100000,
            discount: false,
          },
          {
            id: '14',
            section: 'Hazır Beton',
            range: 'March 14, 2018 - April 15,2018',
            usage: 100000,
            fee: 80000,
            discount: true,
          },
        ],
      },
      editingItem: null,
    }
  },
  watch: {
    '$store.state.datatable.factories': {
      handler(val) {
        this.setFactories(val)
      },
      deep: true,
    },
  },
  created() {
    this.setFactories(this.$store.state.datatable.factories)
  },
  computed: {
    factoryListHeaders() {
      return this.factoryList.headers.slice(
        1,
        this.factoryList.headers.length - 1,
      )
    },
    factoryListHeadersIndexes() {
      return this.factoryListHeaders.length
    },
  },
  methods: {
    setFactories(data) {
      this.factoryList.headers = []
      this.factoryList.items = []
      this.factoryList.items = data.rows
      data.columns.forEach((col) => {
        let obj = new Object({
          text: col.attname.charAt(0).toUpperCase() + col.attname.slice(1),
          value: col.attname,
          type: col.format_type,
        })
        this.factoryList.headers.push(obj)
      })
      this.factoryList.headers.push({
        text: 'Actions',
        value: 'actions',
        sortable: false,
      })
    },
    editItem(item) {
      this.editingItem = this.factoryList.items.find((el) => el.id == item.id)
      this.factoryListHeaders.forEach((el) => {
        if (Object.keys(item).includes(el.value) == false) {
          this.editingItem[el.value] = null
        }
      })
      this.$store.state.dialogs.editRowDialogState = true
    },
    deleteItem(item) {
      let conf = confirm('Are You Sure to Delete Row?')
      if (conf) {
        this.$store.dispatch('datatable/deleteRowFromFactories', item.id)
      }
    },
  },
}
</script>

<style></style>
