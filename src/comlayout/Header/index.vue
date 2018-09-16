<template>
  <header id="header" :class="{'bg':bg,'border-half-bottom':border}">
    <div class="back-btn">
      <!-- <Icon v-if="!show" type="ios-contact" /> -->
      <Icon v-if="show" type="ios-arrow-back" @click="back"/>
    </div>
    <div class="title">{{title}}</div>
    <div class="show-cd" :style="musicShow" @click="changePlayer">
      <Music :play="playStatus" v-if="playerList.length" ></Music>
    </div>
  </header>
</template>

<script>
import Music from '@/cominclude/Music/index'
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    show: {
      type: Boolean,
      default: true
    },
    bg: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Music
  },
  computed: {
    ...mapGetters([
      'playStatus',
      'playerList'
    ]),
    musicShow () {
      if (!this.playerList.length) {
        return `transform:translate(100%, 0)`
      } else {
        return `transform:translate(0, 0)`
      }
    }
  },
  methods: {
    changePlayer () {
      this.$router.push({
        path: `/player`
      })
      this.playBackType('ios')
      this.togglePlayer()
    },
    ...mapActions([
      'togglePlayer',
      'playBackType'
    ]),
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus">
  @import '../../assets/css/common';
  #header
    display flex
    height 40px
    font-size $fontM
    line-height 40px
    text-align center
    color $themeColor
    width 100%
    position fixed
    top 0
    left 0
    right 0
    z-index 9
    transition background 0.4s
    &.bg
      transition background 0.4s
      background $bgColor
    .title
      flex 1
      text-align center
    .back-btn
      flex 40px 0 0
      font-size 28px
      text-align center
      &.hide
        visibility hidden
    .show-cd
      flex 40px 0 0
      font-size 20px
      text-align center
      display flex
      justify-content center
      align-items center

      .pi
        width 30px
        height 30px
        border-radius: 50%
        border 1px solid $themeColor
        display flex
        justify-content center
        align-items center
</style>
