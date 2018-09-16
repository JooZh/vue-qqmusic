import NavComponent from './navigation'
export default {
  install: (Vue, { router, store, tabbar, common = '' } = {}) => {
    if (!router || !store || !tabbar) {
      console.error('vue-navigation need options: router, tabbar and store')
      return
    }
    const bus = new Vue()
    // 注册一个store模块
    store.registerModule('navigation', {
      state: {
        direction: 'forward'
      },
      mutations: {
        'updateDirection' (state, payload) {
          state.direction = payload.direction
        }
      }
    })
    // 返回和前进管理
    window.sessionStorage.clear()
    window.sessionStorage.setItem('count', 0)
    window.sessionStorage.setItem('/', 0)
    common && window.sessionStorage.setItem(common, 99999)
    let isPush = false
    let endTime = Date.now()
    let methods = ['push', 'go', 'replace', 'forward', 'back']
    document.addEventListener('touchend', () => {
      endTime = Date.now()
    })
    methods.forEach(key => {
      let method = router[key].bind(router)
      router[key] = function (...args) {
        isPush = true
        method.apply(null, args)
      }
    })

    router.beforeEach(function (to, from, next) {
      const toIndex = Number(window.sessionStorage.getItem(to.path))
      const fromIndex = Number(window.sessionStorage.getItem(from.path))
      // 进入新路由 判断是否为tabBar
      let find = tabbar.findIndex(item => item === to.path)
      // 去向不是tabBar
      if (find === -1) {
        if (toIndex) {
          // 判断是否为返回 否
          if ((toIndex > fromIndex)) {
            bus.$emit('forward', 'forward')
            store.commit('updateDirection', {direction: 'forward'})
          } else {
            // 判断是否是ios左滑返回
            if (!isPush && (Date.now() - endTime) < 377) {
              bus.$emit('reverse', '')
              store.commit('updateDirection', {direction: ''})
            } else {
              bus.$emit('reverse', 'reverse')
              store.commit('updateDirection', { direction: 'reverse' })
            }
          }
        } else {
          let count = ++window.sessionStorage.count
          window.sessionStorage.setItem('count', count)
          window.sessionStorage.setItem(to.path, count)
          bus.$emit('forward', 'forward')
          store.commit('updateDirection', {direction: 'forward'})
        }
        // 判断是不是外链
        if (/\/http/.test(to.path)) {
          let url = to.path.split('http')[1]
          window.location.href = `http${url}`
        } else {
          next()
        }
      } else {
        // 判断是否是ios左滑返回
        if (!isPush && (Date.now() - endTime) < 377) {
          bus.$emit('reverse', '')
          store.commit('updateDirection', {direction: ''})
        } else {
          bus.$emit('reverse', 'reverse')
          store.commit('updateDirection', { direction: 'reverse' })
        }
        next()
      }
    })

    router.afterEach(function () {
      isPush = false
    })

    Vue.component('navigation', NavComponent(bus, tabbar))
    Vue.navigation = Vue.prototype.$navigation = {
      on: (event, callback) => {
        bus.$on(event, callback)
      }
    }
  }
}
