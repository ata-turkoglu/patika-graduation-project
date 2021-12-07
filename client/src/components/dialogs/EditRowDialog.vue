<template>
  <v-dialog v-model="$store.state.dialogs.editRowDialogState" width="75%">
    <v-card>
      <v-container fluid class="py-6 px-6">
        <v-row class="my-2">
          <v-col v-for="(item, index) in headers" :key="index">
            <v-text-field
              v-if="item.type == 'date'"
              :label="item.text"
              outlined
              type="date"
              v-model="row[item.value]"
            ></v-text-field>
            <v-text-field
              v-else-if="item.type == 'boolean'"
              :label="item.text"
              outlined
              readonly
            >
              <!--eslint-disable-next-line-->
              <template v-slot:prepend-inner>
                <v-simple-checkbox
                  v-model="row[item.value]"
                ></v-simple-checkbox>
              </template>
            </v-text-field>
            <v-text-field
              v-else
              :label="item.text"
              outlined
              ripple="false"
              v-model="row[item.value]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align-content="center" justify="center" class="mt-6">
          <v-btn
            class="mx-2"
            text
            @click="$store.state.dialogs.editRowDialogState = false"
            >Cancel</v-btn
          >
          <v-btn class="mx-2" text @click="editRow">Save</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['headers', 'data'],
  data() {
    return {
      row: null,
    }
  },
  created() {
    this.row = this.data
  },
  methods: {
    editRow() {
      this.$store.dispatch('datatable/editRowFromFactories', this.row)
      this.$store.state.dialogs.editRowDialogState = false
    },
  },
}
</script>

<style></style>
