const config = require("../../config/index")
const service = require("../../services/request")
const utils = require("../../utils/util")
const app = getApp()
Page({
  data: {
    keywords:"",
    pageLoading:false,
    banners:[],
    tabs:[],
    list:[],
    tabActive:0,
    pageLoading:false
  },
  projectPage:{
    page:1,
    num:10
  },
  onLoad(options) {
    this.init()
  },
  onShow() {
    this.getTabBar().init();
    
  },
  onPullDownRefresh() {
    this.projectPage.page = 1
    this.init()
  },
  onReachBottom() {
    this.projectPage.page++
    this.loadArticleList()
  },

  init(){
    this.setData({
      pageLoading:true
    })
    this.loadBannerData()
    this.loadTabData()
  },
  loadBannerData(){
    service.get(config.api.bannerUrl).then(res => {
      wx.stopPullDownRefresh()
      this.setData({
        banners:res,
        pageLoading:false
      })
    })
  },
  loadTabData(){
    service.get(config.api.projectTab).then(res => {
      this.setData({tabs:res})
      if(res.length > 0){
        this.setData({
          tabActive:0
        })
        this.loadArticleList(0)
      }
    }) 
  },
  onTabChange(event){
    const index = event.detail.index
    this.projectPage.page = 1
    this.setData({
      tabActive:index
    })
    this.loadArticleList(index)
  },
  loadArticleList(){
    const id = this.data.tabs[this.data.tabActive].id
    service.get(config.api.projectList+"/"+this.projectPage.page+"/json",{"data":{"cid":id,"page_size":this.projectPage.num}}).then(res => {
      res.datas.forEach(el => {
        el.publickTimeText = utils.dayjs().to(utils.dayjs(el.publishTime))
      })
      const newList = this.projectPage.page == 1 ? res.datas:this.data.list.concat(res.datas)
      this.setData({
        list:newList
      })
    })
  }
})