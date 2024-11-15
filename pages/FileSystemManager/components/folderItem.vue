<template>
  <view
    class="folder-item"
    :class="[
      item.volumeType ? (item.volumeType === '1' ? 'is-volume internal' : 'is-volume external') : ''
    ]"
  >
    <view class="icon-view"></view>
    <view class="content-box">
      <view class="name">{{ item.name }}</view>
      <view class="desc" v-if="!item.volumeType">
        <view class="type item">文件夹</view>
        <view class="date item">{{ item.dateTime }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineOptions({
  name: 'FolderItem'
})
defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.folder-item {
  padding: 10rpx;
  background: #fff;
  margin: 10rpx 0;
  display: flex;
  align-items: center;
  height: 140rpx;
  box-sizing: border-box;
  &.is-volume {
    &.internal {
      background: url('/static/internal-volume.png') no-repeat;
      background-size: 100% 100%;
    }
    &.external {
      background: url('/static/external-volume.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .icon-view {
    width: 80rpx;
    height: 80rpx;
    background: url('/static/folder.png') no-repeat;
    background-size: 100% 100%;
  }
  .content-box {
    padding-left: 10rpx;
    width: calc(100% - 80rpx);
    box-sizing: border-box;
    .name {
      font-size: 18px;
      font-weight: bold;
      width: 100%;
      padding-left: 10px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-bottom: 5rpx;
    }
    .desc {
      font-size: 12px;
      display: flex;
      align-items: center;
      color: #909399;
      .item {
        padding: 0 10rpx;
        &.date {
          border-left: 1px solid #dcdfe6;
        }
      }
    }
  }
}
</style>
