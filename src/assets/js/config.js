const isDev = false
let host = isDev ? 'http://localhost:3000/api_qqmusic' : 'https://joozh.cn/api_qqmusic'

const config = {}
config.install = function (Vue) {
  Vue.prototype.X = {
    path: {
      u: host + '/u_common_url',
      c: host + '/c_common_url'
    },
    img: function (id, t = 1) {
      return `https://y.gtimg.cn/music/photo_new/T00${t}R800x800M000${id}.jpg?max_age=2592000`
    },
    api: {
      oldSingerList: `oldSingerList`,
      singerDetail: `singerDetail`,
      singerFance: `singerFance`,
      singerAlbum: `singerAlbum`,
      singerMv: `singerMv`,
      singerList: `singerList`,
      getMvInfo: `getMvInfo`,
      getMvUrl: `getMvUrl`,
      getMvOther: `getMvOther`,
      songLyric: `songLyric`,
      songPlayUrl: `songPlayUrl`,
      albumInfo: `albumInfo`,
      topList: `topList`,
      topListDetail: `topListDetail`,
      songMenuList: `songMenuList`,
      songMenuTags: `songMenuTags`,
      songMenuDetail: 'songMenuDetail',
      homeFocusImage: 'homeFocusImage',
      homeMvList: 'homeMvList'
    },
    song: function (item) {
      let obj = {}
      obj.singer = item.singer[0].name
      obj.songid = item.songid
      obj.songmid = item.songmid
      obj.songname = item.songname
      obj.filename = `C400${item.songmid}.m4a`
      obj.songImage = item.albummid
      obj.albumname = item.albumname
      obj.interval = time(item.interval)
      obj.longnumber = item.interval
      function time (interval) {
        let n = Math.floor(interval / 60)
        let m = interval % 60
        if (m < 10) {
          m = '0' + m
        }
        let time = `${n}:${m}`
        return time
      }
      return obj
    }
  }
}
module.exports = config
