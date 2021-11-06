<template>
  <div class="channel-edit">
    <van-cell center :border="false">
     <div slot="title" class="channel-title">我的频道</div>
     <van-button type="danger" plain round size="small" @click="isEdit=!isEdit">{{isEdit ? '完成' :'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
  <van-grid-item class="grid-item" :class="{active:index===active}" v-for="(item,index) in UserChannels" :key="index" :icon="(isEdit && index!==0) ? 'clear' : ''"  :text="item.name" @click="onuserChannelClick(item,index)" />
</van-grid>

<van-cell center :border="false">
     <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
  <van-grid-item  class="grid-item" v-for="(item,index) in recommendChannels" :key="index"  :text="item.name" @click="onAdd(item)"/>
</van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  props: {
    UserChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道数据
      isEdit: false// 控制编辑的显示状态
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async   loadAllChannels () {
      const { data: res } = await getAllChannels()
      this.allChannels = res.data.channels
    },
    async onAdd (item) {
      this.UserChannels.push(item)
      // 数据持久化
      if (this.user) {
        await addUserChannel({
          channels: [
            { id: item.id, seq: this.UserChannels.length }
          ]
        })
        // 登录了，数据存储在线上
      } else {
        // 未登录储存在本地
        setItem('user-channels', this.UserChannels)
      }
    },
    onuserChannelClick (item, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态
        this.deleteChannel(item, index)
      } else {
        // 非编辑状态
        this.switchChannel(index)
      }
    },
    async deleteChannel (item, index) {
      // 删除频道
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        // 更新激活频道的索引
        this.$emit('update-active', this.active - 1)
      }
      this.UserChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        await deleteUserChannel(item.id)
      } else {
        setItem('user-channels', this.UserChannels)
      }
    },
    switchChannel (index) {
      // 切换频道
      this.$emit('update-active', index)
      // 关闭弹出层
      this.$emit('close')
      // 数据持久化
    }
  },
  computed: {
    // 推荐的判断列表
    ...mapState(['user']),
    recommendChannels () {
      // filter方法 过滤数据，根据方法返回布尔值true来收集数据
      // filter方法查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断channel是否属于用户频道
        // find 方法 查找满足条件的单个元素
        return !this.UserChannels.find(UserChannel => {
          // 找到满足条件的元素
          return UserChannel.id === channel.id
        })
      })
    }

  }
}
</script>

<style lang="less" scoped>
.channel-edit{
  padding-top: 54px;
  .channel-title{
    font-size: 16px;
    color: #333333;
  }
  .grid-item{
    width: 80px;
    height: 43px;
   /deep/ .van-grid-item__content{
      background-color: #f4f5f6;
       .van-grid-item__text{
         margin-top:0;
        font-size: 12px;
        color: #222;
      }
      }
   /deep/.van-grid-item__icon{
  position:absolute;
  right: -5px;
  top: -5px;
  font-size: 20px;
  color: #ccc;
  }
  }
.active{
 /deep/ .van-grid-item__text{
  color: red !important
  }

}
}
</style>
