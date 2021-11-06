<template>
  <div class="article-container">
    <van-nav-bar
  title="文章详情"
  class="app-nav-bar"
  left-arrow
  @click-left="$router.back()"
/>
<div class="container">
  <h1 class="title">{{article.title}}</h1>
<van-cell center class="user-info">
  <div slot="title" class="name">{{article.aut_name}}</div>
<van-image
   slot="icon"
   class="avatar"
   round
   fit="cover"
  :src="article.aut_photo"
/>
<div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
<van-button class="follow-btn" :icon="article.is_followed ? '' :'plus'" :type="article.is_followed ? 'default' :'info'" round size="small" @click="onFollow">{{article.is_followed ? '已关注' :'关注'}}</van-button>
</van-cell>
<div class="markdown-body" v-html="article.content" ref="article-content">
</div>
<!-- 文章评论列表 -->
<comment-list :source="articleId" :list="commentList"></comment-list>
<!-- /文章评论列表 -->
</div>
<!-- 底部区域 -->
<div class="article-bottom">
  <van-button class="commnet-btn" type="default" round size="small" @click="isPostshow=true">写评论</van-button>
  <van-icon name="comment-o"  color="#777"></van-icon>
  <van-icon :name="article.is_collected ? 'star': 'star-o'"  :color="article.is_collected ? 'orange' :'#777'" @click="onCollect"></van-icon>
  <van-icon :name="article.attitude ===1 ? 'good-job' :'good-job-o'"  :color="article.attitude ===1 ? 'red' :'#777'" @click="onLike"></van-icon>
  <van-icon name="share"  color="#777"></van-icon>
</div>
<!-- 发布评论 -->
<van-popup v-model="isPostshow" position="bottom">
  <post-comment :target="articleId" @post-success="onPostSuccess"></post-comment>
</van-popup>
  </div>
</template>

<script>
import '@/views/article/github-markdonw.css'
import { getArticle } from '@/api/article.js'
import { addFollow, deleteFollow, addCollect, deleteCollect, addLike, deleteLike } from '@/api/user.js'
import { ImagePreview } from 'vant'
import { mapState } from 'vuex'
import CommentList from '@/views/article/components/comment-list.vue'
import PostComment from '@/views/article/components/post-comment.vue'
export default {
  name: 'ArticleIndex',
  components: {
    CommentList,
    PostComment
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据
      isFollowLoading: false, // 关注按钮的loading状态
      isCollectLoading: false, // 收藏按钮的loading状态
      isPostshow: false,
      commentList: [] // 文章评论列表
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async  loadArticle () {
      const { data: res } = await getArticle(this.articleId)
      this.article = res.data
      this.$nextTick(() => {
        this.perviewImage()
      })
    },
    // 处理图片预览
    perviewImage () {
      // 获取文章内容DOM容器
      const articleContent = this.$refs['article-content']

      // 得到所有img标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    // 关注/取消关注
    async onFollow () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      try {
        if (this.article.is_followed) {
        // 已关注，取消关注
          await deleteFollow(this.article.aut_id)
        } else {
        // 没有关注，添加关注
          await addFollow(this.article.aut_id)
          // 更新视图
        }
        this.article.is_followed = !this.article.is_followed
        this.$toast.success(`${this.article.is_followed ? '' : '取消'}关注成功`)
      } catch (err) {
        if (err.response.status === 401) {
          this.$toast('请登录')
        }
      }
    },
    // 收藏
    async onCollect () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      try {
        if (this.article.is_collected) {
        // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
        // 没有收藏，添加收藏
          await addCollect(this.articleId)
          // 更新视图
        }
        this.article.is_collected = !this.article.is_collected
        this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
      } catch (err) {
        if (err.response.status === 401) {
          this.$toast('请登录')
        }
      }
    },
    // 点赞
    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      try {
        if (this.article.attitude === 1) {
        // 已点赞，取消点赞
          await deleteLike(this.articleId)
          this.article.attitude = -1
        } else {
        // 没有点赞，添加点赞
          await addLike(this.articleId)
          this.article.attitude = 1
          // 更新视图
        }

        this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
      } catch (err) {
        if (err.response.status === 401) {
          this.$toast('请登录')
        }
      }
    },
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.isPostshow = false
    }

  }
}
</script>

<style scoped lang="less">
.article-container{
   .container{
    background-color: #fff;
    position: fixed;
   left: 0;
   right: 0;
   bottom: 44px;
   top: 46px;
   overflow-y: auto;
   }
}
.title{
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;

}
.user-info{
  .avatar{
     width: 35px;
      height: 35px;
     margin-right:8px
  }

  .name{
    font-size:12px;
    color: #333;
  }
  .pubdate{
    font-size:11px;
    color:#b4b4b4
  }
.follow-btn{
  width: 85px;
  height: 29px;
}
}
.markdown-body{
  padding: 14px;
}
.article-bottom{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .commnet-btn{
      width: 150px;
    }
}

</style>
