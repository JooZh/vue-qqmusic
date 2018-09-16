// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import lazyload from 'vue-lazyload'
import VnodeCache from 'vue-app-effect'
import NProgress from 'nprogress'
import { Icon } from 'iview'
import { Alert, Confirm, Toast } from 'wc-messagebox'
import FastClick from 'fastclick'

import router from './router'
import store from './store/index'

import 'iview/dist/styles/iview.css'
import 'wc-messagebox/style.css'
import 'nprogress/nprogress.css'

import '@/assets/css/normalize.css'
import '@/assets/css/reset.css'
import '@/assets/css/animate.css'
import '@/assets/css/font-awesome.css'

import config from '@/assets/js/config'

// 简单的手势插件
import directives from '@/assets/js/touch'

Vue.config.productionTip = false

FastClick.attach(document.body)
NProgress.configure({ showSpinner: false })

// router为路由文件 store 为
Vue.use(VnodeCache, {
  router,
  store,
  tabbar: ['/recomment', '/ranking', '/menu', '/about', '/singer'],
  common: '/player'
})

// 挂载私有属性 mX 开头的
Vue.use(config)
// 挂载lazyload
Vue.use(lazyload)
// Vue.use(iView)
Vue.use(VueAxios, axios)
Vue.use(Alert)
Vue.use(Confirm)
Vue.use(Toast)
Vue.component('Icon', Icon)

directives(Vue)

// 处理 vm.$nextTick() 方法
function noop () {}
window.MessageChannel = noop
window.setImmediate = noop

// 监听页面刷新
window.addEventListener('load', () => {
  router.push({path: '/'})
})
// 进度条使用
router.beforeEach(function (to, from, next) {
  NProgress.start()
  next()
})
router.afterEach(function (to) {
  NProgress.done()
})

// 简单的历史记录管理
// const history = window.sessionStorage
// history.clear()
// let historyCount = history.getItem('count') * 1 || 0
// history.setItem('/', 0)
// history.setItem('/player', 9999)
// let isPush = false
// let endTime = Date.now()
// let methods = ['push', 'go', 'replace', 'forward', 'back']

// document.addEventListener('touchend', () => {
//   endTime = Date.now()
// })
// methods.forEach(key => {
//   let method = router[key].bind(router)
//   router[key] = function (...args) {
//     isPush = true
//     method.apply(null, args)
//   }
// })
// let paths = ['/recomment', '/ranking', '/menu', '/home', '/singer', '/']
// // let bus = new Vue()

// router.beforeEach(function (to, from, next) {
//   // 重载 清空历史记录
//   NProgress.start()
//   const toIndex = Number(history.getItem(to.path))
//   const fromIndex = Number(history.getItem(from.path))
//   // 进入新路由 判断是否为tabBar
//   let find = paths.findIndex(item => item === to.path)
//   // 去向不是tabBar
//   if (find === -1) {
//     if (toIndex) {
//       // 判断是否为返回 否
//       if ((toIndex > fromIndex)) {
//         bus.$emit('forward')
//         console.log('前进')
//         store.commit('updateDirection', {direction: 'forward'})
//       } else {
//         // bus.$emit('reverse')
//         // console.log('返回')
//         // 判断是否是ios左滑返回
//         if (!isPush && (Date.now() - endTime) < 377) {
//           store.commit('updateDirection', {direction: ''})
//         } else {
//           store.commit('updateDirection', { direction: 'reverse' })
//         }
//       }
//     } else {
//       // console.log('前进')
//       // bus.$emit('forward')
//       ++historyCount
//       history.setItem('count', historyCount)
//       history.setItem(to.path, historyCount)
//       store.commit('updateDirection', {direction: 'forward'})
//     }
//     // 判断是不是外链
//     if (/\/http/.test(to.path)) {
//       let url = to.path.split('http')[1]
//       window.location.href = `http${url}`
//     } else {
//       next()
//     }
//   } else {
//     // bus.$emit('reverse')
//     // 判断是否是ios左滑返回
//     if (!isPush && (Date.now() - endTime) < 377) {
//       store.commit('updateDirection', {direction: ''})
//     } else {
//       store.commit('updateDirection', { direction: 'reverse' })
//     }
//     next()
//   }
// })

// router.afterEach(function (to) {
//   isPush = false
//   NProgress.done()
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
