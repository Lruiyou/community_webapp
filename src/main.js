import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/common.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { timeFormat } from './utils/filter';
import { Button, List, Icon, Menu, Row, Col, Input, Badge, Avatar, Card, Affix, TreeSelect, Divider, Tag, Comment, Form, Pagination, Spin, message, Popconfirm } from 'ant-design-vue'

Vue.use(ElementUI)

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
Vue.use(TreeSelect)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Comment)
Vue.use(Form)
Vue.use(Pagination)
Vue.use(Spin)
Vue.use(message)
Vue.use(Popconfirm)

//时间过滤器
Vue.filter('timeFormat', timeFormat)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
