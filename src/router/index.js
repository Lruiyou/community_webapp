import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页 - Coder论坛'
    },
    component: Home
  },
  {
    path: '/publish',
    name: 'Publish',
    meta: {
      title: '发布问题 - Coder论坛'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Publish.vue')
  },
  {
    path: '/question',
    name: 'Question',
    meta: {
      title: '问题详情 - Coder论坛'
    },
    component: () => import('../views/Question.vue')
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
  next()
})

export default router
