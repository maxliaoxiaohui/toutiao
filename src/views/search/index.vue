<template>
  <div class="search-container">
<!-- 搜索栏 -->
<form action="/">
<van-search v-model="searchText" placeholder="请输入搜索关键词" show-action background="#5babfb" @search="onSearch(searchText)"
    @cancel="$router.back()" @focus='isResultshow=false' />
</form>
<!-- /搜索栏 -->
<!-- 搜索结果 -->
<search-result v-if="isResultshow" :search-text="searchText"></search-result>
<!-- /搜索结果 -->

<!-- 联想建议 -->
<search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"></search-suggestion>
<!-- /联想建议 -->

<!-- 历史记录 -->
<search-history v-else :search-histories="searchHistories" @search="onSearch" @update-histories="searchHistories=$event"></search-history>
<!-- /历史记录 -->

  </div>
</template>

<script>
import SearchSuggestion from '@/views/search/components/search-suggestion.vue'
import SearchHistory from '@/views/search/components/search-history.vue'
import SearchResult from '@/views/search/components/search-results.vue'
import { setItem, getItem } from '@/utils/storage.js'
// import { getUserhisteries } from '@/api/search.js'
import { mapState } from 'vuex'
export default {
  name: 'Searchindex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data () {
    return {

      searchText: '',
      isResultshow: false, // 控制搜索结果的显示状态
      searchHistories: [] // 搜索历史数据
    }
  },
  watch: {
    // 监视搜索历史的变化，存储到本地存储
    searchHistories () {
      setItem('search-histeries', this.searchHistories)
    }
  },
  created () {
    this.loadSearchHistories()
  },
  methods: {
    onSearch (searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复的删除
        this.searchHistories.splice(index, 1)
      }
      // 把最新的历史搜索记录放到顶部
      this.searchHistories.unshift(searchText)

      // 如果用户用户已登录则把历史记录存储在线上

      // 没有登录存储在本地
      // setItem('search-histeries', this.searchHistories)
      this.isResultshow = true
    },
    async loadSearchHistories () {
      const SearchHistories = getItem('search-histeries') || []
      // if (this.user) {
      //   const { data: res } = await getUserhisteries()
      //   SearchHistories = [...new Set([...SearchHistories, ...res.data.keywords])]
      // }
      this.searchHistories = SearchHistories
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.search-container{
  .van-search__action{
  color: #fff;
}
}

</style>
