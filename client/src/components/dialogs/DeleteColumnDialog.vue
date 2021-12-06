<template>
  <v-dialog
    v-model="$store.state.dialogs.deleteColumnDialogState"
    max-width="25%"
  >
    <v-card>
      <v-card-title>Delete Column</v-card-title>
      <v-card-text>
        <v-select
          label="Select a Column"
          outlined
          :items="headers"
          v-model="deletedColumn"
        ></v-select>
      </v-card-text>
      <v-card-actions justify-end>
        <v-container>
          <v-row justify="end">
            <v-btn
              color="grey darken-2"
              small
              text
              @click="$store.state.dialogs.deleteColumnDialogState = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="red darken-2"
              small
              text
              @click="deleteColumn(deletedColumn)"
            >
              Delete
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['headers'],
  data() {
    return {
      deletedColumn: null,
    }
  },
  methods: {
    deleteColumn(column) {
      this.$store.dispatch('datatable/deleteColumnFromFactories', column)
      this.$store.state.dialogs.deleteColumnDialogState = false
    },
  },
}
</script>

<style></style>
