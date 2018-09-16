<template>
  <div>
    <keep-alive>
      <router-view class="tab-router-view"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'tab'
}
</script>

<style lang="stylus" scoped>
  .tab-router-view{
    width: 100%;
    height:100%;
  }
  // .vux-pop-out-enter-active,
  // .vux-pop-out-leave-active,
  // .vux-pop-in-enter-active,
  // .vux-pop-in-leave-active {
  //   will-change: transform;
  //   transition: all 500ms cubic-bezier(0.075, 0.82, 0.165, 1)
  //   height: 100%;
  //   top: 0;
  //   position: absolute;
  //   backface-visibility: hidden;
  //   perspective: 1000;
  // }
  // .vux-pop-out-enter {
  //   opacity: 0;
  //   transform: translate3d(-70%, 0, 0);
  // }
  // .vux-pop-out-leave-active {
  //   opacity: 0;
  //   transform: translate3d(70%, 0, 0);
  // }
  // .vux-pop-in-enter {
  //   opacity: 0;
  //   transform: translate3d(70%, 0, 0);
  // }
  // .vux-pop-in-leave-active {
  //   opacity: 0;
  //   transform: translate3d(-70%, 0, 0);
  // }
</style>
