<template>
  <div class="home-container">
    <!-- 搜索按钮 -->
   <van-nav-bar
  class="app-nav-bar"
>
<van-button class="search-btn" slot="title" icon="search" type="info" round size="small" to="/search">搜索</van-button>
</van-nav-bar>
<!-- /搜索按钮 -->
<!-- Tab 标签页 -->
<van-tabs class="channle-tabs" v-model="active" >
  <van-tab  :title="item.name" v-for="item in channels" :key="item.id">
    <article-list :channel="item" />
  </van-tab>
  <!-- 汉堡按钮 -->
  <div slot="nav-right" class="wap-nav-placeholder"></div>
  <div slot="nav-right" @click="isChannelEditShow=true" class="wap-nav-wrap">
    <van-icon name="wap-nav" />
  </div>
  <!-- /汉堡按钮 -->
</van-tabs>
<!-- /Tab 标签页 -->
<!-- 频道弹出层 -->
<van-popup get-container="body" v-model="isChannelEditShow" position="bottom" closeable   close-icon-position="top-left" class="channel-edit-popup" >
  <!-- 模板中的$event表示事件参数 -->
<channel-edit :user-channels="channels" :active="active" @close="isChannelEditShow=false" @update-active="active=$event"></channel-edit>
</van-popup>
<!-- /频道弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user.js'
import ArticleList from '@/views/home/components/article-list.vue'
import ChannelEdit from '@/views/home/components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道的显示状态
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的列表数据
        const { data: res } = await getUserChannels()
        channels = res.data.channels
      } else {
        // 没有登录，判断有没有本地存储的列表数据
        const localChannel = getItem('user-channels')
        // 如果有本地存储的列表则使用
        if (localChannel) {
          channels = localChannel
        } else {
          // 用户没有登录，也没有本地存储频道，就请求获取默认推荐的频道列表
          const { data: res } = await getUserChannels()
          channels = res.data.channels
        }
      }
      // 把处理好的数据保存到data
      this.channels = channels
    }

  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
body{
  .channel-edit-popup{
    height: 100%;
  }
}
.home-container {
 /deep/ .van-nav-bar__title{
    max-width:none;
  }
  .search-btn{
    background: #5babfb;
    width: 277px;
    height: 32px;
    border: none;
    .van-icon{font-size: 16px;}
    .van-button__text{
      font-size:14px;

    }
  }
  .channle-tabs{
   /deep/ .van-tab{
      border-bottom:1px solid #edeff3
    }
    /deep/.van-tabs__line{
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background-color:#3296fa;
    }
  }
  .wap-nav-placeholder{
    width: 25px;
    flex-shrink: 0;
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    display: flex;
    justify-content:center;
    align-items: center;
     border-bottom:1px solid #edeff3;
    opacity: .9;
    .van-icon{
      font-size: 24px;
    }
     &:before {
      content: '';
      width: 1px;
      height: 43px;
      background: url('./gradient-gray-line.png') no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;

    }
  }

}
</style>
