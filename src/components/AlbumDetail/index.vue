<template>
  <div>
    <div class="menu-detail">
      <Header :title="showTitle" :show="true" :bg="fixed" :border="fixed"></Header>
      <div class='tab border-half-bottom' v-show="fixed">
        <div class="tab-list" :class="{'fixed':fixed}">
          <div class="tab-list-item left">
            <span class="left">专辑共 {{topInfo.total_song_num}} 首</span>
          </div>
          <div class="tab-list-item right">
            <span class="right" @click='handlePlayAll'>全部播放</span>
          </div>
        </div>
      </div>
      <Scroll :data="songlist" :scrollY="true" :listenScroll="true" @scroll="onScroll" :probeType="3">
        <div>
          <div id='infos' class='infos'>
            <div class='singer-bg'>
              <img class='background' v-lazy='{src:topInfo.img,error:defaultImg,loading:defaultImg}'>
            </div>
            <div class='info-content'>
              <img class='min-avatar' v-lazy='{src:topInfo.img,error:defaultImg,loading:defaultImg}'>
              <div class='info'>
                <div class='name'>{{topInfo.name}}</div>
                <div ref="title" class='fans'>{{topInfo.singername}}</div>
                <div class='fans'>流派: {{topInfo.genre}} </div>
                <div class='fans'>发行时间: {{topInfo.aDate}}</div>
              </div>
            </div>
          </div>
          <div ref="tab" class='tab border-half-bottom'>
            <div class="tab-list">
              <div class="tab-list-item left">
                <span class="left">专辑共 {{topInfo.total_song_num}} 首</span>
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
  name: 'album-detail',
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

      mid: -1,
      fixed: false,
      songlist: [],
      topInfo: {},
      defaultImg: require('@/assets/images/album.png')
    }
  },
  mounted () {
    // 获取参数
    this.mid = this.$route.params.id
    this.headerTitle = this.$route.params.title
    // 获取当前页面高度
    this.getMusicList()
  },
  methods: {
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
    ...mapMutations([
      'playAll',
      'playBackType'
    ]),
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
          api: this.X.api.albumInfo,
          albummid: this.mid
        }
      }).then((res) => {
        let topInfo = res.data.topInfo
        topInfo.img = this.X.img(topInfo.mid, 2)
        this.topInfo = topInfo
        this.songlist = this.musicHander(res.data.songlist)
        // 吸顶效果
        this.tabTop = this.$refs.tab.getBoundingClientRect().top - 40
        this.title = this.$refs.title.getBoundingClientRect().top
      })
    },
    // 单曲数据处理
    musicHander (list) {
      let musicList = []
      list.forEach((item, index) => {
        musicList.push(this.X.song(item))
      })
      return musicList
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/common'
.menu-detail
  // padding 40px 0 10px 0
  position relative
  // left 0
  // right 0
  width 100%
  height 100%
  background $bgColor
  z-index 12

.infos{
  height: 230px;
  // margin-top 40px
  width: 100%;
  position relative
}
.infos .singer-bg{
  background: #353535;
  height: 100%;
  margin-bottom -40px
  -webkit-filter: blur(30px);
  filter: blur(30px);
  opacity: 0.4;
}
.infos .singer-bg .background{
  width: 100%;
  height: 100%;
}
.infos .info-content{
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  color: #ccc;
}
.infos .info-content .min-avatar{
  width: 120px;
  height: 120px;
  flex: 0 0 120px;
  margin: 25px 20px 25px 30px;
  background: #353535;
}
.infos .info-content .info{
  display: inline-block;
  margin: 25px 20px 0 0;
  flex: 1;
  height: 100px;
}
.infos .info-content .info .name{
  font-size: 18px;
  line-height: 1.2;
  padding: 10px 0;
  overflow: hidden;
  color: #ffcd32;
}
.infos .info-content .info .fans{
  font-size: 14px;
  line-height: 1.5
}

/* 导航 */
.tab{
  width: 100%;
  height 40px
  position: relative;

}
.tab .fixed{
  position: fixed;
  top: 40px;
  left: 0;
  z-index: 2;
  background: #252525;
  transition: background 0.5s ease;
}
.tab-list {
  background: transparent;
  transition: background 0.5s ease;
  width: 100%;
  display: flex;
  line-height: 40px;
  position: absolute;
  top: 0;
  left: 0
}
.tab-list .tab-list-item {
  font-size: 15px;
  font-weight 700
  flex: 1;
  color: rgba(255,255,255,0.5);
}
.tab-list .tab-list-item span{
  padding: 0 15px;
}
.tab-list .tab-list-item.left {
  text-align: left;
}
.tab-list .tab-list-item.right {
  text-align: right
}
</style>
