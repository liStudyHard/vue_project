import Toast from './src/toast.js'

Toast.install = function(Vue, config = {}) {
  if (Toast.install.installed) return

  Vue.$toast = Vue.prototype.$toast = Toast
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  Toast.install(window.Vue)
}

export default Toast
