const config = require("../../config/index")
Component({
  externalClasses: ["wr-class"],
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileList: [],
    maxSize: 9437184
  },

  /**
   * 组件的方法列表
   */
  methods: {
    afterRead(e) {
      console.log(e.detail)
      const file = e.detail.file
      var fileSize = (file.size / 1024 / 1024.0).toFixed(2);
      console.log('fileSize:' + fileSize)
      if (fileSize > 1.5) {
        let instance = this
        let maxWidth = 1024
        let maxHeight = 768
        wx.showLoading({
          title: '图片压缩中···',
        })
        const query = this.createSelectorQuery()
        let dom = query.select('#myCanvas')
        dom.fields({
          node: true,
          size: true
        }).exec((res) => {
          var canvas = res[0].node
          let img = canvas.createImage()
          console.log('file.url:' + file.url)
          img.src = file.url
          img.onload = function () {
            let width = this.width
            let height = this.height
            console.log('width:' + width + ',height:' + height)
            if (width > maxWidth) {
              const ratio = maxWidth / width
              width = maxWidth
              height = height * ratio
            }
            // 高度 > 最大限高度 -> 重置尺寸
            if (height > maxHeight) {
              const ratio = maxHeight / height
              width = width * ratio
              height = maxHeight
            }
            console.log('width:' + width + ',height:' + height)
            let context = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = width * dpr
            canvas.height = height * dpr
            context.scale(dpr, dpr)
            context.drawImage(img, 0, 0, width, height)
            wx.canvasToTempFilePath({
              canvas,
              x: 0,
              y: 0,
              destWidth: width,
              destHeight: height,
              success(res) {
                file.url = res.tempFilePath
                wx.hideLoading()
                wx.showLoading({
                  title: '图片上传中...',
                })
                instance.uploadFile(file, e.detail.name)
              }
            })
          }
        })
      } else {
        this.uploadFile(file, e.detail.name)
      }
    },
    uploadFile(file, domName) {
      const that = this
      wx.uploadFile({
        url: config.baseurl + config.api.upload,
        filePath: file.url,
        header: {
          token: wx.getStorageSync(config.storageKey.token)
        },
        name: 'file',
        success(res) {
          if (res.statusCode == 200) {
            wx.hideLoading()
            const fileData = JSON.parse(res.data)
            if (fileData.code == 200) {
              that.setData({
                fileList: [{
                  ...file,
                  url: config.baseurl + fileData.fileName
                }]
              })
              that.triggerEvent('finish', {
                ...fileData,
                name: domName
              })
            }
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '上传出错',
            })
          }
        },
        fail(err) {
          wx.hideLoading()
          wx.showToast({
            title: '上传出错',
          })
        }
      });
    },
    onDelete(e) {
      this.setData({
        fileList: []
      })
      this.triggerEvent('delete', {
        name: e.detail.name
      })
    },
    beforeRead(event){
      const { file, callback } = event.detail;
      callback(true)
    },
    onOversize(e){
      wx.showModal({
        title: '提示',
        content: '上传图片不能大于9M',
        showCancel:false,
      })
    }
  }
})