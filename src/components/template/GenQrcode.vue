<template>
  <div class="tlj-qrcode">
    <div class="qrcode-wrap">
      <img class="qrcode" :src="picUrl" />
      <div class="qrcode-tips flex-middle flex-center fs17">
        <p>长按图片保存到手机</p>
        <p>分享让好友帮你助力</p>
      </div>
    </div>
    <img
      @click="handleClose"
      class="close"
      src="https://y.taofen8.com/1bed7931bb7b4dba9c17ac155f72beb6.jpg"
    />
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'GenQrcode',
  data() {
    return {
      picUrl: ''
    }
  },
  props: {
    phoneNo: {
      type: String,
      required: true
    }
  },
  methods: {
    createQrcode() {
      let { href } = this.$router.resolve({
        name: 'tljInternalIndex',
        query: {
          curPage: 'h',
          shareTel: this.phoneNo
        }
      })

      href = window.location.protocol + '//' + window.location.host + href

      QRCode.toCanvas(
        href,
        {
          width: 142,
          margin: 2
        },
        (err, canvas) => {
          if (err) {
            this.$toast('二维码生成失败::' + err)
          } else {
            this.drawQrcode(canvas)
          }
        }
      )
    },
    drawQrcode(qrcodeCanvas) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var img = new Image()

      img.src = '/static/img/tpwd_bg.png'

      // img.crossOrigin = 'anonymous'

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)
        ctx.drawImage(qrcodeCanvas, 246, 528, 230, 230)
        this.picUrl = canvas.toDataURL()
      }
    },
    handleClose() {
      this.$emit('close')
    }
  },
  created() {
    this.createQrcode()
  }
}
</script>

<style lang="scss">
.tlj-qrcode {
  z-index: 1002;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .qrcode-wrap {
    width: 500px;
    height: 740px;
    padding: 24px 26px 0;
    margin: 100px auto 40px;
    background-color: #ff2f44;
    .qrcode {
      width: 448px;
      height: 560px;
    }
    .qrcode-tips {
      height: 156px;
      color: #fff;
    }
  }
  .close {
    width: 48px;
    height: 48px;
    margin: 0 auto;
  }
}
</style>
