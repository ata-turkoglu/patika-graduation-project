<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.addNewColumnDialogState"
    :width="
      $vuetify.breakpoint.lgAndUp
        ? '25%'
        : $vuetify.breakpoint.smAndDown
        ? '75%'
        : '50%'
    "
    persistent
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
        <v-expand-transition>
          <v-text-field
            v-if="
              newColumn.type == 'Char' || newColumn.type == 'Character Varying'
            "
            label="Length"
            type="number"
            outlined
            v-model="dataLength"
          ></v-text-field>
        </v-expand-transition>
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
              @click="$parent.$parent.dialogs.addNewColumnDialogState = false"
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
  props: ['tableName', 'maxIndex'],
  data() {
    return {
      newColumn: {
        name: null,
        index: null,
        type: null,
      },
      dataTypes: [
        'Boolean',
        'Char',
        'Character Varying',
        'CIDR',
        'Date',
        'Date Range',
        'Int',
        'MACaddr',
        'Numeric',
        'SmallInt',
        'Text',
      ],
      dataLength: null,
    }
  },
  methods: {
    addColumn(column) {
      let item = {}
      if (column.type == 'Char' || column.type == 'Character Varying') {
        item = {
          name: column.name.replaceAll(' ', '_'),
          type: String(column.type).toLowerCase() + `(${this.dataLength})`,
        }
      } else {
        item = {
          name: column.name.replaceAll(' ', '_'),
          type: String(column.type).toLowerCase(),
        }
      }
      this.$store.dispatch('datatable/addNewColumn', {
        tableName: String(this.tableName).toLowerCase(),
        column: item,
      })
      this.$parent.$parent.dialogs.addNewColumnDialogState = false
    },
  },
}
</script>

<style></style>
