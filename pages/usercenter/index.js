// pages/settings/settings.js
const themeUtil = require('../../utils/theme');

Page({
  data: {
    theme: 'light',
    themeClass: ''
  },

  onLoad: function (options) {
    // 初始化主题
    themeUtil.watchThemeChange(this);
  },

  onShow: function () {
    this.getTabBar().init();
  },

  // 开关切换主题
  onThemeChange: function (event) {
    const app = getApp();
    const checked = event.detail;
    const theme = checked ? 'dark' : 'light';
    
    // 切换主题
    app.switchTheme(theme);
    
    // 更新页面数据
    this.setData({
      theme: theme,
      themeClass: theme === 'dark' ? 'theme-dark' : ''
    });
  },

  // 单选按钮切换主题
  onRadioChange: function (event) {
    const app = getApp();
    const theme = event.detail;
    
    // 切换主题
    app.switchTheme(theme);
    
    // 更新页面数据
    this.setData({
      theme: theme,
      themeClass: theme === 'dark' ? 'theme-dark' : ''
    });
  },

  // 点击单元格时触发单选按钮
  onClickRadio: function (event) {
    const name = event.currentTarget.dataset.name;
    this.setData({
      theme: name
    });
    
    // 切换主题
    const app = getApp();
    app.switchTheme(name);
    
    // 更新页面数据
    this.setData({
      themeClass: name === 'dark' ? 'theme-dark' : ''
    });
  }
});