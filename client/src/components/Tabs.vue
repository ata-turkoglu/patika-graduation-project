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
          <template v-slot:item.special="{ item }">
            <v-simple-checkbox
              v-model="item.special"
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
            <v-btn class="mx-2">Cancel</v-btn>
            <v-btn class="mx-2">Save</v-btn>
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
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Start', value: 'start' },
          { text: 'Expiration', value: 'expiration' },
          { text: 'Employees', value: 'employees' },
          { text: 'Special', value: 'special' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        items: [
          {
            id: '1',
            name: 'Pomza Export',
            start: '21.12.2021',
            expiration: '21.12.2025',
            employees: 140,
            special: false,
          },
          {
            id: '2',
            name: 'Etiper',
            start: '11.09.2011',
            expiration: '25.12.2021',
            employees: 35,
            special: false,
          },
          {
            id: '3',
            name: 'Eile Pomex',
            start: '01.04.2018',
            expiration: '01.04.2026',
            employees: 53,
            special: false,
          },
          {
            id: '4',
            name: 'Persan',
            start: '18.07.2011',
            expiration: '11.05.2024',
            employees: 46,
            special: false,
          },
          {
            id: '5',
            name: 'Pomex Garnet',
            start: '13.09.2020',
            expiration: '15.11.2028',
            employees: 24,
            special: true,
          },
          {
            id: '6',
            name: 'Eile Pomex',
            start: '01.04.2018',
            expiration: '01.04.2026',
            employees: 53,
            special: false,
          },
          {
            id: '7',
            name: 'Persan',
            start: '18.07.2011',
            expiration: '11.05.2024',
            employees: 46,
            special: false,
          },
          {
            id: '8',
            name: 'Pomex Garnet',
            start: '13.09.2020',
            expiration: '15.11.2028',
            employees: 24,
            special: true,
          },
          {
            id: '9',
            name: 'Eile Pomex',
            start: '01.04.2018',
            expiration: '01.04.2026',
            employees: 53,
            special: false,
          },
          {
            id: '10',
            name: 'Persan',
            start: '18.07.2011',
            expiration: '11.05.2024',
            employees: 46,
            special: false,
          },
          {
            id: '11',
            name: 'Pomex Garnet',
            start: '13.09.2020',
            expiration: '15.11.2028',
            employees: 24,
            special: true,
          },
          {
            id: '12',
            name: 'Eile Pomex',
            start: '01.04.2018',
            expiration: '01.04.2026',
            employees: 53,
            special: false,
          },
          {
            id: '13',
            name: 'Persan',
            start: '18.07.2011',
            expiration: '11.05.2024',
            employees: 46,
            special: false,
          },
          {
            id: '14',
            name: 'Pomex Garnet',
            start: '13.09.2020',
            expiration: '15.11.2028',
            employees: 24,
            special: true,
          },
        ],
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
  },
}
</script>

<style></style>
