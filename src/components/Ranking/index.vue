<template>
  <div>
    <div class="ranking">
      <Header :title="headerTitle" :show="false"></Header>
      <Scroll class="scroll-layout" :data="toplist" :scrollY="true" :pullingDown="true" @pullingDown="onPullingDown">
        <div class="container">
          <div class='list-warpper' v-for="(item,index) in toplist" :key="index">
            <div class="list" @click='goDetail(item.id,item.topTitle)'>
              <div class='img'><img :src="item.picUrl"></div>
              <div class='info'>
                <div class='title text-line'>
                  <span class="pix">{{item.topTitle}}</span>
                </div>
                <div class='name-list text-line' v-for="(value,key) in item.songList" :key="key">
                  <div class="pix">
                    {{key+1}}<span class='color-h'> {{value.songname}}</span> - {{value.singername}}
                  </div>
                </div>
              </div>
              <div class='right'>
                <div class='v'></div>
              </div>
            </div>
          </div>
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
import Scroll from '@/cominclude/Scroll/index'
import Loading from '@/cominclude/Loading/index'

export default {
  name: 'ranking',
  components: {
    Header,
    Scroll,
    Loading
  },
  data () {
    return {
      showLoading: false,
      headerTitle: '排行榜',
      toplist: []
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
    goDetail (id, title) {
      // 创建一个新路由
      let newPath = `/ranking/${id}`
      let newRoute = [{
        path: newPath,
        name: newPath,
        component: {extends: this.$router.extends.RankingDetail}
      }]
      // 判断路由是否存在 不存在 添加一个新路由
      let find = this.$router.options.routes.findIndex(item => item.path === newPath)
      if (find === -1) {
        this.$router.options.routes.push(newRoute[0])
        this.$router.addRoutes(newRoute)
      }
      // 存在直接跳转到路由
      this.$router.push({
        name: newPath,
        params: {id: id, title: title}
      })
    },
    getData () {
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.topList,
          platform: 'h5',
          needNewCode: 1
        }
      }).then((res) => {
        this.toplist = res.data
        this.showLoading = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/common';
.ranking
  position absolute
  top 0
  left 0
  right 0
  width 100%
  height 100%
  background $bgColor
  .pulldown-wrapper
    height 50px
    width 100%
    text-align center
    position absolute
    top 40px
  .scroll-layout
    top 40px
    bottom 50px
    .container
      padding: 5px 5px
      .list-warpper
        padding: 5px
        .list
          display: flex;
          background: #303030
          .img
            flex: 110px 0 0
            img
              width: 100%
              height: 100%
              display: block
          .info
            flex: 1
            margin-left: 10px
            .title
              font-size: 14px
              padding-top 5px
              height 30px
              line-height: 30px
              position relative
              color: rgba(255,205,50,0.7)
            .name-list
              position relative
              line-height: 25px;
              height: 25px;
              font-size: 12px;
              color: #777;
              .color-h
                color #ccc
                font-family: "hiragino sans gb",arial;
          .right
            flex: 25px 0 0;
            display: flex;
            justify-content: center;
            align-items: center
            .v
              display: inline-block;
              border-top: 1px solid #777;
              border-right: 1px solid #777;
              transform: rotate(45deg);
              width: 10px;
              height: 10px
</style>
