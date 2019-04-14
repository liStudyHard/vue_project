import axios from 'axios'
import store from '@/store'
import Toast from '@/components/toast/index'
// import router from '@/router/index'
import md5 from 'blueimp-md5'
import qs from 'qs'

require('es6-promise').polyfill()

// axios 配置
axios.defaults.timeout = 120000

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

// add a response interceptor
axios.interceptors.response.use(
  res => {
    store.commit('removeRequest', md5(res.config.url + res.config.data))
    if (res.data.code !== '200') {
      Toast(`${res.data.code}:${res.data.msg}`)
      return Promise.reject(res)
    }
    return res.data
  },
  error => {
    console.log('error-->', error)
    // 不是重复请求错误
    if (!axios.isCancel(error)) {
      Toast(`服务器响应出错:${error}`)
    }

    if (error && error.config) {
      store.commit(
        'removeRequest',
        md5(`${error.config.url}${error.config.data}`)
      )
    }

    return Promise.reject(error)
  }
)

// ajax 封装

function fetch(path, params = {}) {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  console.log(path + '::params--> %c' + JSON.stringify(params), 'color: red;')

  // 拼接公共参数
  const paramStr = qs.stringify(
    Object.assign({}, store.state.commonParams, params)
  )

  // 请求地址+参数进行md5
  const requestKey = md5(`${path}${paramStr}`)

  if (store.state.requestQueue.includes(requestKey)) {
    source.cancel('重复请求')
  }

  store.commit('addRequest', requestKey)

  return axios({
    methods: 'post',
    url: path,
    data: paramStr,
    CancelToken: source.token
  })
}

// function sendLog(url, params) {
//   let paramStr = qs.stringify(
//     Object.assign(
//       {},
//       store.state.commonParams,
//       store.state.logCommonParams,
//       params
//     )
//   )
//   new Image().src = `${url}?${paramStr}`
// }

export default {
  queryInitData(params) {
    return fetch('myprojcet/index', params)
  },
  appeal: {
    orderRecord(params) {
      return fetch('master/appeal/orderRecord', params)
    },
    uploadImg(params) {
      return fetch('master/appeal/uploadImg', params)
    },
    manualAudit(params) {
      return fetch('master/appeal/manualAudit', params)
    }
  }
}
