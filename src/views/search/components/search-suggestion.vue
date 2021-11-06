<template>
  <div class="search-suggestion">
    <van-cell  icon="search" v-for="(str,index) in suggestions" :key="index"  @click="$emit('search',str)">
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search.js'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表

    }
  },
  watch: {
    // 属性名：要监视数据的名称
    searchText: {
      // 当数据发生变化则会执行handler处理函数
      handler: debounce(async function () {
        // 请求获取数据
        const { data: res } = await getSearchSuggestion(this.searchText)
        this.suggestions = res.data.options
      }, 200),
      immediate: true
      // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    highlight (str) {
      // RegExp是正则表达式的构造函数
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(reg, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style>

</style>
