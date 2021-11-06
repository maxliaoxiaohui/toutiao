<template>
  <div class="search-history">
    <van-cell title="搜索历史" >
      <div v-if="isDeleteShow">
       <span @click="$emit('update-histories',[])">全部删除</span>
      &nbsp;
      <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon @click="isDeleteShow=true" v-else name="delete-o" />
    </van-cell>
    <van-cell :title="history" v-for="(history,index) in searchHistories" :key="index" @click="onDelete(history,index)">
  <van-icon v-show="isDeleteShow" name="close" />
    </van-cell>
  </div>
</template>

<script>

export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  methods: {
    onDelete (history, index) {
      // 如果是删除状态,则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // setItem('search-histeries', this.searchHistories)
        return
      }
      // 非删除状态展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style>

</style>
