<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
<comment-item v-for="(item,index) in list" :key="index" :comment="item"></comment-item>
</van-list>
  </div>
</template>

<script>
import { getcomments } from '@/api/comment.js'
import CommentItem from '@/views/article/components/comment-item.vue'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      // 数组或对象的默认值必须通过函数返回
      default: () => []

    }
  },
  components: {
    CommentItem
  },

  data () {
    return {

      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  methods: {
    async onLoad () {
      const { data: res } = await getcomments({ type: 'a', source: this.source, offset: this.offset, limit: this.limit })
      const { results } = res.data
      this.list.push(...results)
      this.loading = false
      if (results.length) {
        // 如果还有数据
        this.offset = res.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}

</script>

<style lang="less" scoped>

</style>
