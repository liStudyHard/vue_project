<template>
  <div class="canvas-area" ref="canvasArea">
    <canvas class="my-canvas">您的浏览器不支持canvas！</canvas><slot></slot>
    <img v-show="showBg" ref="prizeBg" :src="prizeBg" alt="" class="prize-bg" />
  </div>
</template>
<script>
export default {
  name: 'ScratchCard',
  props: {
    prizeSrc: {
      type: String,
      default: ''
    },
    prizeRange: {
      type: Number,
      default: 0.9
    },
    startTrigger: {
      type: Boolean,
      default: false
    },
    prizeBg: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mousedown: false,
      triggerClear: false,
      showBg: false
    }
  },
  computed: {
    screenSize() {
      return document.documentElement.getBoundingClientRect().width / 750
    }
  },
  mounted() {
    this.drawCard()
  },
  methods: {
    drawCard() {
      let canvas = document.querySelector('.my-canvas')
      let canvasArea = this.$refs.canvasArea
      let prizeBg = this.$refs.prizeBg

      if (!canvas.getContext) return
      canvas.style.position = 'absolute'
      let img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = this.prizeSrc
      img.onload = () => {
        this.cWidth = this.screenSize * img.width
        this.cHeight = this.screenSize * img.height
        canvas.width = this.cWidth
        canvas.height = this.cHeight
        prizeBg.style.width = this.cWidth + 'px'
        prizeBg.style.height = this.cHeight + 'px'
        prizeBg.style.top = this.screenSize * this.top + 'px'
        canvas.style.top = prizeBg.style.top
        this.showBg = true
        this.ctx = canvas.getContext('2d')
        this.offsetX = canvasArea.offsetLeft
        this.offsetY = canvasArea.offsetTop
        // 绘制背景
        this.ctx.beginPath()
        this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // 设置新绘制清除新绘制内容和原内容的重叠区域
        this.ctx.globalCompositeOperation = 'destination-out'
        canvas.addEventListener('touchstart', this.eventDown)
        canvas.addEventListener('touchend', this.eventUp)
        canvas.addEventListener('touchmove', this.eventMove)
        canvas.addEventListener('mousedown', this.eventDown)
        canvas.addEventListener('mouseup', this.eventUp)
        canvas.addEventListener('mousemove', this.eventMove)
      }
    },
    eventDown(e) {
      e.preventDefault()
      this.mousedown = true
    },
    eventUp(e) {
      e.preventDefault()
      this.mousedown = false
    },
    eventMove(e) {
      e.preventDefault()
      if (this.mousedown && this.startTrigger) {
        if (e.changedTouches) {
          e = e.changedTouches[0]
        }
        let lx = e.clientX
        let ly = e.clientY
        let x =
          e.clientX +
            (document.body.Left || document.documentElement.scrollLeft) -
            this.offsetX || 0

        let y =
          e.clientY +
            (document.body.scrollTop || document.documentElement.scrollTop) -
            this.offsetY || 0

        this.ctx.beginPath()
        this.ctx.lineCap = 'round'
        this.ctx.lineWidth = 50
        this.ctx.moveTo(lx, ly)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.clearAll()
      }
    },
    clearAll() {
      let canvasData = this.ctx.getImageData(0, 0, this.cWidth, this.cHeight)
      let area = 0
      let len = canvasData.data.length
      for (var i = 0; i < len; i += 4) {
        if (canvasData.data[i] === 0) {
          area++
        }
      }
      if (area > this.cWidth * this.cHeight * this.prizeRange) {
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight)
        this.triggerClear = true
        this.$emit('scratchPrize')
      }
    },
    againScratch() {
      this.drawCard()
    }
  }
}
</script>
<style scoped lang="scss">
.my-canvas {
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.prize-bg {
  position: absolute;
  left: 50%;
  z-index: 66;
  transform: translateX(-50%) scale(0.98);
}
</style>
