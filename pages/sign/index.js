var app = getApp()

Page({
  data: {
    canvas: null,
    context: null,

    // 前一点
    preX: 0,
    preY: 0
  },
  points:[],
  minSpeed:1.5,//画笔达到最小宽度所需最小速度(px/ms)，取值范围1.0-10.0，值越小，画笔越容易变细，笔锋效果会比较明显，可以自行调整查看效果，选出自己满意的值
  maxWidth:6,//画笔最大宽度(px)，开启笔锋时画笔最大宽度，或未开启笔锋时画笔正常宽度
  minWidth:2,//画笔最小宽度(px)，开启笔锋时画笔最小宽度
  maxWidthDiffRate:20,//相邻两线宽度增(减)量最大百分比，取值范围1-100，为了达到笔锋效果，画笔宽度会随画笔速度而改变，如果相邻两线宽度差太大，过渡效果就会很突兀，使用maxWidthDiffRate限制宽度差，让过渡效果更自然。可以自行调整查看效果，选出自己满意的值。
  canAddHistory:false,//是否开启历史记录,测试没啥用
  maxHistoryLength:20,//限制历史记录数，即最大可撤销数，设置0则关闭历史记录功能
  getImagePath:"",//生成临时图片的Promise函数，用于保存历史记录，如该项未配置，则撤销功能不可用
  historyList:[],

  onShow() {
    const that = this;
    // 获取画布
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        // 设置笔触信息
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.font = "20px Arial"

        that.setData({
          canvas: canvas,
          context: ctx
        })
      })
  },

  /**记录开始点 */
  bindtouchstart(e) {
    let context = this.data.context
    let curX = e.touches[0].clientX
    let curY = e.touches[0].clientY
    this.canAddHistory = true;
    this.initPoint(curX,curY)
    // context.beginPath()
    // context.moveTo(curX, curY)

    // this.data.preX = curX
    // this.data.preY = curY
  },

  /**记录移动点，刷新绘制 */
  bindtouchmove(e) {
    let context = this.data.context
    let preX = this.data.preX
    let preY = this.data.preY
    let curX = e.touches[0].clientX
    let curY = e.touches[0].clientY
    this.onDrawMove(curX,curY)

    // let deltaX = Math.abs(preX - curX)
    // let deltaY = Math.abs(preY - curY)

    // // 相差大于3像素的时候作二阶贝塞尔曲线
    // if (deltaX >= 3 || deltaY >= 3) {
    //   // 前后两点中心点
    //   let centerX = (preX + curX) / 2
    //   let centerY = (preY + curY) / 2

    //   //这里以前一点作为控制点，中心点作为终点，起始点为上一次的中点，很流畅啊！
    //   context.quadraticCurveTo(preX, preY, centerX, centerY);
    //   context.stroke();

    //   this.data.preX = curX
    //   this.data.preY = curY
    // }
  },

  bindtouchend(){
    this.canAddHistory = true;
    this.points = [];
  },

  /**清空画布 */
  clear () {
    let context = this.data.context
    let canvas = this.data.canvas

    context.clearRect(0, 0, canvas.width, canvas.height);
    

    context.strokeStyle = '#000000'
    context.lineWidth = 2
    context.font = "20px Arial"
    context.draw && context.draw()
    this.historyList.length = 0
  },

  /**导出图片 */
  export() {
    const that = this;
    wx.showLoading({
      title: '正在生成签名...',
    })
    wx.canvasToTempFilePath({
      canvas: that.data.canvas,
      success(res) {
        wx.hideLoading()
        const channel = that.getOpenerEventChannel()
        wx.navigateBack({
          success(){
            channel.emit("saveSign",res)
          }
        })
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '生成图片失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  initPoint(x,y){
    const point = {x,y,t:new Date().getMilliseconds()}
    const prePoint = this.points.slice(-1)[0]
    if (prePoint && (prePoint.t === point.t || prePoint.x === x && prePoint.y === y)) {
      return
    }

    if(prePoint){
      const prePoint2 = this.points.slice(-2, -1)[0];
      point.distance = Math.sqrt(Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2));
      point.speed = point.distance / ((point.t - prePoint.t) || 0.1);
      point.lineWidth = this.getLineWidth(point.speed);
      if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
        const rate = (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
        let maxRate = this.maxWidthDiffRate / 100;
        maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;
        if (Math.abs(rate) > maxRate) {
          const per = rate > 0 ? maxRate : -maxRate;
          point.lineWidth = prePoint.lineWidth * (1 + per);
        }
      }
    }
    this.points.push(point);
    this.points = this.points.slice(-3);
  },
  getLineWidth(speed) {
    const minSpeed = this.minSpeed > 10 ? 10 : this.minSpeed < 1 ? 1 : this.minSpeed;
    const addWidth = (this.maxWidth - this.minWidth) * speed / minSpeed;
    const lineWidth = Math.max(this.maxWidth - addWidth, this.minWidth);
    return Math.min(lineWidth, this.maxWidth);
  },
  onDrawMove(x,y){
    this.initPoint(x, y);
    this.onDraw()
  },
  onDraw(){
    if (this.points.length < 2) return;
    this.addHistory()
   
    const point = this.points.slice(-1)[0];
    const prePoint = this.points.slice(-2, -1)[0];
    this.drawSmoothLine(prePoint,point)
  },
  addHistory(){
    if (!this.maxHistoryLength || !this.canAddHistory) return;
    this.canAddHistory = false;
    this.getImagePath().then(url => {
      if(url){
        this.historyList.push(url);
        this.historyList = this.historyList.slice(-this.maxHistoryLength);
      }
    })
  },
  drawSmoothLine(prePoint, point){
    const dis_x = point.x - prePoint.x;
    const dis_y = point.y - prePoint.y;
    if (Math.abs(dis_x) + Math.abs(dis_y) <= 2) {
      point.lastX1 = point.lastX2 = prePoint.x + (dis_x * 0.5);
      point.lastY1 = point.lastY2 = prePoint.y + (dis_y * 0.5);
    } else {
      point.lastX1 = prePoint.x + (dis_x * 0.3);
      point.lastY1 = prePoint.y + (dis_y * 0.3);
      point.lastX2 = prePoint.x + (dis_x * 0.7);
      point.lastY2 = prePoint.y + (dis_y * 0.7);
    }
    point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;
    if (typeof prePoint.lastX1 === 'number') {
      this.drawCurveLine(prePoint.lastX2, prePoint.lastY2, prePoint.x, prePoint.y, point.lastX1, point.lastY1, point.perLineWidth);
      if (prePoint.isFirstPoint) return;
      if (prePoint.lastX1 === prePoint.lastX2 && prePoint.lastY1 === prePoint.lastY2) return;
      const data = this.getRadianData(prePoint.lastX1, prePoint.lastY1, prePoint.lastX2, prePoint.lastY2);
      const points1 = this.getRadianPoints(data, prePoint.lastX1, prePoint.lastY1, prePoint.perLineWidth / 2);
      const points2 = this.getRadianPoints(data, prePoint.lastX2, prePoint.lastY2, point.perLineWidth / 2);
      this.drawTrapezoid(points1[0], points2[0], points2[1], points1[1]);
    } else {
      point.isFirstPoint = true;
    }
  },
  drawCurveLine(x1, y1, x2, y2, x3, y3, lineWidth) {
    lineWidth = Number(lineWidth.toFixed(1));
    this.data.context.setLineWidth && this.data.context.setLineWidth(lineWidth);
    this.data.context.lineWidth = lineWidth;
    this.data.context.beginPath();
    this.data.context.moveTo(Number(x1.toFixed(1)), Number(y1.toFixed(1)));
    this.data.context.quadraticCurveTo(
      Number(x2.toFixed(1)), Number(y2.toFixed(1)),
      Number(x3.toFixed(1)), Number(y3.toFixed(1))
    );
    this.data.context.stroke();
    this.data.context.draw && this.data.context.draw(true);
  },
  getRadianData(x1, y1, x2, y2)  {
    const dis_x = x2 - x1;
    const dis_y = y2 - y1;
    if (dis_x === 0) {
      return { val: 0, pos: -1 }
    }
    if (dis_y === 0) {
      return { val: 0, pos: 1 }
    }
    const val = Math.abs(Math.atan(dis_y / dis_x));
    if (x2 > x1 && y2 < y1 || (x2 < x1 && y2 > y1)) {
      return { val, pos: 1 }
    }
    return { val, pos: -1 }
  },

  getRadianPoints(radianData, x, y, halfLineWidth) {
    if (radianData.val === 0) {
      if (radianData.pos === 1) {
        return [
          { x, y: y + halfLineWidth },
          { x, y: y - halfLineWidth }
        ]
      }
      return [
        { y, x: x + halfLineWidth },
        { y, x: x - halfLineWidth }
      ]
    }
    const dis_x = Math.sin(radianData.val) * halfLineWidth;
    const dis_y = Math.cos(radianData.val) * halfLineWidth;
    if (radianData.pos === 1) {
      return [
        { x: x + dis_x, y: y + dis_y },
        { x: x - dis_x, y: y - dis_y }
      ]
    }
    return [
      { x: x + dis_x, y: y - dis_y },
      { x: x - dis_x, y: y + dis_y }
    ]
  },
  drawTrapezoid (point1, point2, point3, point4) {
    this.data.context.beginPath();
    this.data.context.moveTo(Number(point1.x.toFixed(1)), Number(point1.y.toFixed(1)));
    this.data.context.lineTo(Number(point2.x.toFixed(1)), Number(point2.y.toFixed(1)));
    this.data.context.lineTo(Number(point3.x.toFixed(1)), Number(point3.y.toFixed(1)));
    this.data.context.lineTo(Number(point4.x.toFixed(1)), Number(point4.y.toFixed(1)));
    this.data.context.setFillStyle && this.ctx.setFillStyle(this.color);
    this.data.context.fillStyle = this.color;
    this.data.context.fill();
    this.data.context.draw && this.data.context.draw(true);
  },

  getImagePath(){
    const that =this
    return new Promise((resolve) => {
      wx.canvasToTempFilePath({
        canvas: that.data.canvas,
        success(res){
          resolve(res.tempFilePath)
        }
      })
    })
  },
  
  undo() {
    if (!this.historyList.length) return;
    const pngURL = this.historyList.splice(-1)[0];
    this.drawByImage(pngURL);
    if (this.historyList.length === 0) {
      this.clear();
    }
  },
  drawByImage(url) {
    let canvas = this.data.canvas
    this.data.context.clearRect(0, 0, canvas.width, canvas.height);
    try {
      this.data.context.drawImage(url, 0, 0, canvas.width, canvas.height);
      this.data.context.draw && this.data.context.draw(true);
    } catch (e) {
      this.historyList.length = 0;
    }
  }
})
