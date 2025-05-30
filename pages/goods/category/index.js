// pages/index/index.js
const themeUtil = require('../../../utils/theme');

Page({
  data: {
    theme: 'light',
    themeClass: '',
    statusBarHeight: 0,
    navHeight: 0,
    menuRight: 0
  },

  onLoad: function (options) {
    // 初始化主题
    themeUtil.watchThemeChange(this);
    const {top,height,right,width,left } = wx.getMenuButtonBoundingClientRect()
    const {statusBarHeight,windowWidth} = wx.getWindowInfo()
    console.log(statusBarHeight,top)
    console.log(windowWidth,left,right,width)
    const navHeight = statusBarHeight + (top-statusBarHeight)*2+height
    this.setData({
      statusBarHeight,
      menuTop:top+(height/4),
      navHeight,
      menuRight: windowWidth-left+10
    })
  },

  onShow: function () {
  }
});