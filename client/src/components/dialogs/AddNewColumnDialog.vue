<template>
  <v-dialog
    v-model="$store.state.dialogs.addNewColumnDialogState"
    max-width="25%"
  >
    <v-card>
      <v-card-title>Add Column</v-card-title>
      <v-card-text>
        <v-text-field
          label="Column Name"
          outlined
          v-model="newColumn.name"
        ></v-text-field>
        <v-autocomplete
          v-model="newColumn.type"
          :items="dataTypes"
          outlined
          label="Select type of datas"
        ></v-autocomplete>
        <v-slider
          label="Select Column Index"
          step="1"
          min="1"
          :max="maxIndex"
          thumb-label="always"
          ticks
          class="mt-4"
          v-model="newColumn.index"
        ></v-slider>
      </v-card-text>
      <v-card-actions justify-end>
        <v-container>
          <v-row justify="end">
            <v-btn
              color="grey darken-2"
              small
              text
              @click="$store.state.dialogs.addNewColumnDialogState = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-2"
              small
              text
              @click="addColumn(newColumn)"
            >
              Add
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['maxIndex'],
  data() {
    return {
      newColumn: {
        name: null,
        index: null,
        type: null,
      },
      dataTypes: ['Number', 'Boolean', 'Text'],
    }
  },
  methods: {
    addColumn(column) {
      let item = {
        name: column.name.toLowerCase(),
        type: column.type,
      }
      this.$store.dispatch('datatable/addNewColumnToFactories', item)
      this.$store.state.dialogs.addNewColumnDialogState = false
    },
  },
}
</script>

<style></style>
