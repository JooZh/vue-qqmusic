<template>
  <div>
    <div class="menu-list">
      <Header :title="headerTitle" :show="false"></Header>
      <div class="tab border-half-bottom">
        <div class="tab-list" :class="fixed ? 'fixed':''">
          <div class="tab-list-item left">
            <span @click='changeAll' class="tags" :class="categoryId==10000000?'select':''">全部歌单</span>
          </div>
          <div class="tab-list-item right">
            <span @click='changeTop(5)' :class="sortId==5?'select':''">推荐</span>
            <span @click='changeTop(2)' :class="sortId==2?'select':''">最新</span>
          </div>
        </div>
      </div>
      <Scroll
        class="scroll-layout"
        ref="scroll"
        :data="menuList"
        :pullingUp="true"
        @pullingUp="onPullingUp"
        :scrollY="true"
        :listenScroll="true"
        @scroll="onScroll"
        :probeType="3">
        <div>
          <div class="targs-layout">
            <div class='areas border-half-bottom' v-for="(taglist,idx) in targs" :key="idx">
              <div class='tit'>{{taglist.categoryGroupName}} :</div>
              <!-- <div ref="areascroll" class='scroll-box'> -->
              <Scroll :scrollX="true" :type="'none'" :data="taglist" class='scroll-box'>
                <div ref="areas" class='areas-list'>
                  <div class="area" :class="item.categoryId==categoryId?'select':''" @click='areaChange(item.categoryId)' v-for="(item,key) in taglist.items" :key="key">
                    <span>{{item.categoryName}}</span>
                  </div>
                </div>
              </Scroll>
              <!-- </div> -->
              <div class='void'></div>
            </div>
          </div>
          <div ref="tab" class="tab border-half-bottom">
            <div class="tab-list">
              <div class="tab-list-item left">
                <span @click='changeAll' class="tags" :class="categoryId==10000000?'select':''">全部歌单</span>
              </div>
              <div class="tab-list-item right">
                <span @click='changeTop(5)' :class="sortId==5?'select':''">推荐</span>
                <span @click='changeTop(2)' :class="sortId==2?'select':''">最新</span>
              </div>
            </div>
          </div>
          <Menulist :menulist="menuList"></Menulist>
          <Loading v-if="hasMore"></Loading>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Header from '@/comlayout/Header/index'
import Loading from '@/cominclude/Loading/index'
import Menulist from '@/comview/MenuList/index'
import Scroll from '@/cominclude/Scroll/index'

export default {
  name: 'Menu-list',
  components: {
    Header,
    Loading,
    Menulist,
    Scroll
  },
  data () {
    return {
      headerTitle: '歌单',
      ready: false,
      hasMore: true,
      loaded: true,

      menuList: [],
      targs: [],
      sortId: 5,
      categoryId: 10000000,
      selectTag: {},
      sin: 0,
      ein: 29,
      // tab操作
      tabTop: 0,
      fixed: false
    }
  },
  mounted () {
    this.getTags()
  },
  methods: {
    // 点击切换类目 重置 各种数据
    areaChange (id) {
      if (id === this.categoryId) {
        return false
      }
      this.categoryId = id
      this.changeSetData()
    },
    changeAll () {
      if (this.categoryId === 10000000) {
        return false
      }
      this.categoryId = 10000000
      this.changeSetData()
    },
    changeTop (id) {
      this.sortId = id
      this.changeSetData()
    },
    changeSetData () {
      this.menuList = []
      this.hasMore = true
      this.sin = 0
      this.ein = 29
      let timer = setTimeout(() => {
        this.getData()
        clearTimeout(timer)
      }, 300)
    },
    onScroll (pos) {
      this.fixed = this.tabTop + pos.y <= 0
    },
    onPullingUp () {
      let timer = setTimeout(() => {
        this.getData()
        clearTimeout(timer)
      }, 500)
    },
    // 初始化滚动
    initScroll (ch) {
      let chs = this.$refs[ch]
      Array.from(chs).forEach((ch, index) => {
        let children = ch.children
        let width = 0
        Array.from(children).forEach((item) => {
          width += item.getBoundingClientRect().width
        })
        chs[index].style.width = `${width}px`
      })
    },
    // 获取歌单数据
    getData () {
      if (!this.hasMore) {
        return
      }
      if (!this.loaded) {
        return
      }
      this.loaded = false
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.songMenuList,
          picmid: 1,
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8',
          categoryId: this.categoryId,
          sortId: this.sortId,
          sin: this.sin,
          ein: this.ein
        }
      }).then((res) => {
        let menuListArr = this.menuHandler(res.data)
        // 分页加载
        let hasMore = true
        if (!menuListArr.length || menuListArr.length < 30) {
          hasMore = false
        }
        // 合并数组
        let addArr = this.menuList
        let menuList = addArr.concat(menuListArr)
        this.menuList = menuList
        this.hasMore = hasMore
        this.loaded = true
        this.ready = 1
        this.sin = this.sin + 30
        this.ein = this.ein + 30
      })
    },
    // 获取标签
    getTags () {
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.songMenuTags,
          format: 'json',
          inCharset: 'utf8',
          outCharset: 'utf-8'
        }
      }).then((res) => {
        let selectTag = res.data[0]
        this.selectTag = selectTag
        res.data.shift()
        this.targs = res.data

        let timer = setTimeout(() => {
          this.tabTop = this.$refs.tab.getBoundingClientRect().top - 40
          this.initScroll('areas')
          clearTimeout(timer)
        }, 30)
        this.getData()
      })
    },
    // 处理数据
    menuHandler (list) {
      let arr = []
      list.forEach((item) => {
        let obj = {
          pic: item.imgurl,
          dissname: item.dissname,
          dissid: item.dissid,
          creator_name: item.creator.name,
          listen_count: (item.listennum / 10000).toFixed(2),
          pub_time: item.commit_time
        }
        arr.push(obj)
      })
      return arr
    }
  }
}
</script>

<style lang="stylus" scoped>
.menu-list
  width 100%;
  height 100%
  position absolute
  left 0
  right 0
  z-index 8
  .areas
    display: flex;
    line-height: 30px;
    position: relative;
    .tit
      flex: 40px 0 0;
      text-align: center;
      color: #999;
    .scroll-box
      flex: 1;
      overflow: hidden;
      white-space:nowrap;
      position static
      .areas-list
        width: 100%;
        .area
          font-size: 12px;
          padding: 0 7px ;
          color: #999
          display: inline-block
          &.select
            color: #ffcd32;
    .void
      flex: 10px 0 0;
  .scroll-layout
    top 40px
    bottom 50px
  /* 导航 */
  .tab
    width: 100%;
    height 40px
    position: relative;
    .fixed
      position: fixed;
      top: 40px;
      left: 0;
      right 0;
      z-index: 2;
      background: #252525;
      transition: background 0.5s ease;
    .tab-list
      // background: transparent;
      transition: background 0.5s ease;
      width: 100%;
      display: flex;
      height 40px;
      line-height: 40px;
      .tab-list-item
        font-size: 14px;
        flex: 1;
        color: rgba(255,255,255,0.5);
        .tags
          padding: 0 15px;
        &.left
          text-align: left;
        &.right
          text-align: right
          span
            padding:0 8px;
        .select
          color: #ffcd32;

</style>
