import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入Vant组件库
import Vant from 'vant'
// 导入Vant组件库样式
import 'vant/lib/index.css'
// 加载全局样式
import '@/style/index.less'
// 加载全局过滤器
import '@/utils/dayjs.js'
// 全局注册Vant组件
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
