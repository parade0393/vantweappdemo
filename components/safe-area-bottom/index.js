Component({
  options:{
    "styleIsolation": "apply-shared"
  },
  externalClasses:['custom-class'],

  /**
   * 组件的属性列表
   */
  properties: {
    safeAreaBottom:{
      type:Boolean,
      value:true
    }
  },
  data:{
    bottomClass:""
  },
  lifetimes:{
    attached:function(){
     wx.getSystemInfo({
       success:(res)=>{
          const system = res.system
          if(system.toLocaleLowerCase().indexOf("ios") != -1){
           if(this.data.safeAreaBottom){
             this.setData({
               bottomClass:"safe-bottom"
             })
           }
          }
       }
     })
    }
  }
})