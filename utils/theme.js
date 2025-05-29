// utils/theme.js

/**
 * 主题管理工具类
 */
const themeUtil = {
  /**
   * 获取当前主题
   * @returns {string} 当前主题名称 'light' 或 'dark'
   */
  getCurrentTheme() {
    const app = getApp();
    return app.globalData.theme || 'light';
  },

  /**
   * 应用主题到页面
   * @param {Page} pageContext - 页面实例
   */
  applyTheme(pageContext) {
    const theme = this.getCurrentTheme();
    // 设置页面数据中的主题
    pageContext.setData({
      theme: theme
    });

    // 设置页面样式类
    if (theme === 'dark') {
      wx.nextTick(() => {
        pageContext.setData({
          themeClass: 'theme-dark'
        });
      });
    } else {
      wx.nextTick(() => {
        pageContext.setData({
          themeClass: ''
        });
      });
    }
  },

  /**
   * 监听主题变化
   * @param {Page} pageContext - 页面实例
   */
  watchThemeChange(pageContext) {
    // 保存原始的onShow方法
    const originalOnShow = pageContext.onShow;
    // 重写onShow方法，在页面显示时检查主题是否变化
    pageContext.onShow = function() {
      // 调用原始的onShow方法
      if (originalOnShow) {
        originalOnShow.call(this);
      }

      const app = getApp();
      // 如果主题已变化，则应用新主题
      if (app.globalData.themeChanged) {
        themeUtil.applyTheme(this);
        app.globalData.themeChanged = false;
      }
    };

    // 初始应用主题
    this.applyTheme(pageContext);
  }
};

module.exports = themeUtil;