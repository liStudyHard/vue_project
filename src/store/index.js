import Vue from 'vue'
import Vuex from 'vuex'
import { getUrlParam, isEmpty } from '@/assets/js/util'
import { cookie } from '@/assets/js/cookie'
import api from '@/api/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 公共参数
    commonParams: {
      userIdMixed: cookie('WAP_RequestInfo_UserId') || getUrlParam('userId'),
      cookieMixed: cookie('WAP_RequestInfo_Device') || '',
      productVersionMixed: cookie('WAP_RequestInfo_ProductVersion') || '',
      productMixed: cookie('WAP_RequestInfo_Product') || '',
      platformMixed: cookie('WAP_RequestInfo_Platform') || '',
      versionMixed: cookie('WAP_RequestInfo_Version') || '',
      loginTypeMixed: cookie('WAP_RequestInfo_LoginTyp') || '',
      previewTime: getUrlParam('previewTime') || ''
    },
    // ajax任务队列
    requestQueue: [],
    // 日志埋点公共参数
    logCommonParams: {
      pageType: '',
      pageName: '',
      code: '',
      channel: ''
    },
    // 需要导航的楼层，距离页面顶部的距离
    floorOffsetList: []
  },
  getters: {
    hasLogin: state => {
      return !isEmpty(state.commonParams.userIdMixed)
    }
  },
  mutations: {
    // 往ajax请求队列中增加一个请求
    addRequest(state, url) {
      if (state.requestQueue.indexOf(url) === -1) {
        state.requestQueue.push(url)
      }
    },
    // 从ajax请求队列中移除一个请求
    removeRequest(state, url) {
      var index = state.requestQueue.indexOf(url)
      state.requestQueue.splice(index, 1)
    },
    // 设置日志埋点公共参数
    setLogCommonParams(state, payload) {
      state.logCommonParams = payload
    },
    // 设置公共参数
    setCommonParams(state, payload) {
      state.commonParams = Object.assign({}, state.commonParams, payload)
    },
    // 增加一个楼层距离页面顶部的距离
    addFloorOffset(state, offset) {
      state.floorOffsetList.push(offset)
    }
  },
  actions: {
    // 统计页面pv和uv
    countPvUv(context, payload) {
      context.commit(
        'setLogCommonParams',
        Object.assign(
          {
            pageType: 'mobile',
            channel: getUrlParam('channel'),
            pageName: payload.code
          },
          payload
        )
      )
      // 统计页面pv和uv
      api.ocean.countPvUv()
    }
  }
})
