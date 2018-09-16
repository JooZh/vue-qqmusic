<template>
  <div>
    <div class="recomment">
      <Header :title="headerTitle" :show="false" :bg="true" :border="false"></Header>
      <Scroll class="scroll-layout" :data="mvlist" :scrollY="true" :pullingDown="true" @pullingDown="onPullingDown">
        <div class="container">
          <Swiper :items="imageList"></Swiper>
          <div class="hd">精选MV</div>
          <Mvlist :mvlist="mvlist"></Mvlist>
        </div>
      </Scroll>
      <div class="pulldown-wrapper">
        <Loading v-show="showLoading"></Loading>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/comlayout/Header/index'
import Swiper from '@/cominclude/Swiper/index'
import Mvlist from '@/comview/MvList/index'
import Scroll from '@/cominclude/Scroll/index'
import Loading from '@/cominclude/Loading/index'

export default {
  name: 'recomment',
  components: {
    Swiper,
    Header,
    Scroll,
    Mvlist,
    Loading
  },
  data () {
    return {
      showLoading: false,
      // 路由使用
      headerTitle: '推荐',
      imageList: [],
      mvlist: [],
      // 滑动控制
      current: 0,
      timer: null,
      startX: 0,
      startY: 0
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    onPullingDown () {
      this.showLoading = true
      setTimeout(() => {
        this.getData()
      }, 1000)
    },
    getData () {
      let mvlist = new Promise(resolve => {
        this.axios.get(this.X.path.c, {
          params: {
            api: this.X.api.homeMvList,
            cmd: 'shoubo',
            lan: 'all'
          }
        }).then(res => {
          let mvListArr = []
          res.data.forEach(item => {
            let s = (item.listennum / 10000).toFixed(2)
            let obj = {
              pic: item.picurl,
              vid: item.vid,
              title: item.mvtitle,
              listenCount: s
            }
            mvListArr.push(obj)
          })
          resolve(mvListArr)
        })
      })
      let imageList = new Promise(resolve => {
        this.axios.get(this.X.path.u, {
          params: {
            api: this.X.api.homeFocusImage
          }
        }).then(res => {
          resolve(res.data)
        })
      })
      Promise.all([mvlist, imageList]).then(values => {
        this.imageList = values[1]
        this.mvlist = values[0]
        this.showLoading = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../assets/css/common'
  .recomment
    position absolute
    left 0
    right 0
    top 0
    width 100%
    height 100%
    .pulldown-wrapper
      height 50px
      width 100%
      text-align center
      position absolute
      top 40px
    .scroll-layout
      top 40px
      bottom 50px
      .hd
        margin-top 10px
        height 40px
        line-height 40px
        text-align center
        color $themeColor
        font-size $fontM
</style>
