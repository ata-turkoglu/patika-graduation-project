<template>
  <v-dialog v-model="$parent.$parent.registerDialog" width="25%" persistent>
    <v-card>
      <v-card-title primary-title> Register </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field
              label="Username"
              v-model="user.username"
              :rules="rules.nameRules"
              required
            ></v-text-field>
          </v-row>
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
              :rules="rules.passwordRules"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              @click:append="showPass = !showPass"
              required
            ></v-text-field>
          </v-row>
          <v-row>
            <v-radio-group id="roleradio" label="Role" row v-model="user.role">
              <v-radio label="Admin" value="admin"></v-radio>
              <v-radio label="Editor" value="editor"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row>
            <v-checkbox label="Remember Me" v-model="remember"></v-checkbox>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-container fluid>
          <v-row v-if="$store.state.user.authError">
            <v-alert type="error" dense outlined width="100%">
              Registration failed
            </v-alert>
          </v-row>
          <v-row v-else justify="end">
            <v-btn text @click="$parent.$parent.registerDialog = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click.prevent="register">
              <v-progress-circular
                v-if="$store.state.user.authenticated == false"
                indeterminate
                :size="20"
                color="primary"
                style="background: transparent"
              ></v-progress-circular>
              <span v-else>Register</span>
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      remember: true,
      showPass: false,
      user: {
        username: null,
        email: null,
        password: null,
        role: null,
      },
      rules: {
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length >= 8 || 'Name must be at least 8 characters',
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          (v) => !!v || 'Invalid password',
          (v) => v.length >= 8 || 'Name must be at least 8 characters',
          (v) =>
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(v) ||
            'At least one capital letter, a number and a special character',
        ],
      },
    }
  },
  created() {
    if (window.localStorage.getItem('user')) {
      this.user = JSON.parse(window.localStorage.getItem('user'))
    }
  },
  watch: {
    '$store.state.user.authenticated': {
      handler(val) {
        if (val) {
          console.log('auth', val)
          this.$parent.$parent.registerDialog = false
        }
      },
    },
    '$store.state.user.authError': {
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.$store.state.user.authError = false
          }, 1500)
        }
      },
    },
  },
  computed: {
    ...mapState({
      authenticated: 'user/authenticated',
      authError: 'user/authError',
    }),
  },
  methods: {
    register() {
      if (this.remember) {
        window.localStorage.setItem('user', JSON.stringify(this.user))
      }
      this.$store.dispatch('user/register', this.user)
    },
  },
}
</script>

<style>
#roleradio > .v-label {
  font-size: 16px !important;
  margin-right: 30px;
}
</style>
