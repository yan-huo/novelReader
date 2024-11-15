<template>
  <view class="file-item" :class="[item.checked ? 'is-checked' : '']">
    <view class="icon-view"></view>
    <view class="content-box">
      <view class="content">
        <view class="name">{{ item.name }}</view>
        <view class="desc">
          <view class="type item">TXT</view>
          <view class="size item">{{ size }}</view>
          <view class="date item">{{ item.dateTime }}</view>
        </view>
      </view>
      <view class="checked-box"></view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
defineOptions({
  name: 'FileItem'
})
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
const size = computed(() => {
  let value = props.item.size || 0
  if (value < 1024) {
    return `${value} Byte`
  } else if (value < 1024 * 1024) {
    value = Number((value / 1024).toFixed(1))
    return `${value} KB`
  } else if (value < 1024 * 1024 * 1024) {
    value = Number((value / 1024 / 1024).toFixed(1))
    return `${value} MB`
  } else {
    value = Number((value / 1024 / 1024 / 1024).toFixed(1))
    return `${value} TB`
  }
})
</script>

<style lang="scss" scoped>
.file-item {
  padding: 10rpx;
  background: #fff;
  margin: 10rpx 0;
  display: flex;
  align-items: center;
  height: 140rpx;
  box-sizing: border-box;
  &.is-checked {
    .content-box {
      .checked-box {
        width: 36rpx;
        height: 36rpx;
        background: url('/static/checked.svg') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .icon-view {
    width: 80rpx;
    height: 80rpx;
    background: url('/static/txt-file.png') no-repeat;
    background-size: 100% 100%;
  }
  .content-box {
    padding-left: 10rpx;
    width: calc(100% - 80rpx);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .content {
      width: calc(100% - 46rpx);
      padding-right: 10rpx;
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
          &.size {
            border-left: 1px solid #dcdfe6;
            border-right: 1px solid #dcdfe6;
          }
        }
      }
    }
    .checked-box {
      width: 36rpx;
      height: 36rpx;
      background: url('/static/unchecked.svg') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
