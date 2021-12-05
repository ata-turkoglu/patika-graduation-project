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
                <v-dialog v-model="addColumnDialog" max-width="25%">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue-grey lighten-1"
                      small
                      text
                      class="mt-2"
                      v-on="on"
                    >
                      Add Column
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Add Column</v-card-title>
                    <v-card-text>
                      <v-text-field
                        label="Column Name"
                        outlined
                        v-model="newColumn"
                      ></v-text-field>
                      <v-autocomplete
                        v-model="dataType"
                        :items="dataTypes"
                        outlined
                        label="Select type of datas"
                      ></v-autocomplete>
                      <v-slider
                        label="Select Column Index"
                        step="1"
                        min="1"
                        :max="factoryListHeadersIndexes"
                        thumb-label="always"
                        ticks
                        class="mt-4"
                        v-model="addColumnIndex"
                      ></v-slider>
                    </v-card-text>
                    <v-card-actions justify-end>
                      <v-container>
                        <v-row justify="end">
                          <v-btn
                            color="grey darken-2"
                            small
                            text
                            @click="addColumnDialog = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="blue darken-2"
                            small
                            text
                            @click="addColumn(newColumn, addColumnIndex)"
                          >
                            Add
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog v-model="deleteColumnDialog" max-width="25%">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="blue-grey lighten-1"
                      small
                      text
                      class="mt-2"
                      v-on="on"
                    >
                      Delete Column
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Delete Column</v-card-title>
                    <v-card-text>
                      <v-select
                        label="Select a Column"
                        outlined
                        :items="factoryListHeaders"
                        v-model="delColumn"
                      ></v-select>
                    </v-card-text>
                    <v-card-actions justify-end>
                      <v-container>
                        <v-row justify="end">
                          <v-btn
                            color="grey darken-2"
                            small
                            text
                            @click="deleteColumnDialog = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            color="red darken-2"
                            small
                            text
                            @click="deleteColumn(delColumn)"
                          >
                            Delete
                          </v-btn>
                        </v-row>
                      </v-container>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </v-container>
          </template>
          <!--eslint-disable-next-line-->
          <template v-slot:body.append>
            <v-btn
              dense
              text
              color="blue-grey lighten-1"
              small
              class="my-3"
              @click="addNewRow, (addDialog = true)"
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
    <v-dialog v-if="editDialog" v-model="editDialog" width="75%">
      <v-card>
        <v-container fluid class="py-6 px-6">
          <v-row class="my-2">
            <v-col v-for="(item, index) in factoryListHeaders" :key="index">
              <v-text-field
                :label="item.text"
                filled
                dense
                rounded
                v-model="editingItem[item.value]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align-content="center" justify="center" class="mt-6">
            <v-btn class="mx-2" @click="editDialog = false">Cancel</v-btn>
            <v-btn class="mx-2">Save</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-if="addDialog" v-model="addDialog" width="75%">
      <v-card>
        <v-container fluid class="py-6 px-6">
          <v-row class="my-2">
            <v-col v-for="(item, index) in factoryListHeaders" :key="index">
              <v-text-field
                :label="item.text"
                filled
                dense
                rounded
                v-model="newRow[item.value]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align-content="center" justify="center" class="mt-6">
            <v-btn class="mx-2" @click="addDialog = false">Cancel</v-btn>
            <v-btn class="mx-2" @click="addNewRow">Save</v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
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
      addDialog: false,
      newRow: [],
      editDialog: false,
      editingItem: null,
      deleteDialog: false,
      addColumnDialog: false,
      newColumn: null,
      delColumn: null,
      dataType: null,
      dataTypes: ['Number', 'Boolean', 'Text'],
      addColumnIndex: null,
      deleteColumnDialog: false,
    }
  },
  created() {
    this.setFactories(this.$store.state.datatable.factories)
    console.log('tab headers', this.factoryList.headers)
  },
  computed: {
    factoryListHeaders() {
      return this.factoryList.headers.slice(
        0,
        this.factoryList.headers.length - 1,
      )
    },
    factoryListHeadersIndexes() {
      return this.factoryListHeaders.length
    },
  },
  methods: {
    setFactories(data) {
      this.factoryList.items = data
      console.log('tab data', data)
      let keys = Object.keys(data[0])
      keys.forEach((key) => {
        let obj = new Object({
          text: key.charAt(0).toUpperCase() + key.slice(1),
          value: key,
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
      this.editDialog = true
    },
    deleteItem(item) {
      let conf = confirm('Are You Sure to Delete Row?')
      if (conf) {
        let index = this.factoryList.items.findIndex((el) => el.id == item.id)
        this.factoryList.items.splice(index, 1)
        this.deleteDialog = true
      }
    },
    addColumn(item, index) {
      let itemtext = item.charAt(0).toUpperCase() + item.slice(1)
      item = { text: itemtext, value: item.toLowerCase() }
      this.factoryList.headers.splice(index, 0, item)
      this.addColumnDialog = false
    },
    deleteColumn(item) {
      let index = this.factoryList.headers.findIndex((el) => el.value == item)
      this.factoryList.headers.splice(index, 1)
    },
    addNewRow() {
      console.log(this.newRow)
    },
  },
}
</script>

<style></style>
