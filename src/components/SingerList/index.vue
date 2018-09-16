<template>
  <div>
    <div class="singerlist">
      <Header :title="headerTitle" :show="false"></Header>
      <div class='layout'>
        <div class='areas-fix'>
          <Scroll :scrollX="true" :type="'none'" :data="tags.area" class='areas border-half-bottom'>
            <div ref="areas" class='areas-list'>
              <div class="area" :class="item.id==area?'select':''" @click='areaChange(item.id)' v-for="(item,key) in tags.area" :key="key">
                <span>{{item.name}}</span>
              </div>
            </div>
          </Scroll>
          <Scroll :scrollX="true" :type="'none'" :data="tags.sex" class='areas border-half-bottom'>
            <div ref="sexs" class='areas-list'>
              <div class="area" :class="item.id==sex?'select':''" @click='sexChange(item.id)' v-for="(item,key) in tags.sex" :key="key">
                <span>{{item.name}}</span>
              </div>
            </div>
          </Scroll>
          <Scroll :scrollX="true" :type="'none'" :data="tags.genre" class='areas border-half-bottom'>
            <div ref="genres" class='areas-list'>
              <div class="area" :class="item.id==genre?'select':''" @click='genreChange(item.id)' v-for="(item,key) in tags.genre" :key="key">
                <span>{{item.name}}</span>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 字母 -->
        <Scroll class='letters border-half-left' :scrollY="true" :type="'none'">
          <div class='letters-list'>
            <div class="letter" :class="item.id==letter?'select':''"  @click="letterChange(item.id)" v-for="(item,index) in tags.index" :key="index">
              <span>{{item.name}}</span>
            </div>
          </div>
        </Scroll>
        <!-- 列表 -->
        <Scroll :data="singerlist" :pullingUp="true" @pullingUp="onPullingUp" class='singers-list' :scrollY="true" :type="'none'">
          <div>
            <div class='singers' v-if="singerlist.length>0">
              <div class='singer' v-for="(item,index) in singerlist" :key="index" @click='openSinger(item.singer_mid,item.singer_name)'>
                <img class='avatar' v-lazy='{src:item.singer_avatar,error:defaultImg,loading:defaultImg}'>
                <div class='info'>
                  <div class='name f-name'>{{item.singer_name}}</div>
                </div>
              </div>
            </div>
            <Loading v-if="hasMore"></Loading>
            <div class='no-singer' v-if="singerlist.length == 0 && loaded">
              <div>
                <div>什么都木有!</div>
                <div>请切换类目继续浏览</div>
              </div>
            </div>
          </div>
        </Scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/comlayout/Header/index'
import Loading from '@/cominclude/Loading/index'
import Scroll from '@/cominclude/Scroll/index'
export default {
  name: 'singer-detail',
  components: {
    Header,
    Loading,
    Scroll
  },
  props: {
    scroll: {
      type: Number
    }
  },
  data () {
    return {
      headerTitle: '歌手',
      ready: false,
      hasMore: true,
      loaded: true,
      // 路由使用
      singerlist: [],
      tags: {},
      init: true,
      letter: -100,
      area: -100,
      genre: -100,
      sex: -100,
      sin: 0,
      page: 1,
      defaultImg: require('@/assets/images/singer.png')
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    openSinger (mid, name) {
      // 创建一个新路由
      let newPath = `/singer/${mid}`
      let newRoute = [{
        path: newPath,
        name: newPath,
        component: {extends: this.$router.extends.SingerDetail}
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
        params: { mid: mid, name: name }
      })
    },
    // 点击切换类目 重置 各种数据
    sexChange (id) {
      this.changeSetData(id, 'sex')
    },
    genreChange (id) {
      this.changeSetData(id, 'genre')
    },
    letterChange (id) {
      this.changeSetData(id, 'letter')
    },
    areaChange (id) {
      this.changeSetData(id, 'area')
    },
    changeSetData (id, str) {
      if (id === this[str]) {
        return false
      }
      this.hasMore = true
      this.scrollTop = 0
      this.singerlist = []
      this[str] = id
      this.sin = 0
      this.cur_page = 1
      this.getData()
    },
    initScrollWidth (dom) {
      let areaList = this.$refs[dom].children
      let width = 0
      Array.from(areaList).forEach((item) => {
        width += item.getBoundingClientRect().width
      })
      this.$refs[dom].style.width = `${width}px`
    },
    onPullingUp () {
      // console.log('到底')
      let timer = setTimeout(() => {
        this.getData()
        clearTimeout(timer)
      }, 800)
    },
    // 获取数据
    getData () {
      if (!this.hasMore) {
        return
      }
      if (!this.loaded) {
        return
      }
      this.loaded = false
      this.axios.get(this.X.path.u, {
        params: {
          api: this.X.api.singerList,
          param: {
            area: this.area,
            sex: this.sex,
            genre: this.genre,
            index: this.letter,
            sin: this.sin,
            cur_page: this.page
          }
        }
      }).then((res) => {
        let singerarr = res.data.singerlist
        // 小程序不支持webp图片
        singerarr.forEach((item, index) => {
          item.singer_avatar = this.X.img(item.singer_mid, 1)
        })
        // 判断当前读取的数据是否存在或者小于包含条数
        let hasMore = true
        if (!singerarr.length || singerarr.length < 80) {
          hasMore = false
        }
        // 合并数组
        let addSingerlist = this.singerlist
        let singerlist = addSingerlist.concat(singerarr)
        // 第一次的时候处理标签
        if (this.page === 1) {
          let tags = res.data.tags
          tags.index[0].name = '热'
          this.tags = tags
        }
        this.singerlist = singerlist
        this.sin = this.sin + 80
        this.page = this.page + 1
        this.ready = true
        this.hasMore = hasMore
        this.loaded = true
        if (this.init) {
          let timer = setTimeout(() => {
            this.initScrollWidth('genres')
            this.initScrollWidth('areas')
            this.initScrollWidth('sexs')
            clearTimeout(timer)
            this.init = false
          }, 30)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/common';
.singerlist
  width 100%
  height 100%
  background $bgColor
  position absolute
  top 0
  left 0
  right 0
  .layout
    position absolute
    top:40px
    left: 0
    right 0
    bottom 50px
    .areas-fix
      position: absolute;
      left: 0;
      right: 30px;
      background $bgColor
      .areas
        overflow: hidden;
        white-space:nowrap;
        position relative
        .area
          font-size: 13px;
          padding: 0 7px 0 10px;
          color: #999;
          display: inline-block
          &.select
            color: #ffcd32;
      .areas-list
        height: 30px;
        line-height: 30px;
    .letters
      width: 30px;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      position: absolute;
      left auto
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 3;
      background $bgColor
      .letter
        width: 30px;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        color: #999
        &.select
          color: #ffcd32

    .singers-list
      position absolute
      top 90px;
      left 0
      right 30px
      bottom 0
      .singers
        padding-bottom: 10px;
        .singer
          padding: 15px 0 0 25px;
          font-size: 12px;
          display: flex;
          .avatar
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: block;
            background: #ddd;
          .info
            margin: 0 0 0 15px;
            .name
              line-height: 40px;
            .f-name
              color: rgba(255,255,255,0.7);
      .no-singer
        width: 100%;
        height: 100%;
        color: #999;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

</style>
