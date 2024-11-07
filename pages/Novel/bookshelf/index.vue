<template>
	<view class="page-container">
    <cover-view class="custom-nav-bar">
      <uni-nav-bar title="书架" height="60rpx" backgroundColor="#007AFF" color="#fff" :border="false"></uni-nav-bar>
    </cover-view>
    <view class="container-main">
      <s-pull-scroll class="pull-scroll-custom-back-top" :fixed="false" back-top ref="pullScrollRef" :pullDown="pullDown" :pullUp="loadData">
        <view class="list-box">
          <view class="item-box" v-for="item in list">
            <view class="item-content">
              <view class="book-cover">
                <view class="cover-img"></view>
                <view class="cover-name">名称名称名称名称名称名称名称名称名称名称名称名称</view>
              </view>
              <view class="book-name">
                <view class="name">{{item.id}}.txt</view>
                <view class="progress">
                  <uni-icons type="info" size="16"></uni-icons>
                  <view>15.5%</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </s-pull-scroll>
    </view>
    <button class="add-btn" type="primary" @click="handleAddBook">
      <uni-icons type="plusempty" size="30" color="#fff"></uni-icons>
    </button>
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import sPullScroll from "@/components/s-pull-scroll/index.vue";
defineOptions({
  name: 'Bookshelf'
});
const pullScrollRef = ref()
const list = ref([])
const handleAddBook = () => {
  console.log('add book')
}
const refresh = () => {
  nextTick(() => {
    pullScrollRef.value.refresh();
  });
}
const pullDown = (pullScroll) => {
  setTimeout(() => {
    loadData(pullScroll);
  }, 200);
}
const loadData = (pullScroll) => {
  if (pullScroll.page === 1) {
    list.value = [];
  }
  setTimeout(() => {
    const newList = {
      rows: [],
      hasNext: true
    }
    for (let i = 0; i < 12; i++) {
      newList.rows.push({
        id: Date.now()
      })
    }
    list.value = list.value.concat(newList.rows);
    if (list.value.length > 50) {
      newList.hasNext = true;
    }
    pullScroll.success();
    if (!newList.hasNext) {
      pullScroll.finish();
    }
  }, 1000)
  return
  getIscWorkWorkPlanPage({
    pageSize: 12,
    pageNo: pullScroll.page
  }).then((newList) => {
    list.value = list.value.concat(newList.rows);
    pullScroll.success();
    if (!newList.hasNext) {
      pullScroll.finish();
    }
  });
}
onMounted(() => {
  refresh()
})
</script>

<style lang="scss" scoped>
.page-container {
  .list-box {
    padding: 15rpx;
    display: flex;
    flex-wrap: wrap;
    .item-box {
      width: 33.3333%;
      flex-shrink: 0;
      height: 380rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      .item-content {
        height: 360rpx;
        width: 210rpx;
        box-sizing: border-box;
        .book-cover {
          height: 75%;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid rgba(191, 192, 194, 0.7);
          .cover-img {
            width: 100%;
            height: calc(100% - 50rpx);
            box-sizing: border-box;
            background-image: url("static/book-cover.png");
            background-size: 100% 100%;
            background-color: #ff5a5f;
          }
          .cover-name {
            font-size: 12px;
            height: 50rpx;
            line-height: 50rpx;
            padding-left: 10rpx;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #000;
            font-weight: bold;
          }
        }
        .book-name {
          height: 25%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 12px;
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            color: #000;
            font-weight: bold;
            padding-bottom: 2rpx;
          }
          .progress {
            display: flex;
            align-items: center;
            font-size: 10px;
            color: #333;
            padding-top: 2rpx;
          }
        }
      }
    }
  }
  .add-btn {
    padding: 20rpx;
    border: none;
    line-height: unset;
    border-radius: 50%;
    position: fixed;
    right: 20rpx;
    bottom: calc(var(--window-bottom) + 140rpx);
  }
}
</style>
<style>
.pull-scroll-custom-back-top .default-back-top {
  right: 30rpx !important;
}
</style>