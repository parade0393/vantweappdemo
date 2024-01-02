// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    tablist:[
      {
        icon: 'home-o',
        text: '演示',
        url: 'pages/demo/index',
        selectIcon:"/static/image/demo_s.svg",
        normalIcon:"/static/image/demo_n.svg",
        info:""
      },
      {
        icon: 'home-o',
        text: '首页',
        url: 'pages/home/index',
        selectIcon:"/static/image/home_s.svg",
        normalIcon:"/static/image/home_n.svg",
        info:""
      },
      {
        icon: 'sort',
        text: '分类',
        url: 'pages/goods/category/index',
        selectIcon:"/static/image/category_s.svg",
        normalIcon:"/static/image/category_n.svg",
      },
      {
        icon: 'cart',
        text: '购物车',
        url: 'pages/cart/index',
        selectIcon:"/static/image/cart_s.svg",
        normalIcon:"/static/image/cart_n.svg",
      },
      {
        icon: 'user-circle-o',
        text: '个人中心',
        url: 'pages/usercenter/index',
        selectIcon:"/static/image/user_s.svg",
        normalIcon:"/static/image/user_n.svg",
      },
    ]
  }
})
