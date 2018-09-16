<template>
  <div>
    <!-- <transition :name="viewTransition" :css="!!direction"> -->
      <!-- <navigation> -->
        <router-view class="sub-router-view"></router-view>
      <!-- </navigation> -->
    <!-- </transition> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      transitionName: '',
      tabBar: ['/recomment', '/ranking', '/menu', '/home', '/singer', '/']
    }
  },
  computed: {
    ...mapGetters(['direction']),
    viewTransition () {
      if (!this.direction) return ''
      return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
    }
  }
}
</script>

<style lang="stylus" scoped>
.sub-router-view{
  width: 100%;
  height:100%;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1)
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-70%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(70%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(70%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-70%, 0, 0);
  }
</style>
