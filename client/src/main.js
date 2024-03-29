import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router.js'
import store from './vuex/store.js'


createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
