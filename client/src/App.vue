<template>
  <v-app id="app">
    <v-app-bar app color="transparent" dark flat align-center hide-on-scroll>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xs"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <router-link v-slot="{ href, navigate }" to="/" custom>
        <v-toolbar-title :href="href" @click="navigate" role="button">
          <h2>Patika</h2>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-container
        class="nav-router"
        v-if="$vuetify.breakpoint.smAndUp && $store.state.user.user"
      >
        <v-row justify="center">
          <v-col sm="6" md="4" lg="3" xl="2" class="p-0 d-flex justify-center">
            <router-link v-slot="{ href, navigate }" to="/dashboard" custom>
              <v-btn :href="href" @click="navigate" text> Dashboard </v-btn>
            </router-link>
          </v-col>
          <v-col sm="6" md="4" lg="3" xl="2" class="p-0 d-flex justify-center">
            <router-link v-slot="{ href, navigate }" to="/" custom>
              <v-btn :href="href" @click="navigate" text> User Settings </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
      <v-spacer></v-spacer>
      <v-menu offset-y left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" :width="$store.state.user.user ? 100 : ''">
            <span v-if="$store.state.user.user" class="mr-6">
              {{ $store.state.user.user.username }}
            </span>
            <v-icon v-else>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn elevation="0" color="white" @click="loginDialog = true">
              <v-icon class="mr-2">mdi-login-variant</v-icon>
              Log In
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn elevation="0" color="white" @click="registerDialog = true">
              <v-icon class="mr-2">mdi-account-plus</v-icon>
              Register
            </v-btn>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-btn elevation="0" color="white" @click="logout">
              <v-icon class="mr-2">mdi-logout-variant</v-icon>
              Log Out
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <span>{{ lang }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn small elevation="0" color="white" @click="lang = 'tr'"
              >TR</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn small elevation="0" color="white" @click="lang = 'eng'"
              >ENG</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <Register v-if="registerDialog" />
    <Login v-if="loginDialog" />
    <v-main>
      <v-navigation-drawer
        v-if="$vuetify.breakpoint.xs"
        v-model="drawer"
        width="50%"
        absolute
        temporary
        color="transparent"
      >
        <v-list nav shaped>
          <v-list-item-group class="mt-6">
            <v-list-item>
              <router-link v-slot="{ href, navigate }" to="/dashboard" custom>
                <span :href="href" @click="navigate" class="router-link-mobile">
                  <h3>Dashboard</h3>
                </span>
              </router-link>
            </v-list-item>
            <v-list-item>
              <router-link v-slot="{ href, navigate }" to="/" custom>
                <span :href="href" @click="navigate" class="router-link-mobile">
                  <h3>User Settings</h3>
                </span>
              </router-link>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view style="z-index: 1" />
    </v-main>
  </v-app>
</template>

<script>
import Register from './components/user/Register.vue'
import Login from './components/user/Login.vue'
export default {
  components: {
    Register,
    Login,
  },
  name: 'App',
  data() {
    return {
      lang: 'tr',
      drawer: false,
      registerDialog: false,
      loginDialog: false,
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/' })
    },
  },
}
</script>
<style>
#app {
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-image: url('assets/bg/bg(3).jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
#app:after {
  content: '';
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
}
::-webkit-scrollbar {
  display: none;
}
#bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 0;
}
img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  filter: brightness(45%);
}
.nav-router {
  width: 40%;
}
.router-link-mobile {
  color: white;
}
.v-list-item--active {
  background-color: grey;
}
</style>
