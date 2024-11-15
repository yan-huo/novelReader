const requestPermissions = (permissions) => {
  return new Promise((resolve, reject) => {
    plus.android.requestPermissions(
      permissions,
      (event) => {
        if (event.deniedAlways.length > 0) {
          //权限被永久拒绝
          reject('2')
        }
        if (event.deniedPresent.length > 0) {
          //权限被临时拒绝
          reject('1')
        }
        if (event.granted.length > 0) {
          //权限被允许
          resolve()
        }
      },
      (err) => {
        uni.showToast({
          title: err.message,
          icon: 'none'
        })
        reject('0')
      }
    )
  })
}
const requestExternalStoragePermission = () => {
  return requestPermissions([
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.READ_EXTERNAL_STORAGE'
  ])
}
export { requestPermissions, requestExternalStoragePermission }
