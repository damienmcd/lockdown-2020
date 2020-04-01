<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Lockdown Logo"
          class="shrink mr-2"
          contain
          src="/assets/img/icon-lockdown-dark.png"
          transition="scale-transition"
          width="90"
        />
      </div>
    </v-app-bar>

    <v-content>
      <Intro/>
      <GoogleMap/>

      <v-flex xs12 class="footer">
        <v-layout wrap>
          <v-flex xs12 align-center justify-center class="footer-content pa-3">
            Created by <a href="https://www.linkedin.com/in/damienmcdonnelldev/" target="_blank">Damien McDonnell</a>.
          </v-flex>
        </v-layout>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
// import googleMapsLoader from './plugins/googleMaps'
import Intro from './components/Intro'
import GoogleMap from './components/GoogleMap'

export default {
  name: 'App',

  components: {
    Intro,
    GoogleMap
  },

  data: () => ({
    //
  })
}
</script>

<style lang="scss" scoped>
.footer {
  background-color: #212121;
  color: #FEE64F;

  a {
    color: #ffffff;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #FEE64F;
    }
  }
}
</style>
