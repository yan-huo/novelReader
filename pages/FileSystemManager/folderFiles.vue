<template>
  <view class="page-container folder-files">
    <uni-nav-bar
      class="custom-nav-bar"
      @click-left="handleNavBarLeftClick"
      @click-right="handleNavBarRightClick"
      left-icon="left"
      right-text="扫描"
      status-bar
      height="80rpx"
      background-color="#007AFF"
      color="#fff"
      :border="false"
    >
      <view class="title-box">
        <view class="title">{{ navBarTitle }}</view>
        <view class="sub-title">{{ navBarSubTitle }}</view>
      </view>
    </uni-nav-bar>
    <view class="container-main">
      <template v-for="item in directoryList">
        <FileItem v-if="item.isFile" :item="item" @click="handleFileItemClick(item)"></FileItem>
        <FolderItem v-else :item="item" @click="handleFolderItemClick(item)"></FolderItem>
      </template>
    </view>
    <button class="import-btn" :disabled="!selectedFiles.length" type="primary">导入</button>
  </view>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'
import FileItem from './components/fileItem.vue'
import FolderItem from './components/folderItem.vue'
import { requestExternalStoragePermission } from '../../utils/requestAndroidPermissions'
import {
  getFileSystemBasePathAndVolume,
  getSystemListFilesByPath
} from '../../utils/fileSystemManager'
import { checkBookAddedByPath } from '../../apiService/index'
import UniNavBar from '../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
defineOptions({
  name: 'FolderFiles'
})

const store = useStore()
const navBarTitle = ref('导入书籍')
const navBarSubTitle = computed(() => {
  const num = selectedFiles.value.length
  return num ? `已选择${num}本书籍` : '请选择书籍'
})
const directoryListMap = {}
const directoryList = ref([])
let currentPath = ''
let basePath = ''
let selectedFiles = ref([])
onBackPress(() => {
  if (currentPath !== basePath) {
    if (
      directoryListMap['/'] &&
      directoryListMap['/'].find((item) => item.fullPath === currentPath)
    ) {
      currentPath = '/'
      directoryList.value = directoryListMap['/']
    } else {
      const path = currentPath.split('/')
      path.pop()
      getFolderFiles(path.join('/'))
    }
    return true
  } else {
    return false
  }
})
const handleNavBarLeftClick = () => {
  uni.navigateBack({})
}
const handleNavBarRightClick = () => {}
const handleFileItemClick = (item) => {
  item.checked = !item.checked
  if (item.checked) {
    selectedFiles.value.push(item)
  } else {
    selectedFiles.value = selectedFiles.value.filter((file) => file.fullPath !== item.fullPath)
  }
}
const handleFolderItemClick = (item) => {
  getFolderFiles(item.fullPath)
}
const checkStoragePermission = (path) => {
  requestExternalStoragePermission()
    .then(() => {
      getFolderFiles(path)
    })
    .catch((code) => {
      if (code === '1') {
        uni.showModal({
          title: '提示',
          content: '导入书籍需要用到存储权限，请授权！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              checkStoragePermission(path)
            }
          }
        })
      } else {
        uni.showModal({
          title: '存储权限',
          content: '您拒绝了存储权限，导入书籍需要用到存储权限，请去设置-应用开启存储权限。',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              const Intent = plus.android.importClass('android.content.Intent')
              const Uri = plus.android.importClass('android.net.Uri')
              const Settings = plus.android.importClass('android.provider.Settings')
              const activity = plus.android.runtimeMainActivity()
              const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
              const uri = Uri.fromParts('package', activity.getPackageName(), null)
              intent.setData(uri)
              activity.startActivity(intent)
              uni.navigateBack({})
            }
          }
        })
      }
    })
}
const setFileChecked = (item) => {
  checkBookAddedByPath(item.fullPath).then((data) => {
    item.checked = data
  })
}
const getFolderFiles = (path) => {
  uni.showLoading({ mask: true })
  currentPath = path
  if (directoryListMap[path]) {
    directoryList.value = directoryListMap[path]
    uni.hideLoading()
    return
  }
  const list = getSystemListFilesByPath(path)
  list.forEach((item) => {
    if (item.isFile) {
      setFileChecked(item)
    }
  })
  directoryList.value = list
  directoryListMap[path] = directoryList.value
  uni.hideLoading()
  console.log(directoryList.value)
}
onMounted(() => {
  console.log(plus.navigator.getStatusbarHeight())
  const { internalPath, volumeList } = getFileSystemBasePathAndVolume()
  if (volumeList.length) {
    basePath = '/'
    currentPath = basePath
    directoryList.value = volumeList
    directoryListMap[basePath] = directoryList.value
    return
  } else {
    basePath = internalPath
  }
  getFolderFiles(internalPath)
})
</script>

<style lang="scss" scoped>
.title-box {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 24rpx;
    font-weight: bolder;
  }
  .sub-title {
    font-size: 20rpx;
  }
}
.container-main {
  padding-bottom: 80rpx;
  overflow: auto;
}
.import-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-radius: 0;
  margin: 0;
  line-height: 80rpx;
  background-color: #fff;
  color: rgba(0, 122, 255, 0);
  &[disabled] {
    color: #fff;
    background-color: #62abfb;
  }
}
</style>
