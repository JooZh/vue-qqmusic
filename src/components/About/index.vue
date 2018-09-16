<template>
  <div>
    <div class='mvlist'>
      <div class='list' v-for="(item,index) in new Array(30)" :key="index">
        <div class='detail' @click='getPlay(index)'>
          <img ref="img" class='img' :src="defaultImg">
          <div class="title-box">
            <div class='title'>vue-app-effect</div>
          </div>
          <div class='date'>播放: 999.99 万</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about'
}
</script>

<style lang="stylus" scoped>
  @import '../../assets/css/common'
.mvlist
  color:rgba(255,255,255,0.5)
  display flex
  padding 5px
  flex-wrap wrap
  .list
    flex 50% 0 0
    .detail
      padding 5px
      position relative
      .img
        width: 100%;
      .title-box
        height: 30px;
        position relative
        line-height: 30px;
      .title
        position absolute
        left 0
        right 0
        font-size: $fontS;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      .date
        font-size: $fontXS
        i
          font-size 20px
          position relative
          top -1px
@media screen and (max-width:480px)
  .img
    height 108px
@media screen and (max-width:375px)
  .img
    height 97px
@media screen and (max-width:320px)
  .img
    height 82px
</style>
