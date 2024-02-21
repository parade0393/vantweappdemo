const dayjs = require('dayjs')
const cn = require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn') // 全局使用
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

 const showToast = function(content,duration) {
  if(!duration) duration = 2000
  wx.showToast({
      title: content,
      icon: 'none',
      duration: duration,
  })
}

var isShowLoading = false
 const showLoading = function(title) {
  if(isShowLoading) return
  wx.showLoading({
      title: title?title:'',
      mask:true,
      success:()=>{
          isShowLoading = true
      }
  })
}

 const hideLoading = function() {
  if(!isShowLoading) return
  isShowLoading = false
  wx.hideLoading()
}

/**
 * 批量上传
 * @param list 文件路径集合 
 * @param  showLoading 是否显示loading
 */
const uploadBatch = function (list, showLoading) {
  if (showLoading) {
    wx.showLoading({
      title: '上传中···',
    })
  }
  return new Promise((reso, rej) => {
    var prommise = Promise.allSettled(list.map((el) => {
      return new Promise((resole, reject) => {
        wx.uploadFile({
          url: config.baseurl + config.api.upload,
          filePath: el,
          header: {
            token: wx.getStorageSync(config.storageKey.token)
          },
          name: 'file',
          success(res) {
            resole(res.data)
          },
          fail(err) {
            reject(err)
          }
        })
      })
    }))
    const successList = []
    prommise.then(res => {
      res.forEach(item => {
        if (item.value) {
          const obj = JSON.parse(item.value)
          if(obj.code == 200){
            successList.push(item.value)
          }
        }
      })
      if (showLoading) {
        wx.hideLoading()
      }
      reso(successList)
    })
  })

}

//根绝key获取url中的参数值
function getParamByUrl(url, name) {
  // let reg = new RegExp(`[?&]${name}=[_a-zA-Z0-9%.-]*&?`)
  let reg = new RegExp(`[?&]${name}=[^#&]*&?`)
  let match = url.match(reg);
  if (match) {
      return match[0].split("=")[1].replaceAll("&", "")
  } else {
      return null
  }
}

//rpx转px
const rpx2px = function (rpx) {
  let pxValue = rpx * (wx.getSystemInfoSync().windowWidth / 750);
  return pxValue
}

//rpx转px
const rpx2pxW = function (rpx, windowWidth) {
  return rpx * (windowWidth / 750);
}

module.exports = {
  formatTime,
  showLoading,
  hideLoading,
  showToast,
  dayjs,
  upload,
  getParamByUrl
}
