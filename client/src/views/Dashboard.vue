<template>
  <Tabs v-if="$store.state.datatable.factories != null" />
</template>

<script>
import user from '@/store/modules/user.js'
import Tabs from '../components/Tabs.vue'
export default {
  components: { Tabs },
  beforeCreate() {
    if (!user.state.authenticated) {
      this.$router.push({ name: 'Home' })
    }
  },
  created() {
    this.$store.dispatch('datatable/getFactories')
  },
}
</script>

<style></style>
