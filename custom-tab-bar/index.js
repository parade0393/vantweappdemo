// custom-tab-bar/index.js

const app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    active: "demo",
    list: app.globalData.tablist,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      console.log("onChange:"+event.detail);
      this.setData({ active: event.detail,list:app.globalData.tablist });
      const activeItem = app.globalData.tablist.find(
        (item) => item.name == event.detail
      );
     
      wx.switchTab({
        url: activeItem.url.startsWith('/')
          ? activeItem.url
          : `/${activeItem.url}`,
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      console.log("init:"+route);
      const activeItem = app.globalData.tablist.find(
        (item) =>
          (item.url.startsWith('/') ? item.url.substr(1) : item.url) ===
          `${route}`,
      );
      this.setData({ active:activeItem.name, list:app.globalData.tablist});
    },
    updateCount(count,index){
      app.globalData.tablist[index].info = count
      this.setData({list:app.globalData.tablist})//更新数组里的某一项的字段
    },
    updateTabbar(userRole){
      app.globalData.userRole = userRole
      if(app.globalData.tablist.length === 5){
        if(userRole == "2"){
          //摄影师
          app.globalData.tablist.splice(2,1)
          this.setData({list:app.globalData.tablist})
        }
      }else{
        if(userRole == "1"){
          //消费者
           app.globalData.tablist.splice(2,0,app.globalData.categoryItem)
          this.setData({list:app.globalData.tablist})
        }
      }
    }
  }
})