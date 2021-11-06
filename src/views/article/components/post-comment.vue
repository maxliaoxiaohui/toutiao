<template>
  <div class="post-comment">
    <van-field
  v-model="message"
  autosize
  type="textarea"
  maxlength="50"
  placeholder="请输入评论"
  show-word-limit
/>
<van-button size="small" @click="onPost" :disabled="!message">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'PostComment',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: null
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true
      })
      try {
        const { data: res } = await addComment({
          target: this.target,
          content: this.message,
          art_id: this.articleId ? this.articleId : null
        })
        this.$emit('post-success', res.data.new_obj)
        this.$toast.success('发布成功')
        this.message = ''
      } catch (err) {
        if (err.response.status === 401) {
          this.$toast.fail('请登录')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.post-comment{
  padding: 14px;
  display: flex;
  align-items: center;
}
</style>
