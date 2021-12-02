<template>
  <v-app id="app">
    <v-app-bar app color="transparent" dark flat align-center>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xs"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title role="button"> <h2>Patika</h2> </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-container class="nav-router" v-if="$vuetify.breakpoint.smAndUp">
        <v-row justify="center">
          <v-col sm="6" md="4" lg="2" xl="2" class="p-0 d-flex justify-center">
            <router-link v-slot="{href,navigate}" to="/" custom>
              <v-btn :href="href" @click="navigate" text> Dashboard </v-btn>
            </router-link>
          </v-col>
          <v-col sm="6" md="4" lg="2" xl="2" class="p-0 d-flex justify-center">
            <router-link v-slot="{href,navigate}" to="/" custom>
              <v-btn :href="href" @click="navigate" text> User Settings </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
      <v-spacer></v-spacer>
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
      <v-menu offset-y left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn elevation="0" color="white">
              <v-icon class="mr-2">mdi-login-variant</v-icon>
              Log In
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn elevation="0" color="white">
              <v-icon class="mr-2">mdi-account-plus</v-icon>
              Register
            </v-btn>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-btn elevation="0" color="white">
              <v-icon class="mr-2">mdi-logout-variant</v-icon>
              Log Out
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-navigation-drawer v-if="$vuetify.breakpoint.xs" v-model="drawer" width="50%" absolute temporary color="transparent">
        <v-list nav shaped>
          <v-list-item-group class="mt-6">
            <v-list-item>
              <router-link v-slot="{href,navigate}" to="/" custom>
                <span :href="href" @click="navigate" class="router-link-mobile"> <h3>Dashboard</h3> </span>
              </router-link>
            </v-list-item>
            <v-list-item>
              <router-link v-slot="{href,navigate}" to="/" custom>
                <span :href="href" @click="navigate" class="router-link-mobile"> <h3>User Settings</h3> </span>
              </router-link>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view />
    </v-main>
    <div id="bg">
      <img src="@/assets/bg/bg(3).jpg">
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      lang: "tr",
      drawer:false
    };
  },
};
</script>
<style>

#app {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
::-webkit-scrollbar {
  display: none;
}

#bg{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
img{
  object-fit: cover;
  height: 100%;
  width: 100%;
  filter: brightness(45%);
}
.nav-router {
  width: 40%;
}
.router-link-mobile{
  color: white;
}
.v-list-item--active{
  background-color:grey;
}
</style>
