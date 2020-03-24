import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import notFind from '../views/404.vue'
import { isExitCookie } from '../utils/cookieUtils';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页 | Coder论坛'
    },
    component: Home
  },
  {
    path: '/news',
    name: 'News',
    meta: {
      title: '消息中心 | Coder论坛'
    },
    component: () => import('../views/News.vue')
  },
  {
    path: '/publish',
    name: 'Publish',
    meta: {
      title: '发布问题 | Coder论坛'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Publish.vue')
  },
  {
    path: '/question/:id',
    name: 'Question',
    component: () => import('../views/Question.vue')
  },
  {
    path: '/search',
    name: 'Search',
    meta: {
      title: '搜索 | Coder论坛'
    },
    component: () => import('../views/Search.vue')
  },
  {
    path: '*',
    name: 'NotFind',
    meta: {
      title: '404 | Coder论坛'
    },
    component: notFind
  }
]


const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }


  if (to.name === 'Home' || to.name === 'Question' || to.name === 'Search') {
    next()
  } else {
    if (isExitCookie('token')) {
      next()
    } else {
      next("/")
      alert("请先登录")
    }
  }
})

export default router
