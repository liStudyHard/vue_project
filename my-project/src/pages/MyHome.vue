<template>
  <div>1111</div>
</template>
<script>
import api from '@/api/index'
export default {
  name: 'MyHome',
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      api.queryInitData().then(res => {
        console.log(res)
      })
    }
  }
}
</script>
