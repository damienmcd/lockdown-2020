import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false
Vue.use(VeeValidate)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
