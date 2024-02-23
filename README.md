### 项目启动

1. 使用微信开发者工具打开项目

2. npm install 安装依赖

3. 使用微信开发者工具菜单:工具->构建npm

4. dayjs

   1. 使用dayjs插件，需要手动把插件拷贝到miniprogram_npm文件夹下
   2. 本项目使用了relativeTime和zh_cn插件,需要在miniprogram_npm下的dayjs文件夹下新建locale和plugin，并把node_modules下的相关两个插件的js拷贝miniprogram_npm下的dayjs下相关的文件夹

5. 常见问题
  * 页面转发给朋友和分享到朋友圈需要页面适配，特别是分享到朋友圈(因为限制比较多，所以需要根据场景值进行适配)
  * 小程序刚启动就switchTab可能会有问题，可尝试使用relaunch解决
  * 在js中调用当前页面的方法： const page = getCurrentPages().pop(),可以先这获取第一个页面
  * 新建一个组件后需要清理编译缓存
  * setData使用动态属性时需要加[]
  ```
    uploadFinish(e) {
    const flagType = "info." + e.detail.name
    this.setData({
      [flagType]: e.detail.fileName
    })
  },
  ```
  * 小程序的双向绑定只适合简单的属性，不适合嵌套的属性
  * 在组件中properties中的属性也可以使用this.data访问
  * 自定义组件中如果想使用全局样式，需要配置 `"styleIsolation": "apply-shared"`
  * 设置底部安全区域
  ```
      const info = wx.getSystemInfoSync()
    if (info.safeArea) {
      let bottom = info.screenHeight - info.safeArea.bottom
      if (bottom == 0) {
        bottom = utils.rpx2pxW(26, info.screenWidth)
      }
      this.setData({
        safeAreaBottom: `padding-bottom:${bottom}px;`,
      })
    }
  ```
   