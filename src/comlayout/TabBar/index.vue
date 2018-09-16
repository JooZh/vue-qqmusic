<template>
  <div id="tab-bar">
    <div class="container border-half-top">
      <router-link class="bar" to="/recomment">
        <div class="button">
          <div class="icon"><Icon type="ios-thumbs-up" /></div>
          <div class="text">推荐</div>
        </div>
      </router-link>
      <router-link class="bar" to="/singer">
        <div class="button">
          <div class="icon"><Icon type="md-headset" /></div>
          <div class="text">歌手</div>
        </div>
      </router-link>
      <router-link class="bar" to="/ranking">
        <div class="button">
          <div class="icon"><Icon type="ios-podium" /></div>
          <div class="text">排行榜</div>
        </div>
      </router-link>
      <router-link class="bar" to="/menu">
        <div class="button">
          <div class="icon"><Icon type="md-list-box" /></div>
          <div class="text">歌单</div>
        </div>
      </router-link>
      <router-link class="bar" to="/about">
      <div class="button">
          <div class="icon"><Icon type="ios-create" /></div>
          <div class="text">关于</div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>
<style lang="stylus" scoped>
  @import '../../assets/css/common';
  #tab-bar
    height 50px
    background $bgColor
    position fixed
    bottom 0
    left 0
    right 0
    z-index 9
    .container
      display flex
      width 100%
      height 100%
      .bar
        flex 1
        display flex
        justify-content center
        align-items center
        color $defaultColor
        text-align center
        &.router-link-active
          color $themeColor
        .icon
          font-size 25px
        .text
          position relative
          top -2px
          font-size 10px
</style>
