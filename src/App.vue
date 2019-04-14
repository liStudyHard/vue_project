<template>
  <div id="app" class="fs12">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'PingFangSC-Regular';
  line-height: 1.5;

  position: relative;

  /*overflow-y: scroll;*/

  width: 100%;
  height: 100%;
  margin-right: auto;
  margin-left: auto;

  color: #333;

  -webkit-overflow-scrolling: touch;
}
.pink {
  color: #f4436d;
}
[v-cloak] {
  display: none;
}
</style>
