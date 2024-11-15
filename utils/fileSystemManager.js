import dayjs from 'dayjs'
const Environment = plus.android.importClass('android.os.Environment')
const Context = plus.android.importClass('android.content.Context')
const StorageVolume = plus.android.importClass('android.os.storage.StorageVolume')
const File = plus.android.importClass('java.io.File')
const MimeTypeMap = plus.android.importClass('android.webkit.MimeTypeMap')

const getFileSystemBasePathAndVolume = () => {
  const internalPath = Environment.getExternalStorageDirectory().getAbsolutePath()
  let volumeList = []
  const MainActivity = plus.android.runtimeMainActivity()
  const mStorageManager = MainActivity.getSystemService(Context.STORAGE_SERVICE)
  try {
    const getVolumeList = mStorageManager.getClass().getMethod('getVolumeList')
    const getPath = StorageVolume.getMethod('getPath')
    const isRemovable = StorageVolume.getMethod('isRemovable')
    const result = getVolumeList.invoke(mStorageManager)
    let internalNum = 0,
      externalNum = 0
    result.forEach((item) => {
      const removable = isRemovable.invoke(item)
      let name = ''
      if (removable) {
        externalNum++
        name = `外部存储 ${externalNum}`
      } else {
        internalNum++
        name = `内部存储 ${internalNum}`
      }
      volumeList.push({
        name,
        fullPath: getPath.invoke(item),
        isFile: false,
        volumeType: removable ? '2' : '1'
      })
    })
  } catch (e) {
    console.log(e)
  }
  return { internalPath, volumeList }
}

const getSystemListFilesByPath = (path, filterTypes = ['txt', 'folder']) => {
  let dirs = [],
    files = []
  let directory = new File(path)
  let arr = directory.listFiles()
  if (arr === null) {
    return checkStoragePermission(path)
  }
  arr.forEach((item) => {
    if (!item.isHidden()) {
      const dateTime = dayjs(item.lastModified() || '').format('YYYY-MM-DD HH:mm:ss')
      const name = item.getName()
      const fullPath = item.getPath()
      if (item.isDirectory()) {
        if (!filterTypes || filterTypes.includes('folder')) {
          dirs.push({
            name,
            fullPath,
            dateTime,
            isFile: false
          })
        }
      } else {
        const extension = MimeTypeMap.getFileExtensionFromUrl(fullPath)
        const mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(
          extension.toLowerCase()
        )
        const nameTypeArr = name.split('.')
        const nameType = nameTypeArr.pop()
        const type = (mimeType || nameType).toLowerCase()
        const fileItem = {
          name,
          fullPath,
          dateTime,
          size: item.length(),
          isFile: true
        }
        // 过滤文件类型
        if (!filterTypes || filterTypes.includes(type)) {
          files.push(fileItem)
        }
      }
    }
  })
  return [...dirs, ...files]
}

export { getFileSystemBasePathAndVolume, getSystemListFilesByPath }
