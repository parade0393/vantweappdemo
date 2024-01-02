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
    active: 0,
    list: app.globalData.tablist,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].url.startsWith('/')
          ? this.data.list[event.detail].url
          : `/${this.data.list[event.detail].url}`,
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) =>
          (item.url.startsWith('/') ? item.url.substr(1) : item.url) ===
          `${route}`,
      );
      this.setData({ active:active, list:app.globalData.tablist});
    },
    updateCount(count,index){
      app.globalData.tablist[index].info = count
      this.setData({list:app.globalData.tablist})//更新数组里的某一项的字段
    }
  }
})