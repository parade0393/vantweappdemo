const config = require("../../config/index")
const service = require("../../services/request")
const app = getApp()
Page({
  data: {
    keywords:"",
    pageLoading:false,
    banners:[]
  },
  onLoad(options) {
    this.init()
  },
  onShow() {
    this.getTabBar().init();
  },
  onPullDownRefresh() {

  },
  onReachBottom() {

  },

  init(){
    this.loadData()
  },
  loadData(){
    service.get(config.api.bannerUrl).then(res => {
      this.setData({
        banners:res
      })
    })
  }
})