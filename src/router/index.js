import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition || savedPosition === undefined) {
      // 只处理设置了路由元信息的组件
      from.meta.keepAlive =
        from.meta.keepAlive === undefined ? undefined : false
      to.meta.keepAlive = to.meta.keepAlive === undefined ? undefined : true
    } else {
      from.meta.keepAlive = from.meta.keepAlive === undefined ? undefined : true
      to.meta.keepAlive = to.meta.keepAlive === undefined ? undefined : false
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [
    {
      path: '/appeal/manual_audit',
      name: 'ManualAudit',
      component: () => import('@/pages/appeal/ManualAudit')
    },
    {
      path: '/appeal/order_record',
      name: 'OrderRecord',
      component: () => import('@/pages/appeal/OrderRecord')
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound')
    }
  ]
})

// 全局前置守卫，进行登录拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.hasLogin) {
      next()
    } else {
      next()
    }
  } else {
    // jumpTo(to, from, next)
    next()
  }
})

export default router
