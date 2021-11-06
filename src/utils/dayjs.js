import Vue from 'vue'
// 初始化dayjs相关配置
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用相对时间
dayjs.extend(relativeTime)
// 配置使用中文语言包
dayjs.locale('zh-cn')

// 把处理时间的代码包装为全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})
Vue.filter('dateTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
