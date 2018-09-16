<template>
  <div id="swiper" @touchstart="swiperTouchStr($event)" @touchend="swiperTouchEnd($event)">
    <div class="swiper-tran" :style="{transform: `translate(-${current}00%,0)`}">
      <div class="swiper-warrper" :style="{width: items.length+'00%'}">
        <div class="swiper-item" v-for="(value, index) in items" :key="index">
          <img :src="value" alt="">
        </div>
      </div>
    </div>
    <div class="dots">
      <div class="dot" @click="changeCurrent(index)" v-for="(value,index) in items" :class="current==index?'active':''" :key="index"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  data () {
    return {
      current: 0,
      timer: null,
      startX: 0,
      startY: 0
    }
  },
  mounted () {
    this.swiper()
  },
  methods: {
    changeCurrent (index) {
      this.current = index
    },
    swiper () {
      this.timer = setInterval(() => {
        if (this.current < this.items.length - 1) {
          this.current += 1
        } else {
          this.current = 0
        }
      }, 3000)
    },
    swiperTouchStr (e) {
      clearInterval(this.timer)
      this.startX = e.changedTouches[0].pageX
      this.startY = e.changedTouches[0].pageY
    },
    swiperTouchEnd (e) {
      let x = e.changedTouches[0].pageX - this.startX
      let y = e.changedTouches[0].pageY - this.startY
      if (Math.abs(x) > Math.abs(y) && x > 0) {
        if (this.current === 0) {
          this.current = this.items.length - 1
        } else {
          this.current -= 1
        }
      } else if (Math.abs(x) > Math.abs(y) && x < 0) {
        if (this.current < this.items.length - 1) {
          this.current += 1
        } else {
          this.current = 0
        }
      } else if (Math.abs(y) > Math.abs(x) && y > 0) {
      } else if (Math.abs(y) > Math.abs(x) && y < 0) {
      } else {
      }
      this.swiper()
    }
  }
}
</script>

<style lang="stylus">
  #swiper
    width 100%
    overflow hidden
    position relative
    .swiper-tran
      transition all 0.5s ease
      .swiper-warrper
        height 100%
        position relative
        display flex
        .swiper-item
          flex 1
          height 100%
          img
            width 100%
            display block
    .dots
      position absolute
      left 0
      right 0
      bottom 0
      height 20px
      text-align center
      .dot
        display inline-block
        width 8px
        height 8px
        border-radius 50%
        margin 0 3px
        background rgba(0,0,0,0.5)
        &.active
          background rgba(255,255,255,0.7)

</style>
