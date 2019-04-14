/**
 * v2.0.0
 * @author liubing
 * @date   2018-09-13
 *
 * shareByWx()       微信中分享
 * shareByAppBtn()   客户端中标题栏按钮分享
 * shareByPageBtn()  客户端中页面按钮分享
 */

/**
 * @param
 * title 分享标题
 * desc 分享描述
 * link 分享链接
 * imgUrl 分享图标
 *
 ********以下参数仅在客户端内使用********
 * shareDialogTitle 客户端面板分享标题
 * shareDialogDescription 客户端面板分享描述
 * showFlag 分享渠道  1111 表示 朋友圈、微信、微博、QQ空间
 * code 默认值sms
 * callBackUrl 分享后回调地址
 *
 */

import Env from '@/assets/js/Env'
import { loadJsAsync } from '@/assets/js/util'
// import Toast from '@/components/toast/index'

export default WechatShare

function WechatShare(opts = {}) {
  this.title = opts.title || ''
  this.desc = opts.desc || ''
  this.link = opts.link || window.location.href
  this.imgUrl = opts.imgUrl || ''
  /** ******客户端分享部分参数*********/
  this.shareController = opts.shareController || 'no'
  this.shareDialogTitle = opts.shareDialogTitle || '分享到'
  this.shareDialogDescription =
    opts.shareDialogDescription || '快分享给你的好友吧'
  this.showFlag = opts.showFlag || '1111'
  /** ******客户端页面按钮分享部分参数*********/
  this.code = opts.code || 'sms'
  this.callBackUrl = opts.callBackUrl || ''
}
// 微信中分享
WechatShare.prototype.shareByWx = function() {
  if (!Env.thirdApp.isWeixin) return

  try {
    // 将微信配置函数导出到全局作用域上
    // 所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用（同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用，目前Android微信客户端不支持pushState的H5新特性，所以使用pushState来实现web app的页面会导致签名失败，此问题会在Android6.2中修复）。
    window.signatureJsonCallback = function(result) {
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.appId, // 必填，公众号的唯一标识
        timestamp: result.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.nonceStr, // 必填，生成签名的随机串
        signature: result.signature, // 必填，签名，见附录1
        jsApiList: [
          'checkJsApi',
          'updateTimelineShareData',
          'updateAppMessageShareData',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareQZone',
          'onMenuShareWeibo'
        ]
        // jsApiList: [
        //   'checkJsApi',
        //   'updateTimelineShareData', 'updateAppMessageShareData',
        //   'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo',
        //   'hideMenuItems', 'showMenuItems',
        //   'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem',
        //   'translateVoice', 'startRecord', 'stopRecord',
        //   'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice',
        //   'uploadVoice', 'downloadVoice', 'chooseImage',
        //   'previewImage', 'uploadImage', 'downloadImage',
        //   'getNetworkType', 'openLocation', 'getLocation',
        //   'hideOptionMenu', 'showOptionMenu', 'closeWindow',
        //   'scanQRCode', 'chooseWXPay', 'openProductSpecificView',
        //   'addCard', 'chooseCard', 'openCard'
        // ]
      })
    }
    // 加载微信JSSDK 1.4.0版本
    loadJsAsync('/static/js/jweixin-1.4.0.js', () => {
      let wx = window.wx

      // 获取微信签名
      // 如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。
      loadJsAsync(
        'http://wcs.taofen8.com/service/getSignatureJson?callback=signatureJsonCallback&url=' +
          window.encodeURIComponent(window.location.href.split('#')[0])
      )

      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      wx.ready(() => {
        // 原有的 wx.onMenuShareTimeline、wx.onMenuShareAppMessage、wx.onMenuShareQQ、wx.onMenuShareQZone 接口，即将废弃。
        // 请尽快使用【微信客户端6.7.2】及【JSSDK 1.4.0】以上版本支持的 wx.updateAppMessageShareData、updateTimelineShareData 接口。
        // 注意：分享链接(link)，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        wx.checkJsApi({
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
          success: res => {
            try {
              var checkResult = res.checkResult

              if (typeof checkResult === 'string') {
                checkResult = JSON.parse(checkResult)
              }
              // 部分安卓机型使用新接口时，拉起分享失败，所以暂时只对ios使用新接口
              if (
                Env.os.isIOS &&
                checkResult.updateAppMessageShareData &&
                wx.updateAppMessageShareData
              ) {
                // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
                wx.updateAppMessageShareData({
                  title: this.title,
                  desc: this.desc,
                  link: this.link,
                  imgUrl: this.imgUrl
                })
                // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
                wx.updateTimelineShareData({
                  title: this.title,
                  link: this.link,
                  imgUrl: this.imgUrl
                })
              } else {
                // 分享给朋友
                wx.onMenuShareAppMessage({
                  title: this.title,
                  desc: this.desc,
                  link: this.link,
                  imgUrl: this.imgUrl,
                  success: function() {},
                  cancel: function() {}
                })
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                  title: this.title,
                  link: this.link,
                  imgUrl: this.imgUrl,
                  success: function() {},
                  cancel: function() {}
                })
                // 分享到QQ好友
                wx.onMenuShareQQ({
                  title: this.title,
                  desc: this.desc,
                  link: this.link,
                  imgUrl: this.imgUrl,
                  success: function() {},
                  cancel: function() {}
                })
                // 分享到QQ空间
                wx.onMenuShareQZone({
                  title: this.title,
                  desc: this.desc,
                  link: this.link,
                  imgUrl: this.imgUrl,
                  success: function() {},
                  cancel: function() {}
                })
              }
            } catch (error) {
              alert('catch::checkJsApi-->' + error)
            }
          }
        })
      })

      // 通过error接口处理失败验证
      wx.error(res => {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert('验证失败-->' + JSON.stringify(res))
      })
    })
  } catch (error) {
    alert('catch::shareByWx-->' + error)
  }
}
// 客户端中标题栏按钮分享
WechatShare.prototype.shareByAppBtn = function() {
  if (!Env.tf8App.isTf8App) return

  let body = document.body
  // let shareNodeList = body.querySelectorAll('.app-share')

  // // 先移除页面上的分享参数
  // each(shareNodeList, (index, node) => {
  //   body.removeChild(node)
  // })

  // 兼容 IOS 10.14 以下版本(客户端会在页面加载完成后，查找页面input参数，然后再调用分享方法)
  if (
    this.shareController === 'yes' &&
    (Env.os.isIOS && Env.tf8App.version < 10.14)
  ) {
    body.insertAdjacentHTML(
      'afterbegin',
      `
      <input type="hidden" class="app-share" id="shareController" value="${
        this.shareController
      }">
      <input type="hidden" class="app-share" id="shareDialogTitle" value="${
        this.shareDialogTitle
      }">
      <input type="hidden" class="app-share" id="shareDialogDescription" value="${
        this.shareDialogDescription
      }">
      <input type="hidden" class="app-share" id="shareTitle" value="${
        this.title
      }">
      <input type="hidden" class="app-share" id="shareDescription" value="${
        this.desc
      }">
      <input type="hidden" class="app-share" id="shareUrl" value="${this.link}">
      <input type="hidden" class="app-share" id="shareImageUrl" value="${
        this.imgUrl
      }">
      <input type="hidden" class="app-share" id="showFlag" value="${
        this.showFlag
      }">
    `
    )
  }

  try {
    // 客户端原生方法
    // IOS 10.14 版本及以上才支持此方法
    // Android 全部版本支持
    window.share.setShareData(
      this.shareController,
      this.shareDialogTitle,
      this.shareDialogDescription,
      this.link,
      this.imgUrl,
      this.desc,
      this.title,
      this.showFlag
    )
  } catch (error) {
    // IOS客户端原生方法(webkit-webview)
    // IOS 10.18 版本及以上才支持此方法--截止20181011尚未上线
    if (window.webkit && window.webkit.messageHandlers) {
      let message = {
        method: 'setShareData',
        shareController: this.shareController,
        shareDialogTitle: this.shareDialogTitle,
        shareDialogDescription: this.shareDialogDescription,
        shareUrl: this.link,
        shareImageUrl: this.imgUrl,
        shareDescription: this.desc,
        shareTitle: this.title,
        showFlag: this.showFlag
      }
      window.webkit.messageHandlers.setShareData.postMessage(message)
    }
  }
}
// 客户端中页面按钮分享
WechatShare.prototype.shareByPageBtn = function() {
  let shareUrl = ''

  if (!Env.tf8App.isTf8App) return

  if (Env.os.isAndroid || Env.tf8App.version >= '10.14') {
    // 安卓不支持taofen8-master://share
    // ios用此方法会有右上角分享和按钮点击分享内容覆盖的 bug（因IOS存储分享内容的字段用的同一个）10.14版本修复了此 bug
    shareUrl =
      'share://taofen8.com?callBackUrl=' +
      encodeURIComponent(this.callBackUrl) +
      '&code=' +
      this.code +
      '&shareDialogTitle=' +
      this.shareDialogTitle +
      '&shareDialogDescription=' +
      this.shareDialogDescription +
      '&shareTitle=' +
      encodeURIComponent(this.title) +
      '&shareDescription=' +
      encodeURIComponent(this.desc) +
      '&shareUrl=' +
      encodeURIComponent(this.link) +
      '&shareImageUrl=' +
      this.imgUrl +
      '&showFlag=' +
      this.showFlag
  } else {
    shareUrl =
      'taofen8-master://share/?id=' +
      '{"callBackUrl":"' +
      encodeURIComponent(this.callBackUrl) +
      '","code":"' +
      this.code +
      '","shareDialogTitle":"' +
      this.shareDialogTitle +
      '","shareDialogDescription":"' +
      this.shareDialogDescription +
      '","shareNewTitle":"' +
      encodeURIComponent(this.title) +
      '","shareDescription":"' +
      encodeURIComponent(this.desc) +
      '","shareUrl":"' +
      encodeURIComponent(this.link) +
      '","shareImageUrl":"' +
      this.imgUrl +
      '","showFlag":"' +
      this.showFlag +
      '"}'
  }

  window.location.href = shareUrl
}
