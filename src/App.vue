<template>
  <div id="app">
    <!-- <transition :name="transitionName" :css="!!direction"> -->
    <transition :name="transitionName" :css="!!direction">
      <vnode-cache>
        <!-- <keep-alive exclude="mv"> -->
          <router-view class="router-view"></router-view>
        <!-- </keep-alive> -->
      </vnode-cache>
    </transition>
    <SongPlayer></SongPlayer>
    <TabBar></TabBar>
  </div>
</template>

<script>
import TabBar from '@/comlayout/TabBar/index'
import SongPlayer from '@/comlayout/SongPlayer/index'
// import { mapState } from 'vuex'
// import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    TabBar,
    SongPlayer
  },
  data () {
    return {
      transitionName: '',
      direction: ''
    }
  },
  created () {
    this.$direction.on('forward', (direction) => {
      if (direction) {
        this.transitionName = ''
      }
      this.transitionName = 'vux-pop-in'
      this.direction = direction
    })
    this.$direction.on('reverse', (direction) => {
      if (direction) {
        this.transitionName = ''
      }
      this.transitionName = 'vux-pop-out'
      this.direction = direction
    })
  },
  methods: {
    isBar (path) {
      let find = this.tabBar.findIndex(item => item === path.route.path)
      if (find === -1) {
        return false
      } else {
        return true
      }
    }
  }

}
</script>

<style lang="stylus" scoped>
  #app{
    width: 100%;
    height:100%;
  }
  .router-view{
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
