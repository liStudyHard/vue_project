<!-- 文字楼层导航 -->
<template>
  <nav ref="navWrap" class="nav-wrap fs14">
    <swiper
      ref="navSwiper"
      :options="swiperOption"
      :style="styleObj"
      class="nav-list"
    >
      <swiper-slide
        v-for="(nav, index) in navList"
        :key="nav.id"
        class="nav-slide"
      >
        <Log
          :content="nav.title"
          :style="{ color: activeIndex === index ? activeColor : color }"
          :position="'楼层_' + nav.title"
          bussiness-type="图片导航"
          @click="handleClick(index)"
        >
          <div class="pic-wrap">
            <img :src="nav.picUrl" />
            <p
              :style="{
                background:
                  activeIndex === index ? activeStyleColor : '#ececec',
                color: activeIndex === index ? activeColor : color
              }"
              class="title"
            >
              {{ nav.title }}
            </p>
          </div>
          <span
            v-if="activeIndex === index"
            :style="{ borderTopColor: activeStyleColor }"
            class="bottom-arrow"
          />
        </Log>
      </swiper-slide>
      <div slot="button-next" class="swiper-button-next" />
    </swiper>
  </nav>
</template>
<script>
import Log from '@/components/Log'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { offset } from '@/assets/js/util'

export default {
  name: 'NavPic',
  components: {
    swiper,
    swiperSlide,
    Log
  },
  props: {
    navList: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: '#666'
    },
    activeColor: {
      type: String,
      default: '#fff'
    },
    activeStyleColor: {
      type: String,
      default: '#000'
    }
  },
  data() {
    return {
      swiperOption: {
        freeMode: true,
        slidesPerView: 'auto'
        // navigation: {
        //   nextEl: '.swiper-button-next'
        // }
      },
      styleObj: {
        position: 'relative',
        top: '0'
      },
      activeIndex: 0
    }
  },
  computed: {
    navSwiper() {
      return this.$refs.navSwiper.swiper
    },
    floorOffsetList() {
      return this.$store.state.floorOffsetList
    }
  },
  mounted() {
    let self = this
    let $navWrap = this.$refs.navWrap || document.createElement('div')
    let $titleBar =
      document.querySelector('.J_title_bar') || document.createElement('div')
    // 导航离页面顶部的距离
    let navOffsetTop = offset($navWrap).top

    // 导航高度
    this.navHeight = parseFloat(getComputedStyle($navWrap).height) || 0
    // 自定义标题栏高度
    this.titleBarHeight = parseFloat(getComputedStyle($titleBar).height) || 0

    window.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset

      // 导航栏固定在页面顶部或者跟随页面滚动
      self.toggleNav(scrollTop, navOffsetTop - this.titleBarHeight - 2)
      // 切换导航项
      self.switchNavItem(scrollTop, this.navHeight + this.titleBarHeight + 2)
    })
  },
  methods: {
    // 点击导航
    handleClick(index) {
      self.activeIndex = index
      window.scrollTo(
        0,
        this.floorOffsetList[index] - this.navHeight - this.titleBarHeight
      )
    },
    // 导航栏固定在页面顶部或者跟随页面滚动
    toggleNav(scrollTop, position) {
      var self = this

      if (scrollTop > position) {
        self.styleObj = {
          position: 'fixed',
          top: self.titleBarHeight + 'px'
        }
      } else {
        self.styleObj = {
          position: 'relative',
          top: 0
        }
      }
    },
    // 切换导航项
    switchNavItem(scrollTop, offset) {
      var self = this
      var active = 0

      scrollTop += offset

      // 遍历所有楼层，找到当前所在楼层
      for (var i = self.floorOffsetList.length - 1; i >= 0; i--) {
        if (scrollTop >= self.floorOffsetList[i]) {
          if (self.activeIndex === i) break

          self.activeIndex = i
          // 滑动导航项
          self.navSwiper.slideTo(i < 2 ? 0 : i - 1, 500)
          break
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.nav-wrap {
  width: 100%;
  height: 254px;
  font-weight: bold;
  background-color: #fff;

  .nav-list {
    z-index: 10;
    position: relative;
    top: 0;
    width: 100%;
    height: 254px;
    padding-top: 32px;
    padding-left: 32px;
    background-color: #fff;

    .swiper-button-next {
      position: absolute;
      top: 90px;
      right: 32px;
      width: 24px;
      height: 80px;
      margin: 0;
      background: url('https://y.taofen8.com/05fcda37de344411a4dbbcfbe1655839.jpg')
        no-repeat center;
      background-size: 100%;
    }
  }

  .nav-slide {
    position: relative;
    width: auto;
    height: 196px;
    margin-right: 16px;

    .pic-wrap {
      position: relative;
      width: 240px;
      height: 196px;
      border-radius: 8px;
      background-clip: padding-box;
      overflow: hidden;

      .title {
        z-index: 11;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 52px;
        line-height: 52px;
        text-align: center;
        color: #666;
        background-color: #ececec;
      }
    }

    .bottom-arrow {
      z-index: 11;
      position: absolute;
      bottom: -29px;
      left: 50%;
      transform: translateX(-50%);
      border-width: 16px;
      border-style: solid;
      border-color: transparent;
    }
  }
}
</style>
