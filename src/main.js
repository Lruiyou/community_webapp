import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Button, List, Icon, Menu } from 'ant-design-vue'

Vue.use(Button)
Vue.use(List)
Vue.use(Icon);
Vue.use(Menu)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
