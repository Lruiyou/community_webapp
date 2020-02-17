import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/common.css'
import { Button, List, Icon, Menu, Row, Col, Input, Badge, Avatar, Card, Affix } from 'ant-design-vue'

Vue.use(Affix)
Vue.use(Button)
Vue.use(List)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Badge)
Vue.use(Avatar)
Vue.use(Card)

// Vue.filter()

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
