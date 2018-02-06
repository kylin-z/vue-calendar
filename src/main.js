import Vue from 'vue'
import App from './App.vue'

import Calandar from '../dist/vue-calendar'

Vue.use(Calandar)

new Vue({
  el: '#app',
  render: h => h(App)
})

