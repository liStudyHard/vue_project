<template>
  <div :style="{ height: totalHeight + 'px' }">
    <div :style="{ height: totalHeight + 'px' }" class="count-down-today">
      <!-- titleBarToday -->
      <TitleBarToday title="今日必抢" />
      <div
        id="calander"
        :style="{ top: titleBarHeight + 'px' }"
        class="content flex-center flex-middle"
      >
        <span class="hint fs14">距离下次更新还剩</span>
        <!-- 倒计时内容 -->
        <div class="flipClock fs20 flex-left flex-middle">
          <!-- 小时 -->
          <div class="flipUnitContainer">
            <div class="flipUnitContainer">
              <div class="upperCard">
                <span>{{ hoursStr }}</span> <br />
              </div>
              <div class="lowerCard">
                <span>{{ nextHoursStr }}</span>
              </div>
              <div
                :class="hoursActive ? 'fold' : 'unfold'"
                class="flipCard first"
              >
                <span>{{ hoursActive ? nextHoursStr : hoursStr }}</span>
              </div>
              <div
                :class="hoursActive ? 'unfold' : 'fold'"
                class="flipCard second"
              >
                <span>{{ hoursActive ? hoursStr : nextHoursStr }}</span>
              </div>
            </div>
          </div>
          <div class="fs14 word">时</div>
          <!-- 分钟 -->
          <div class="flipUnitContainer">
            <div class="flipUnitContainer">
              <div class="upperCard">
                <span>{{ minutesStr }}</span>
              </div>
              <div class="lowerCard">
                <span>{{ nextMinutesStr }}</span>
              </div>
              <div
                :class="minutesActive ? 'fold' : 'unfold'"
                class="flipCard first"
              >
                <span>{{ minutesActive ? nextMinutesStr : minutesStr }}</span>
              </div>
              <div
                :class="minutesActive ? 'unfold' : 'fold'"
                class="flipCard second"
              >
                <span>{{ minutesActive ? minutesStr : nextMinutesStr }}</span>
              </div>
            </div>
          </div>
          <div class="fs14 word markpro">分</div>
          <!-- 秒 -->
          <div class="flipUnitContainer">
            <div class="flipUnitContainer">
              <div class="upperCard">
                <span>{{ secondsStr }}</span>
              </div>
              <div class="lowerCard">
                <span>{{ nextSecondsStr }}</span>
              </div>
              <div
                :class="secondsActive ? 'fold' : 'unfold'"
                class="flipCard first"
              >
                <span>{{ secondsActive ? nextSecondsStr : secondsStr }}</span>
              </div>
              <div
                :class="secondsActive ? 'unfold' : 'fold'"
                class="flipCard second"
              >
                <span>{{ secondsActive ? secondsStr : nextSecondsStr }}</span>
              </div>
            </div>
          </div>
          <div class="fs14 word">秒</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleBarToday from './TitleBarToday'

export default {
  name: 'CountDown',
  components: {
    TitleBarToday
  },
  props: {
    leftSeconds: {
      type: [String, Number],
      default: '0'
    }
  },
  data() {
    return {
      hoursActive: false,
      minutesActive: false,
      secondsActive: false,
      leftTime: this.leftSeconds,
      hours: 0,
      minutes: 0,
      seconds: 0,
      firstLoad: true,
      titleBarHeight: 0,
      countDownHeight: 0,
      totalHeight: 0
    }
  },
  computed: {
    // 小时字符串
    hoursStr() {
      return this.timeStrConvert(this.hours)
    },
    // 上一个小时值
    nextHours() {
      return this.nextTimeHoursConvert(this.hours)
    },
    //  上一个小时字符串值
    nextHoursStr() {
      if (this.firstLoad) {
        return '00'
      } else {
        return this.timeStrConvert(this.nextHours)
      }
    },
    // 分钟字符串
    minutesStr() {
      return this.timeStrConvert(this.minutes)
    },
    // 上一个分钟值
    nextMinutes() {
      return this.nextTimeConvert(this.minutes)
    },
    //  上一个分钟字符串值
    nextMinutesStr() {
      if (this.firstLoad) {
        return '00'
      } else {
        return this.timeStrConvert(this.nextMinutes)
      }
    },
    // 秒字符串
    secondsStr() {
      return this.timeStrConvert(this.seconds)
    },
    // 上一个秒值
    nextSeconds() {
      return this.nextTimeSecondsConvert(this.seconds)
    },
    //  上一个分钟字符串值
    nextSecondsStr() {
      if (this.firstLoad) {
        return '00'
      } else {
        return this.timeStrConvert(this.nextSeconds)
      }
    }
  },
  watch: {
    hours(newValue, oldValue) {
      this.hoursActive = !this.hoursActive
    },
    minutes(newValue, oldValue) {
      this.minutesActive = !this.minutesActive
    },
    seconds(newValue, oldValue) {
      this.secondsActive = !this.secondsActive
    }
  },
  mounted() {
    let titleBarTodayEle = document.querySelector('#titleBarToday')
    let calanderEle = document.querySelector('#calander')
    // 初始化时间差
    this.initCountDown()
    // title-bar 高度
    this.titleBarHeight = titleBarTodayEle ? titleBarTodayEle.offsetHeight : 0
    // 今日必抢高度
    this.countDownHeight = calanderEle ? calanderEle.offsetHeight : 0
    // 总高度
    this.totalHeight = this.titleBarHeight + this.countDownHeight
  },
  methods: {
    // 前一个秒转换。
    nextTimeSecondsConvert(num) {
      if (this.leftTime <= 0) {
        return 0
      } else {
        if (num === 59) {
          return 0
        } else {
          return num + 1
        }
      }
    },
    // 前一个时间分钟转换
    nextTimeConvert(num) {
      if (this.leftTime <= 0) {
        return 0
      } else {
        if (num === 59) {
          return 0
        } else {
          return num + 1
        }
      }
    },
    // 前一个时间小时转换
    nextTimeHoursConvert(num) {
      if (this.leftTime <= 0) {
        return 0
      } else {
        return num + 1
      }
    },
    // 时间字符串转换
    timeStrConvert(num) {
      if (this.leftTime < 0) {
        return '00'
      } else {
        return num < 10 ? '0' + num : num
      }
    },
    // 初始化时间差
    initCountDown: function() {
      if (this.leftTime < 0) {
        return
      }
      this.hours = Math.floor(this.leftTime / 3600)
      this.minutes = Math.floor((this.leftTime % 3600) / 60)
      this.seconds = Math.floor((this.leftTime % 3600) % 60)
      // 倒计时1s
      setTimeout(() => {
        this.firstLoad = false
        this.leftTime -= 1
        this.initCountDown()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.count-down-today {
  width: 750px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: linear-gradient(
    353deg,
    rgba(243, 45, 73, 1) 0%,
    rgba(255, 113, 141, 1) 100%
  );
}
// 页面样式
#calander {
  width: 750px;
  color: #fff;
  height: 120px;
  position: fixed;
  left: 0;
  z-index: 10;

  .hint {
    min-width: 200px;
    height: 40px;
    line-height: 40px;
    margin-right: 20px;
  }
}

// 组建样式
.flipClock {
  width: 350px;

  /*增加 */
  font-weight: bold;
  color: #fff;
  > .word {
    width: 30px;
    height: 40px;
    line-height: 40px;
    font-weight: normal;
    position: relative;
    left: -5px;
  }
}

// 原样式
.flipUnitContainer {
  display: block;
  position: relative;
  width: 64px;
  height: 48px;
  perspective-origin: 50% 50%;
  perspective: 300px;
  background-color: #000;
  border-radius: 4px;
  background-clip: padding-box;
  margin-right: 8px;
}

.upperCard,
.lowerCard {
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 50%;
  overflow: hidden;
}
.upperCard span,
.lowerCard span {
  color: #fff;
}

.upperCard {
  align-items: flex-end;
  border-bottom: 1px solid #686b72;
  background-clip: padding-box;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.upperCard span {
  transform: translateY(50%);
}

.lowerCard {
  align-items: flex-start;
  border-top: 1px solid #686b72;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background-clip: padding-box;
}
.lowerCard span {
  transform: translateY(-50%);
}

.flipCard {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  width: 64px;
  height: 24px;
  overflow: hidden;
  backface-visibility: hidden;
}
.flipCard span {
  font-weight: bold;
  color: #fff;
}
.flipCard.unfold {
  top: 50%;
  align-items: flex-start;
  transform-origin: 50% 0%;
  transform: rotateX(180deg);
  background-color: #000;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background-clip: padding-box;
  border-top: 1px solid #686b72;
}
.flipCard.unfold span {
  transform: translateY(-50%);
}
.flipCard.fold {
  top: 0%;
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: flex-end;
  transform-origin: 50% 100%;
  transform: rotateX(0deg);
  background-color: #000;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-clip: padding-box;
  border-bottom: 1px solid #686b72;
}
.flipCard.fold span {
  transform: translateY(50%);
}

.fold {
  animation: fold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal
    forwards;
  transform-style: nextserve-3d;
}

.unfold {
  animation: unfold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal
    forwards;
  transform-style: nextserve-3d;
}

@keyframes fold {
  0% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
  100% {
    -webkit-transform: rotateX(-180deg);
    transform: rotateX(-180deg);
  }
}

@keyframes unfold {
  0% {
    -webkit-transform: rotateX(180deg);
    transform: rotateX(180deg);
  }
  100% {
    -webkit-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
}
</style>