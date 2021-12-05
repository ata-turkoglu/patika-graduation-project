<template>
  <v-dialog v-model="$store.state.dialogs.addNewRowDialogState" width="75%">
    <v-card>
      <v-card-title> Add New Row </v-card-title>
      <v-container fluid class="py-6 px-6">
        <v-row class="my-2">
          <v-col v-for="(item, index) in headers" :key="index">
            <v-text-field
              v-if="item.type == 'date'"
              :label="item.text"
              outlined
              type="date"
              v-model="newRow[item.value]"
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
                  v-model="newRow[item.value]"
                ></v-simple-checkbox>
              </template>
            </v-text-field>
            <v-text-field
              v-else
              :label="item.text"
              outlined
              ripple="false"
              v-model="newRow[item.value]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align-content="center" justify="center" class="mt-6">
          <v-btn
            class="mx-2"
            @click="$store.state.dialogs.addNewRowDialogState = false"
            >Cancel</v-btn
          >
          <v-btn class="mx-2" @click="addNewRow">Save</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['headers'],
  data() {
    return {
      newRow: [],
    }
  },
  methods: {
    addNewRow() {
      console.log(this.newRow)
    },
  },
}
</script>

<style></style>
