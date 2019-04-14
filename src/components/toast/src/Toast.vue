<template>
  <transition name="fade">
    <div v-show="visible" class="toast">{{ message }}</div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.toast {
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  width: 436px;
  line-height: 1.6;
  padding: 20px;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  background-clip: padding-box;
  word-break: break-all;
}
</style>
