<template>
  <v-dialog
    v-model="$parent.$parent.dialogs.addNewRowDialogState"
    :width="
      $vuetify.breakpoint.lgAndUp
        ? '75%'
        : $vuetify.breakpoint.sm
        ? '50%'
        : '100%'
    "
    persistent
  >
    <v-card>
      <v-card-title> Add Row </v-card-title>
      <v-container fluid class="py-6 px-6">
        <v-row class="my-2 flex-column flex-sm-column flex-md-row">
          <v-col v-for="(item, index) in headers" :key="index">
            <v-text-field
              v-if="item.type == 'date'"
              :label="item.text"
              outlined
              type="date"
              v-model="newRow[item.value]"
            ></v-text-field>
            <v-menu
              v-else-if="item.type == 'daterange'"
              v-model="dateRangeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="dateRangePickerValue"
                  :label="item.text"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  role="button"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateRange"
                no-title
                scrollable
                range
                persistent
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click=";(dateRangeMenu = false), (newRow[item.value] = [])"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="
                    ;(dateRangeMenu = false),
                      correctRange(dateRange, item.value)
                  "
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
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
            text
            @click="$parent.$parent.dialogs.addNewRowDialogState = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" class="mx-2" text @click="addNewRow"
            >Save</v-btn
          >
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['tableName', 'headers'],
  data() {
    return {
      newRow: [],
      dateRangeMenu: false,
      dateRange: null,
      addRowDialogState: true,
    }
  },
  computed: {
    dateRangePickerValue() {
      if (this.dateRange) {
        return this.dateRange.join(' ~ ')
      } else {
        return ''
      }
    },
  },
  methods: {
    addNewRow() {
      this.$store.dispatch('datatable/addNewRow', {
        tableName: String(this.tableName).toLowerCase(),
        row: { ...this.newRow },
      })
      this.$parent.$parent.dialogs.addNewRowDialogState = false
    },
    correctRange(item, value) {
      this.newRow[value] = `[${item[0]},${item[1]})`
    },
  },
}
</script>

<style></style>
