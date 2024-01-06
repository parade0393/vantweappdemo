
const app = getApp()
const service   = require("../../services/request")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  updateBadge(){
    this.getTabBar().updateCount((app.globalData.tablist[0].info)*1+1,0)
  },
  clearBadge(){
    this.getTabBar().updateCount("",0)
  },
  showLoading(){
    wx.showLoading({
      title: '加载中···',
      mask:true
    })
  },
  hideloading(){
    wx.hideLoading()
  },

  fetchData(){
    service.get('/banner/json',{showLoading:true}).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },

  getPhoneNumber(e){
    if(e.code){
      //授权成功，拿code去服务端置换手机号
    }
  },

  updateTabBar(){
    const userRole = app.globalData.userRole
    let changeRole = ""
    if(userRole){
      if(userRole == "1"){
        changeRole = "2"
      }else{
        changeRole = "1"
      }
    }else{
      changeRole = "2"
    }
    this.getTabBar().updateTabbar(changeRole)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})