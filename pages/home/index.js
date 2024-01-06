const config = require("../../config/index")
const service = require("../../services/request")
const utils = require("../../utils/util")
const app = getApp()
Page({
  data: {
    keywords: "",
    pageLoading: false,
    banners: [],
    tabs: [],
    list: [],
    tabActive: 0,
    pageLoading: false,
    listLoadStatus: 0,
    retryCount:0
  },
  projectPage: {
    page: 1,
    num: 10
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
    if (this.data.listLoadStatus === 0) {
      this.projectPage.page++
      this.loadArticleList()
    }
  },

  init() {
    this.loadBannerData()
    this.loadTabData()
  },
  loadBannerData() {
    wx.stopPullDownRefresh()
    this.setData({
      pageLoading: true
    })
    service.get(config.api.bannerUrl).then(res => {
      this.setData({
        banners: res,
        pageLoading: false
      })
    })
  },
  loadTabData() {
    service.get(config.api.projectTab).then(res => {
      this.setData({ tabs: res })
      if (res.length > 0) {
        this.setData({
          tabActive: 0
        })
        this.loadArticleList(true)
      }
    })
  },
  onTabChange(event) {
    const index = event.detail.index
    this.projectPage.page = 1
    this.setData({
      tabActive: index
    })
    this.loadArticleList(true)
  },
  async loadArticleList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }
    this.setData({
      listLoadStatus:1
    })
    try {
      const id = this.data.tabs[this.data.tabActive].id
      const res = await service.get(config.api.projectList + "/" + this.projectPage.page + "/json", { "data": { "cid": id, "page_size": this.projectPage.num } })
      res.datas.forEach(el => {
        el.publickTimeText = utils.dayjs().to(utils.dayjs(el.publishTime))
      })
      const newList = this.projectPage.page == 1 ? res.datas : this.data.list.concat(res.datas)
      this.setData({
        list: newList,
        listLoadStatus:0
      })
    } catch (error) {
      this.setData({
        listLoadStatus:2
      })
    }

  },
  onReTry() {
    console.log("onReTry");
    this.setData({
      retryCount:1
    })
    this.loadArticleList();
  },
})