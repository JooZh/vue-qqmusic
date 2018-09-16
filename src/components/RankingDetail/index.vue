<template>
  <div>
    <div id="ranking-list">
      <Header :title="showTitle" :show="true" :bg="fixed" :border="fixed"></Header>
      <div class='tab border-half-bottom' v-show="fixed">
        <div class="tab-list" :class="{'fixed':fixed}">
          <div class="tab-list-item left">
            <span class="left">排行榜共 {{topInfo.total_song_num}} 首</span>
          </div>
          <div class="tab-list-item right">
            <span class="right" @click='handlePlayAll'>全部播放</span>
          </div>
        </div>
      </div>
      <Scroll :data="songlist" :type="'subPage'" :scrollY="true" :listenScroll="true" @scroll="onScroll" :probeType="3">
        <div class="container">
          <div id='infos' class='infos'>
            <div class='singer-bg'>
              <!-- <img class='background' :src='topInfo.pic_album' :onerror="defaultImg" :onload="defaultImg"> -->
              <img class='background' v-lazy='{src:topInfo.pic_album,error:defaultImg,loading:defaultImg}'>
            </div>
            <div class='info-content'>
              <!-- <img class='min-avatar' :src='topInfo.pic_album' :onerror="defaultImg" :onload="defaultImg"> -->
              <img class='min-avatar' v-lazy='{src:topInfo.pic_album,error:defaultImg,loading:defaultImg}'>
              <div class='info'>
                <div class='name'>{{topInfo.ListName}}</div>
                <div ref="title" class='fans'>{{topInfo.pts}}</div>
                <div class='fans'>{{topInfo.update_time}} 更新</div>
              </div>
            </div>
          </div>
          <div ref="tab" class='tab border-half-bottom'>
            <div class="tab-list">
              <div class="tab-list-item left">
                <span class="left">排行榜共 {{topInfo.total_song_num}} 首</span>
              </div>
              <div class="tab-list-item right">
                <span class="right" @click='handlePlayAll'>全部播放</span>
              </div>
            </div>
          </div>
          <SongList :musicList="songlist"></SongList>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Header from '@/comlayout/Header/index'
import SongList from '@/comview/SongList/index'
import Scroll from '@/cominclude/Scroll/index'

import { mapMutations } from 'vuex'

export default {
  name: 'ranking-detail',
  components: {
    Header,
    SongList,
    Scroll
  },
  data () {
    return {
      tabTop: 100,
      headerBg: false,
      showTitle: '',
      headerTitle: '',

      meunId: -1,
      fixed: false,
      songlist: [],
      topInfo: {},
      defaultImg: require('@/assets/images/album.png')
    }
  },
  mounted () {
    this.meunId = this.$route.params.id
    this.headerTitle = this.$route.params.title
    // 获取当前页面高度
    this.getMusicList()
  },
  methods: {

    ...mapMutations([
      'playAll',
      'play',
      'playBackType'
    ]),
    handlePlayAll () {
      this.$router.push({
        path: `/player`
      })
      this.playBackType('ios')
      this.playAll(this.songlist)
      let timer = setTimeout(() => {
        this.audio = document.getElementById('audio')
        this.audio.play()
        clearTimeout(timer)
      }, 100)
    },
    onScroll (pos) {
      this.fixed = this.tabTop + pos.y <= 0
      if (this.title + pos.y <= 0) {
        this.showTitle = this.headerTitle
        this.headerBg = true
      } else {
        this.showTitle = ''
        this.headerBg = false
      }
    },
    // 获取单曲数据
    getMusicList () {
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.topListDetail,
          platform: 'h5',
          needNewCode: 1,
          topid: this.meunId,
          page: 'detail',
          tpl: 3,
          type: 'top'
        }
      }).then((res) => {
        let topInfo = res.data.topInfo
        let pts = ''
        if (topInfo.day_of_year) {
          pts = `第${topInfo.day_of_year}天`
        } else {
          let str = topInfo.date.substr(5)
          pts = `第${str}周`
        }
        let songlist = this.musicHander(res.data.songlist)
        topInfo.pts = pts
        this.topInfo = topInfo
        this.songlist = songlist
        // 吸顶效果
        this.tabTop = this.$refs.tab.getBoundingClientRect().top - 40
        this.title = this.$refs.title.getBoundingClientRect().top
      })
    },
    // 单曲数据处理
    musicHander (list) {
      let musicList = []
      list.forEach((item, index) => {
        musicList.push(this.X.song(item.data))
      })
      return musicList
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/common'
#ranking-list
  width 100%
  height 100%
  position relative
  z-index 12
  background $bgColor
  .container
    .infos
      height: 220px;
      width: 100%;
      position relative
      .singer-bg
        background: #353535;
        height: 100%;
        -webkit-filter: blur(30px);
        filter: blur(30px);
        opacity: 0.4;
        .background
          width: 100%;
          height: 100%;
      .info-content
        position: absolute;
        top: 40px;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        color: #ccc;
        .min-avatar
          width: 120px;
          height: 120px;
          flex: 0 0 120px;
          margin: 25px 30px;
          background: #353535;
        .info
          display: inline-block;
          margin: 25px 20px 0 0;
          flex: 1;
          height: 100px;
          .name
            font-size: 18px;
            line-height: 1.2;
            padding: 10px 0;
            overflow: hidden;
            color: #ffcd32;
          .fans
            font-size: 14px;
            line-height: 1.5
  .tab
    width: 100%;
    height 40px
    position: relative;
    .tab-list
      background: transparent;
      transition: background 0.5s ease;
      width: 100%;
      display: flex;
      line-height: 40px;
      position: absolute;
      top: 0;
      left: 0
      &.fixed
        position: fixed;
        top: 40px;
        left: 0;
        z-index: 2;
        background: #252525;
        transition: background 0.5s ease;
      .tab-list-item
        font-size: 15px;
        font-weight 700
        flex: 1;
        color: rgba(255,255,255,0.5);
        span
          padding: 0 15px;
        &.left
          text-align: left;
        &.right
          text-align: right
</style>
