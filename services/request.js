const config = require("../config/index")
const utils = require("../utils/util")

/**
* 网络请求request
 * obj.data 请求接口需要传递的数据
 * obj.showLoading 控制是否显示加载Loading 默认为false不显示
 * obj.contentType 默认为 application/json
 * obj.method 请求的方法  默认为GET
 * obj.message 加载数据提示语
 */
function request(url,obj){
  return new Promise((resolve,reject) => {
      if(obj.showLoading){
        utils.showLoading(obj.message?obj.message:"加载中···")
      }
      var data = {}
      if(obj.data){
        data = obj.data
      }
      var contentType = 'application/json';
      if(obj.contentType){
        contentType = obj.contentType;
      } 
      wx.request({
        url:config.baseurl+url,
        data: data,
        method: obj.method,
        //添加请求头
        header: {
          'Content-Type': contentType ,
          'token': wx.getStorageSync('token') //获取保存的token
        },
        success:function(res){
          if(res.statusCode == 200){
            if(res.data.errorCode === 0){
                resolve(res.data.data)
            }else{
              reject(res.data.errorMsg || "请求错误")
            }
          }else{
            //可根据不同返回值code进行不同处理
            reject("请求失败")
          }
        },
        fail:function(err){
          reject("服务器连接异常，请检查网络再试");
        },
        complete:function(){
          utils.hideLoading()
        }
      })
  })
}

module.exports = {
  get(url,obj){
    if(!obj){
      obj = {}
    }
    obj.method = "GET"
    return request(url,obj)
  },
  post(url,obj){
    if(!obj){
      obj = {}
    }
    obj.method = "POST"
    return request(url,obj)
  }
}