<template>
  <v-dialog v-model="$parent.$parent.loginDialog" width="25%" persistent>
    <v-card>
      <v-card-title primary-title> Login </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field
              label="Email"
              v-model="user.email"
              :rules="rules.emailRules"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              label="Password"
              v-model="user.password"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              @click:append="showPass = !showPass"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-checkbox label="Remember Me" v-model="remember"></v-checkbox>
            {{ authenticated }}
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-container fluid>
          <v-row v-if="$store.state.user.authError">
            <v-alert type="error" dense outlined width="100%">
              Login failed
            </v-alert>
          </v-row>
          <v-row v-else justify="end">
            <v-btn text @click="$parent.$parent.loginDialog = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click.prevent="login">
              <v-progress-circular
                v-if="$store.state.user.authenticated == false"
                indeterminate
                :size="20"
                color="primary"
                style="background: transparent"
              ></v-progress-circular>
              <span v-else>Login</span>
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      remember: true,
      authenticated: null,
      authError: null,
      showPass: false,
      user: {
        email: null,
        password: null,
      },
      rules: {
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
      },
    }
  },
  mounted() {
    if (window.localStorage.getItem('user')) {
      this.user = JSON.parse(window.localStorage.getItem('user'))
    }
  },
  methods: {
    login() {
      if (this.remember) {
        window.localStorage.setItem('user', JSON.stringify(this.user))
      }
      let payload = {
        email: this.user.email,
        password: this.user.password,
      }
      this.$store.dispatch('user/login', payload)
    },
  },
}
</script>

<style></style>
