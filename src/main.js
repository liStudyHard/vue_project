import 'babel-polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload'
import Toast from '@/components/toast/index.js'

if (process.env.NODE_ENV === 'development') {
  require('./mockData/index.js')
}

Vue.use(infiniteScroll)

Vue.use(VueLazyload, {
  loading: '',
  throttleWait: 500
})

Vue.use(Toast)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
