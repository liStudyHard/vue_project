<template>
  <div class="manual-audit fs14">
    <div class="header-img">
      <img
        src="https://y.taofen8.com/ea23d6b1fecb4605bed64c676a27b4cb.jpg"
        alt=""
      />
    </div>
    <div class="track-wrap flex-middle">
      <div class="left-area flex-middle flex-right">
        <b class="red-style">*</b><b>申述类型</b>
      </div>
      <div class="flex-middle track-area" @click="choseType(1)">
        <input :checked="check === 1" type="checkbox" name="appeal-type" />
        <label :class="{ 'red-style': check === 1 }" for="track-chose">
          未追踪到订单
        </label>
      </div>
      <div class="flex-middle" @click="choseType(2)">
        <input :checked="check === 2" type="checkbox" name="appeal-type" />
        <label :class="{ 'red-style': check === 2 }" for="appeal-type">
          返利未到账
        </label>
      </div>
    </div>
    <div class="number-wrap flex-middle">
      <div class="left-area flex-middle flex-right">
        <b class="red-style">*</b><b>订单号</b>
      </div>
      <p class="order-number">{{ orderId }}</p>
    </div>
    <div class="remark-wrap flex-top">
      <div class="left-area flex-middle flex-right"><b>备注</b></div>
      <textarea
        ref="remark"
        rows="3"
        cols="20"
        class="remark-detail"
        placeholder="请描述您的问题"
      />
    </div>
    <div class="flex-middle">
      <div class="left-area flex-middle flex-right"><b>订单截图</b></div>
      <div class="fs12">上传截图可提高过审率</div>
    </div>
    <div class="load-wrap flex-space-between">
      <img
        src="https://y.taofen8.com/048f77bf8fd84876a2666168282af6ec.jpg"
        class="left-load"
      />
      <div class="right-load flex-middle flex-center">
        <img
          v-if="firstImg"
          src="https://y.taofen8.com/50bd75d7b711473d92e8fa6920a49bfe.jpg"
          alt="删除按钮"
          class="del-img"
          @click="delImg(1)"
        />
        <img v-if="firstImg" :src="firstImg" alt="" class="img-src" />
        <div class="load-dec fs10">
          <p>淘宝订单详情页面</p>
          <p>不要滑动页面,截图</p>
        </div>
        <p class="load-btn">+上传图片</p>
        <input
          ref="firstImg"
          type="file"
          accept="image/*"
          class="upload-img"
          @change="uploadChange(1, $event)"
        />
      </div>
    </div>
    <div class="load-wrap flex-space-between">
      <img
        src="https://y.taofen8.com/aecd853453ac4be993bcf1cf9a112f08.jpg"
        class="left-load"
      />
      <div class="right-load flex-middle flex-center">
        <img
          v-if="lastImg"
          src="https://y.taofen8.com/50bd75d7b711473d92e8fa6920a49bfe.jpg"
          alt="删除按钮"
          class="del-img"
          @click="delImg(2)"
        />
        <img v-if="lastImg" :src="lastImg" alt="" class="img-src" />
        <div class="load-dec fs10">
          <p>淘宝订单详情页面</p>
          <p>滑至订单信息版块,截图</p>
        </div>
        <p class="load-btn">+上传图片</p>
        <input
          ref="lastImg"
          type="file"
          accept="image/*"
          class="upload-img"
          @change="uploadChange(2, $event)"
        />
      </div>
    </div>
    <div class="footer-btn fs17" @click="submit">提交审核</div>
    <div class="footer-dec">客服将在3个工作日内进行审核</div>
    <div v-if="loadSuc" class="wait-wrap">
      <!-- 正在加载中 -->
      <img
        class="icon-loading"
        src="https://y.taofen8.com/imgextra/i4/2296013456/TB2SHzabbH9F1JjSZFBXXc9ZFXa_!!2296013456.png"
      />
    </div>
  </div>
</template>
<script>
import api from '@/api/index'
export default {
  name: 'ManualAudit',
  data() {
    return {
      check: 1,
      repeatClick: false,
      showDel: '',
      initText: '',
      appealRemark: '',
      firstImg: '',
      lastImg: '',
      imgUrl: [],
      recordTitle: '申诉记录',
      recordPath: '/appeal/order_record',
      loadSuc: false
    }
  },
  computed: {
    screenWidth() {
      return document.documentElement.getBoundingClientRect().width
    },
    orderId() {
      return this.$route.query.orderId
    }
  },
  created() {
    // this.$store.dispatch('countPvUv', {
    //   code: ' 2019_appeal',
    //   pageName: '2019_appeal_artificial'
    // })
    // document.title = '人工审核'
  },
  mounted() {
    this.currentUrl = `${window.location.protocol}//${window.location.host}`
  },
  methods: {
    uploadChange(index, e) {
      let file = e.target.files[0]
      if (!file) return
      this.loadSuc = true
      let imgWidth = 292
      // let imgHeight = 456
      let dpr = window.devicePixelRatio
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.src = e.target.result
        img.onload = () => {
          let rate = img.height / img.width
          canvas.width = (imgWidth * this.screenWidth * dpr) / 750
          canvas.height = canvas.width * rate
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          let imgSrc = canvas.toDataURL('image/jpeg', 0.8)
          api.appeal.uploadImg({ imgWrap: imgSrc }).then(res => {
            this.loadSuc = false
            if (index === 1) {
              this.firstImg = res.imgUrl
              this.imgUrl[0] = this.firstImg
              this.showDel = 1
            } else {
              this.lastImg = res.imgUrl
              this.imgUrl[1] = this.lastImg
              this.showDel = 2
            }
          })
        }
      }
    },
    choseType(index) {
      if (index === this.check) {
        this.check = index === 1 ? 2 : 1
        return
      }
      this.check = index
    },
    onfocus() {
      this.initText = null
    },
    delImg(index) {
      if (index === 1) {
        this.firstImg = null
        this.$refs.firstImg.value = null
      } else if (index === 2) {
        this.lastImg = null
        this.$refs.lastImg.value = null
      }
      this.imgUrl[index - 1] = ''
      this.showDel = null
    },
    submit() {
      if (
        this.imgUrl.length === 0 ||
        (!this.imgUrl[0] && !this.imgUrl[1] && this.check === 2)
      ) {
        this.$toast('请上传订单截图')
        return
      }
      this.appealType = this.check === 1 ? 'nonetrack' : 'none'
      api.appeal
        .manualAudit({
          appealType: this.appealType,
          orderNumber: this.orderId,
          appealRemark: this.$refs.remark.value,
          orderImgList: this.imgUrl
        })
        .then(res => {
          let url = `${this.currentUrl}${this.recordPath}`
          window.location.href = `https://router.taofen8.com/wl?url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(this.recordTitle)}`
        })
    }
  }
}
</script>
<style scoped lang="scss">
.manual-audit {
  padding-top: 16px;
  padding-bottom: 16px;
  .header-img {
    margin: 0 auto;
    width: 490px;
    height: 112px;
  }
  input[type='checkbox'] {
    margin-right: 5px;
    width: 37px;
    height: 37px;
    background-color: #fff;
    -webkit-appearance: none;
    border: 1px solid #c9c9c9;
    border-radius: 50%;
    background-clip: padding-box;
    outline: none;
    &:checked {
      width: 37px;
      height: 37px;
      border: 0;
      background: url('https://y.taofen8.com/2e63d8d80de84c7099c168fa5cf1e688.jpg')
        no-repeat center;
      background-size: 100%;
    }
  }
  .red-style {
    color: #ff1155;
  }
  .left-area {
    margin-left: 26px;
    margin-right: 16px;
    width: 160px;
  }
  .track-wrap {
    margin: 48px 0 20px;
  }
  .track-area {
    margin-right: 20px;
  }
  .order-number {
    padding: 0 20px;
    width: 450px;
  }
  .remark-wrap {
    margin: 28px 0 20px;
    .remark-detail {
      padding: 12px 16px;
      width: 474px;
      height: 150px;
      color: #999999;
      background: #f5f5f5;
      border-radius: 8px;
      background-clip: padding-box;
      border: 1px solid #dddddd;
      resize: none;
    }
  }
  .load-wrap {
    margin: 18px 64px;
    .left-load,
    .right-load {
      position: relative;
      width: 292px;
      height: 456px;
      .img-src {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        background-clip: padding-box;
      }
      .del-img {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 99;
        width: 160px;
        height: 48px;
      }
    }
    .right-load {
      position: relative;
      border-radius: 8px;
      background-clip: padding-box;
      background: #f5f5f5;
      border: 1px solid #dddddd;
      .upload-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      .load-btn {
        width: 208px;
        height: 64px;
        line-height: 64px;
        text-align: center;
        background: linear-gradient(270deg, #ff1155, #ff0077);
        border-radius: 40px;
        background-clip: padding-box;
        color: #ffffff;
      }
      .load-dec {
        margin-bottom: 16px;
        text-align: center;
        color: #666666;
        letter-spacing: -1px;
      }
    }
  }
  .footer-btn {
    margin: 48px auto 16px;
    width: 622px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    font-weight: 900;
    background: linear-gradient(270deg, #ff1155, #ff0077);
    color: #ffffff;
    border-radius: 40px;
    background-clip: padding-box;
  }
  .footer-dec {
    text-align: center;
  }
  .wait-wrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10000;
    .wait-icon {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 96px;
      height: 96px;
    }
  }
}
.icon-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  transform: rotate(360deg);
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
