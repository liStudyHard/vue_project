<template>
  <div class="log" @click="handleClick"><slot /></div>
</template>

<script>
import api from '@/api/index'

export default {
  name: 'Log',
  props: {
    commonParams: {
      type: Object,
      default: () => {
        return null
      }
    },
    position: {
      type: String,
      default: ''
    },
    bussinessType: {
      type: String,
      default: ''
    },
    content: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    handleClick() {
      api.ocean.countClick(
        Object.assign({}, this.commonParams, {
          position: this.position,
          bussinessType: this.bussinessType,
          content: this.content
        })
      )
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.log {
  cursor: pointer;
}
</style>
