import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/common.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import infiniteScroll from 'vue-infinite-scroll'
import { timeFormat } from './utils/filter';
import { Button, List, Icon, Menu, Row, Col, Input, Badge, Avatar, Card, TreeSelect, Divider, Tag, Comment, Form, Pagination, Spin, Popconfirm, Notification, Affix } from 'ant-design-vue'
import { getCookie } from "./utils/cookieUtils";

Vue.use(infiniteScroll)

Vue.use(ElementUI)

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
Vue.use(Popconfirm)
Vue.use(Notification)
Vue.use(Affix)

//时间过滤器
Vue.filter('timeFormat', timeFormat)

router.beforeEach((to, from, next) => {
  const cookie = getCookie('token');
  if (to.name === 'Home' || to.name === 'Question' || to.name === 'Search') {
    next()
  } else {
    if (cookie) {
      next()
    } else {
      next('/')
      alert('你还未登录，请先登录');
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
