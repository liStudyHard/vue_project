<template>
  <div class="order-record fs12">
    <div class="record-list">
      <div v-for="(item, index) in recordList" :key="index" class="item-record">
        <div class="appeal-date fs20">{{ item.appealDate }}</div>
        <div class="good-number-wrap flex-left">
          <div class="left-area">商品编号：</div>
          <div class="right-area flex-space-between">
            <div>{{ item.goodNumber }}</div>
            <!--  <div
              v-clipboard:copy="item.goodNumber"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="copy-btn"
            >
              一键复制
            </div> -->
          </div>
        </div>
        <div v-if="item.goodTitle" class="good-title-wrap flex-left">
          <div class="left-area">商品标题：</div>
          <div class="good-title right-area">{{ item.goodTitle }}</div>
        </div>
        <div class="appeal-status-wrap flex-left">
          <div class="left-area flex-left">申诉状态:</div>
          <div class="right-area">
            <p class="appeal-status">{{ item.appealStatus }}</p>
            <p class="appeal-dec ">{{ item.appealDec }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEmtry" class="emtry-wrap">
      <img
        src="https://y.taofen8.com/7cf78a23c7344ee487afb8a84e770af9.jpg"
        alt=""
        class="emtry-record"
      />
      <p class="fs14">您当前暂无申诉记录</p>
    </div>
    <Log
      content="联系客服"
      position="自定义按钮"
      bussiness-type="自定义按钮"
      class="footer-wrap"
      @click="contactPeople"
    >
      <img
        src="https://y.taofen8.com/65f32e60ba754ea4abeb6b4b0033614b.jpg"
        alt=""
        class="help-icon"
      />
      <div>有相关问题，请联系客服（08:30-23:30）</div>
    </Log>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="100"
    />
    <div v-show="loadSuc" class="wait-wrap">
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
import Log from '@/components/Log'
export default {
  name: 'OrderRecord',
  components: {
    Log
  },
  data() {
    return {
      recordList: [],
      pageNo: 0,
      busy: false,
      showEmtry: false,
      loadSuc: false
    }
  },
  created() {
    this.initData()
    // this.$store.dispatch('countPvUv', {
    //   code: ' 2019_appeal',
    //   pageName: '2019_appeal_record'
    // })
    // document.title = '申述记录'
  },
  methods: {
    initData() {
      if (this.pageNo < 1) return
      api.appeal.orderRecord({ pageNo: this.pageNo }).then(res => {
        this.loadSuc = false
        if (!res.recordList || res.recordList.length === 0) {
          if (this.pageNo === 1) {
            this.showEmtry = true
          }
          return
        }
        if (this.pageNo > 1) {
          this.recordList = this.recordList.concat(res.recordList)
        } else {
          this.recordList = res.recordList
        }
        this.busy = false
      })
    },
    contactPeople() {
      window.location.href = 'https://router.taofen8.com/ccs'
    },
    loadMore() {
      this.busy = true
      this.loadSuc = true
      this.pageNo++
      this.initData()
    }
    // onCopy(e) {
    //   this.$toast('复制成功')
    // },
    // onError(e) {
    //   this.$toast('复制失败，请手动复制')
    // }
  }
}
</script>
<style scoped lang="scss">
.order-record {
  position: relative;
  padding-bottom: 138px;
}
.record-list {
  padding-top: 1px;
  margin: 0 32px;
  .item-record {
    margin: 16px auto;
    padding: 32px;
    width: 686px;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-clip: padding-box;
  }
  .left-area {
    width: 146px;
    color: #999999;
  }
  .right-area {
    width: calc(100% - 146px);
  }
  .good-title-wrap {
    margin: 8px 0;
  }
  .appeal-date {
    margin-bottom: 24px;
    font-weight: 900;
  }
  .appeal-status {
    color: #ff1155;
    font-weight: 900;
  }
  .copy-btn {
    width: 128px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 24px;
    background-clip: padding-box;
    border: 1px solid rgba(221, 221, 221, 1);
    color: #666666;
  }
}
.emtry-wrap {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .emtry-record {
    margin-bottom: 48px;
    width: 272px;
    height: 272px;
  }
}
.footer-wrap {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 66;
  padding: 16px 0;
  width: 100%;
  text-align: center;
  background: #ffffff;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
  .help-icon {
    margin: 0 auto 8px;
    width: 224px;
    height: 64px;
  }
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
}
</style>
