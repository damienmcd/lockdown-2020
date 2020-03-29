import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VeeValidate from 'vee-validate'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    libraries: 'places'
  }
})
Vue.use(VeeValidate)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
