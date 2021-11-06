<template>
  <div class="article-list">
<van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh"  :success-text="refreshSuccessText" :success-duration="1500">
  <van-list
   v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
<article-item v-for="(item,index) in articles" :key="index" :article="item"></article-item>
</van-list>
</van-pull-refresh>

  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item/index.vue'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的事件戳
      isRefreshLoading: false, // 下拉刷新的isLoading状态
      refreshSuccessText: '' // 下刷新成功的提示文本

    }
  },
  methods: {
    async onLoad () {
      const { data: res } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      const { results } = res.data
      this.articles.push(...results)
      this.loading = false

      if (results.length) {
        this.timestamp = res.data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    async onRefresh () {
      const { data: res } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const { results } = res.data
      this.articles.unshift(...results) // 往顶部追加数据
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}

</script>

<style lang="less" scoped>
.article-list{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow: auto;
}
</style>
