import Vue from 'vue'
import Router from 'vue-router'

import TabCon from '@/comlayout/TabCon/index'
// import SubCon from '@/comlayout/SubCon/index'
import Recomment from '@/components/Recomment/index'
import Ranking from '@/components/Ranking/index'
import SingerList from '@/components/SingerList/index'
import About from '@/components/About/index'
import MenuList from '@/components/MenuList/index'
import RoutePlayer from '@/components/RoutePlayer/index'
import MvPlayer from '@/components/MvPlayer/index'

// 需要被继承的组件
import MenuDetail from '@/components/MenuDetail/index'
import SingerDetail from '@/components/SingerDetail/index'
import AlbumDetail from '@/components/AlbumDetail/index'
import RankingDetail from '@/components/RankingDetail/index'

Vue.use(Router)

Router.prototype.extends = {
  RankingDetail,
  SingerDetail,
  AlbumDetail,
  MenuDetail
}
export default new Router({
  routes: [{
    path: '/',
    component: TabCon,
    redirect: '/recomment',
    children: [ {
      path: '/recomment',
      name: '/recomment',
      component: Recomment
    }, {
      path: '/singer',
      name: '/singer',
      component: SingerList
    }, {
      path: '/ranking',
      name: '/ranking',
      component: Ranking
    }, {
      path: '/menu',
      name: '/menu',
      component: MenuList
    }, {
      path: '/about',
      name: '/about',
      component: About
    }]
  }, {
    path: '/player',
    name: '/player',
    component: RoutePlayer
  }, {
    path: '/mvplayer',
    name: '/mvplayer',
    component: MvPlayer
  }]
})
// 以下用动态路由方式实现
// {
//   path: '/singerdetail/:mid',
//   name: '/singerdetail',
//   component: {extends: SingerDetail}
// }, {
//   path: '/albumdetail',
//   name: '/albumdetail',
//   component: AlbumDetail
// }, {
//   path: '/rankingdetail',
//   name: '/rankingdetail',
//   component: RankingDetail
// }, {
//   path: '/menudetail',
//   name: '/menudetail',
//   component: MenuDetail
// }
