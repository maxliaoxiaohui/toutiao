import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'
Vue.use(Vuex)

const USER_KEY = 'toutao-user'
export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY) // 当前登录用户的登录状态(token等数据)

  },
  mutations: {
    setuser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，要把数据放到本地存储中
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
