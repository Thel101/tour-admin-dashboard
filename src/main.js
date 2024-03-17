import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()
const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router)
})
createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app')
