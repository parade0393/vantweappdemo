// components/load-more/index.js
Component({
  externalClasses: ['wr-class','wr-class--no-more'],
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    status: {
      type: Number,
      value: 0,//0:未加载(全部加载) ，1:加载中 ，2:加载失败
    },
    loadingText: {
      type: String,
      value: '加载中...',
    },
    noMoreText: {
      type: String,
      value: '没有更多了',
    },
    failedText: {
      type: String,
      value: '加载失败，点击重试',
    },
    color: {
      type: String,
      value: '#BBBBBB',
    },
    failedColor: {
      type: String,
      value: '#FA550F',
    },
    size: {
      type: null,
      value: '40rpx',
    },
    loadingBackgroundColor: {
      type: String,
      value: '#F5F5F5',
    },
    listIsEmpty: {
      type: Boolean,
      value: false,//是否是无数据
    },
  },

  data: {

  },

  methods: {
    /** 点击处理 */
    tapHandle() {
      // 失败重试
      if (this.data.status === 2) {
        this.triggerEvent('retry');
      }
    },
  }
})