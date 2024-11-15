<script setup>
import { onLaunch, onExit } from '@dcloudio/uni-app'
import { closeDatabase, createDatabase, createDataBaseTable } from './db/index.js'
import { requestExternalStoragePermission } from './utils/requestAndroidPermissions'

onLaunch(() => {
  createDatabase()
    .then(() => {
      createDataBaseTable()
        .then(() => {
          closeWaitSplashscreen()
        })
        .catch((e) => {
          showDBFailMsg('数据库创建表失败！')
          console.log(e)
        })
    })
    .catch(() => {
      showDBFailMsg('数据库打开失败！')
    })
  requestExternalStoragePermission()
})
const closeWaitSplashscreen = () => {
  plus.navigator.closeSplashscreen()
}
const showDBFailMsg = (msg) => {
  uni.showToast({
    title: msg,
    icon: 'none'
  })
  closeWaitSplashscreen()
}
onExit(() => {
  closeDatabase()
})
</script>

<style lang="scss">
@import '@/uni_modules/uni-scss/index.scss';
$nav-bar-height: 80rpx;
$status-bar-height: var(--status-bar-height);
uni-page-body {
  background: #f3f4f4;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.page-container {
  background: #f3f4f4;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  > .custom-nav-bar {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    transition: top 0.3s;

    &.hide-custom-nav-bar {
      top: -80rpx;
    }
    .uni-navbar__header-btns-left {
      .uniui-left {
        font-size: 40rpx !important;
        font-weight: bolder !important;
      }
    }
    .uni-nav-bar-right-text {
      font-size: 24rpx;
      font-weight: bolder;
    }
  }
  .container-main {
    margin-top: var(--status-bar-height);
    padding-top: 80rpx;
    height: calc(100% - var(--status-bar-height));
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>
