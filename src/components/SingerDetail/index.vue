<template>
  <div>
    <div class="singer-detail">
      <Header :title="headerTitle" :show="true" :bg="fixed" :border="fixed"></Header>
      <div class="tab border-half-bottom" v-show="fixed">
        <div class="tab-list" :class="fixed ? 'fixed':''">
          <div class="tab-list-item" @click="tabChange(0)">
            <span :class="{'on':tabCurrent==0}">单曲 {{song_total}}</span>
          </div>
          <div class="tab-list-item" @click="tabChange(1)">
            <span :class="{'on':tabCurrent==1}">专辑 {{album_total}}</span>
          </div>
          <div class="tab-list-item" @click="tabChange(2)">
            <span :class="{'on':tabCurrent==2}">MV {{mv_total}}</span>
          </div>
        </div>
      </div>
      <Scroll ref="scroll" :data="listenData" :pullingUp="true" @pullingUp="onPullingUp" :type="'subPage'" :scrollY="true" :listenScroll="true" @scroll="onScroll" :probeType="3">
        <div>
          <div id='infos' class='infos'>
            <div class='singer-bg'>
              <img class='background' v-lazy='{src:singerInfo.singer_avatar,error:defaultImg,loading:defaultImg}'>
            </div>
            <div class='info-content'>
              <div class='info'>
                <div class='fans'>粉丝: {{singerInfo.singer_fance}} 万</div>
              </div>
            </div>
          </div>
          <div ref="tab" class="tab border-half-bottom">
            <div class="tab-list">
              <div class="tab-list-item" @click="tabChange(0)">
                <span :class="{'on':tabCurrent==0}">单曲 {{song_total}}</span>
              </div>
              <div class="tab-list-item" @click="tabChange(1)">
                <span :class="{'on':tabCurrent==1}">专辑 {{album_total}}</span>
              </div>
              <div class="tab-list-item" @click="tabChange(2)">
                <span :class="{'on':tabCurrent==2}">MV {{mv_total}}</span>
              </div>
            </div>
          </div>

          <div class="song-list" v-show="tabCurrent==2">
            <MvList :mvlist="mv.mvList"></MvList>
            <Loading v-if="mv.hasMore"></Loading>
          </div>
          <div class="album-list" v-show="tabCurrent==1">
            <AlbumList :albumList="album.albumList"></AlbumList>
            <Loading v-if="album.hasMore"></Loading>
          </div>
          <div class="mv-list" v-show="tabCurrent==0">
            <SongList :musicList="song.musicList"></SongList>
            <Loading v-if="song.hasMore"></Loading>
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Header from '@/comlayout/Header/index'
import Loading from '@/cominclude/Loading/index'
import SongList from '@/comview/SongList/index'
import MvList from '@/comview/MvList/index'
import AlbumList from '@/comview/AlbumList/index'
import Scroll from '@/cominclude/Scroll/index'

export default {
  name: 'singer-detail',
  components: {
    Header,
    Loading,
    SongList,
    MvList,
    AlbumList,
    Scroll
  },
  data () {
    return {
      listenData: [],
      headerTitle: '',
      fixed: false,
      song_total: 0,
      album_total: 0,
      mv_total: 0,
      tabCurrent: 0,

      mid: -1,
      song: {
        scroll: 0,
        hasMore: true,
        loaded: true,
        begin: 0,
        num: 30,
        musicList: []
      },
      mv: {
        scroll: 0,
        hasMore: true,
        loaded: true,
        begin: 0,
        num: 20,
        mvList: []
      },
      album: {
        scroll: 0,
        hasMore: true,
        loaded: true,
        begin: 0,
        num: 21,
        albumList: []
      },
      singerInfo: {
        singer_id: 0,
        singer_name: '',
        singer_avatar: '',
        singer_fance: 0
      },
      defaultImg: require('@/assets/images/singer.png')
    }
  },
  mounted () {
    // 获取参数
    this.mid = this.$route.params.mid
    this.headerTitle = this.$route.params.name
    // 获取当前页面高度
    this.getFance()
    this.getMusicList()
    this.getMv()
    this.getAlbum()
  },
  methods: {
    tabChange (tabCurrent) {
      this.tabCurrent = tabCurrent
    },
    onScroll (pos) {
      this.fixed = this.tabTop + pos.y <= 0
    },
    onPullingUp () {
      // console.log('到底')
      let timer = setTimeout(() => {
        if (this.tabCurrent === 0) {
          this.getMusicList()
        } else if (this.tabCurrent === 1) {
          this.getAlbum()
        } else if (this.tabCurrent === 2) {
          this.getMv()
        }
        clearTimeout(timer)
      }, 500)
    },
    // 获取粉丝
    getFance () {
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.singerFance,
          singermid: this.mid
        }
      }).then(fance => {
        this.singerInfo.singer_fance = (fance.data.num / 10000).toFixed(2)
      })
    },
    // 获取单曲数据
    getMusicList () {
      // 判断是否还能加载更多
      if (!this.song.hasMore) {
        return
      }
      // 或者正在加载数据
      if (!this.song.loaded) {
        return
      }
      this.song.loaded = false
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.singerDetail,
          order: 'listen',
          begin: this.song.begin,
          num: this.song.num,
          songstatus: 1,
          singermid: this.mid
        }
      }).then((res) => {
        // 处理数据
        let musicListArr = this.musicHander(res.data.list)
        // 判断是否还有分页加载数据
        if (!musicListArr.length || musicListArr.length < this.song.num) {
          this.song.hasMore = false
        }
        // 合并数组
        this.song.musicList = this.song.musicList.concat(musicListArr)
        this.listenData = this.song.musicList
        // 只加载一次
        if (this.song.begin === 0) {
          this.singerInfo.singer_name = res.data.singer_name
          this.singerInfo.singer_avatar = this.X.img(res.data.singer_mid)
          this.singerInfo.singer_id = res.data.singer_id
          this.song_total = res.data.total
          // 吸顶效果
          this.tabTop = this.$refs.tab.getBoundingClientRect().top - 40
        }
        // 设置分页加载数据
        this.song.begin = this.song.begin + this.song.num
        // 请求完毕
        this.song.loaded = true
      })
    },
    // 单曲数据处理
    musicHander (list) {
      let musicList = []
      list.forEach((item, index) => {
        musicList.push(this.X.song(item.musicData))
      })
      return musicList
    },
    // 获取mv
    getMv () {
      // 判断是否还能加载更多
      if (!this.mv.hasMore) {
        return
      }
      // 或者正在加载数据
      if (!this.mv.loaded) {
        return
      }
      this.mv.loaded = false
      this.axios.get(this.X.path.c, {
        params: {
          api: this.X.api.singerMv,
          order: 'listen',
          cid: 205360581,
          begin: this.mv.begin,
          num: this.mv.num,
          singermid: this.mid
        }
      }).then((res) => {
        let mvListArr = res.data.list
        mvListArr.forEach((item, index) => {
          let s = item.listenCount
          item.listenCount = (s / 10000).toFixed(2)
        })
        // 分页加载
        if (!mvListArr.length || mvListArr.length < this.mv.num) {
          this.mv.hasMore = false
        }
        // 合并数组
        this.mv.mvList = this.mv.mvList.concat(mvListArr)
        this.listenData = this.mv.mvList
        // 更新分页加载数据
        this.mv.begin = this.mv.begin + this.mv.num
        this.mv_total = res.data.total
        // 加载完毕
        this.mv.loaded = true
      })
    },
    // 获取专辑
    getAlbum () {
      // 判断是否还能加载更多
      if (!this.album.hasMore) {
        return
      }
      // 或者正在加载数据
      if (!this.album.loaded) {
        return
      }
      this.album.loaded = false
      this.axios.get(this.X.path.u, {
        params: {
          api: this.X.api.singerAlbum,
          param: {
            singermid: this.mid,
            begin: this.album.begin,
            num: this.album.num
          }
        }
      }).then((res) => {
        let albumListArr = res.data.list
        albumListArr.forEach((item, index) => {
          item.pic = this.X.img(item.album_mid, 2)
        })
        // 分页加载
        if (!albumListArr.length || albumListArr.length < this.album.num) {
          this.album.hasMore = false
        }
        // 合并数组
        this.album.albumList = this.album.albumList.concat(albumListArr)
        this.listenData = this.album.albumList
        // console.log(albumList)
        this.album.begin = this.album.begin + this.album.num
        this.album_total = res.data.total
        this.album.loaded = true
      })
    }
  }

}
</script>

<style lang="stylus" scoped>
@import '../../assets/css/common'
.singer-detail
  position relative
  width 100%
  height 100%
  background $bgColor
  z-index 12
.infos{
  height: 290px;
  width: 100%;
  position relative
  overflow hidden
}
.infos .singer-bg{
  background: #353535;
  // height:100%;
  // filter: blur(30px);
  opacity: 0.8;
  overflow: hidden;
  margin-top: -40px;
  margin-bottom -40px
}
.infos .singer-bg .background{
  width: 100%;
  /* height: 280px; */
}
.infos .info-content{
  position: absolute;
  top: 0;
  bottom 0;
  right 0;
  left: 0;
  width: 100%
  display: flex;
  /* display: none; */
}
.infos .info-content .min-avatar{
  width: 100px;
  height: 100px;
  flex: 0 0 100px;
  border-radius: 50%;
  margin: 25px;
  background: #353535;
}
.infos .info-content .info{
  display:flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
}
.infos .info-content .info .name{
  font-size: 14px;
  line-height: 2.5;
  height: 30px;
  overflow: hidden;
}
.infos .info-content .info .fans{
  display: inline-block;
  padding: 2px 15px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0,0,0,0.8);
  background: rgba(255,205,50,0.8);
  border-radius: 50px;
}

/* 导航 */
.tab{
  width: 100%;
  height 40px;
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
  border-bottom: 1rpx solid #202020;
  text-align: center;
  line-height: 40px;
  position: absolute;
  top: 0;
  left: 0
}
.tab-list .tab-list-item {
  font-size: 14px;
  flex: 1;
  color: rgba(255,255,255,0.5);
}
.tab-list .tab-list-item .on {
  color: #ffcd32;
}
</style>
