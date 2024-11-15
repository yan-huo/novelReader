<template>
  <view class="page-container">
    <uni-nav-bar
      class="custom-nav-bar"
      title="书架"
      height="80rpx"
      backgroundColor="#007AFF"
      status-bar
      color="#fff"
      :border="false"
    ></uni-nav-bar>
    <view class="container-main">
      <s-pull-scroll
        class="pull-scroll-custom-back-top"
        :fixed="false"
        back-top
        ref="pullScrollRef"
        :pullDown="pullDown"
        :pullUp="loadData"
      >
        <view class="list-box">
          <view class="item-box" v-for="item in list">
            <view class="item-content" @click="handleToBookReader(item)">
              <view class="book-cover">
                <view
                  class="cover-img"
                  :style="{
                    background: `linear-gradient(to bottom right, ${item.backgroundColor}, ${item.backgroundColor}99)`
                  }"
                >
                  <view class="cover-bg"></view>
                </view>
                <view class="cover-name">{{ item.name }}</view>
              </view>
              <view class="book-name">
                <view class="name">{{ item.name }}.txt</view>
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
import sPullScroll from '@/components/s-pull-scroll/index.vue'
import { getBookPage } from '../../../apiService'

defineOptions({
  name: 'Bookshelf'
})
const pullScrollRef = ref()
const list = ref([])
const handleAddBook = () => {
  uni.navigateTo({
    url: '/pages/FileSystemManager/folderFiles'
  })
}
const handleToBookReader = (item) => {}
const refresh = () => {
  nextTick(() => {
    pullScrollRef.value.refresh()
  })
}
const pullDown = (pullScroll) => {
  setTimeout(() => {
    loadData(pullScroll)
  }, 200)
}
const loadData = (pullScroll) => {
  if (pullScroll.page === 1) {
    list.value = []
  }
  pullScroll.success()
  getBookPage({ pageNo: pullScroll.page, pageSize: 12 }).then((data) => {
    list.value = list.value.concat(
      data.rows.map((item) => {
        if (item.pagesNumber) {
          item.percentage = Number(((item.progressPageNumber / item.pagesNumber) * 100).toFixed(1))
        } else {
          item.percentage = 0
        }
        return item
      })
    )
    console.log(list.value)
    pullScroll.success()
    if (!data.hasNext) {
      pullScroll.finish()
    }
  })
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
          height: 80%;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid rgba(191, 192, 194, 0.7);

          .cover-img {
            width: 100%;
            height: calc(100% - 60rpx);
            box-sizing: border-box;
            .cover-bg {
              height: 100%;
              width: 100%;
              box-sizing: border-box;
              background-image: url('/static/book-cover.png');
              background-size: 100% 100%;
            }
          }

          .cover-name {
            font-size: 12px;
            height: 60rpx;
            line-height: 60rpx;
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
          height: 20%;
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
            font-size: 12px;
            color: #909399;
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
