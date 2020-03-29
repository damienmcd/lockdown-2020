<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
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
      <GoogleMap/>

      <v-flex xs12>
        <v-layout wrap>
          <v-flex xs12 align-center justify-center class="location-lookup pa-3">
            Created by &copy;<a href="https://www.linkedin.com/in/damienmcdonnelldev/" target="_blank">Damien McDonnell</a>.
          </v-flex>
        </v-layout>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
// import googleMapsLoader from './plugins/googleMaps'
import GoogleMap from './components/GoogleMap'

export default {
  name: 'App',

  components: {
    GoogleMap,
  },

  data: () => ({
    //
  })
}
</script>
