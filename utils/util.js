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


module.exports = {
  formatTime,
  showLoading,
  hideLoading,
  showToast,
  dayjs
}
