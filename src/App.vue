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
