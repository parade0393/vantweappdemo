使用demo如下
```
<upload-single wr-class="upload-com" 
name="idCardFront" bind:finish="uploadFinish" 
bind:delete="onDelete">
  <image class="upload-card-img" src="/static/
image/card_f.png" />
```
```
.upload-com{
  width: 316rpx ;
  height: 202rpx ;
}
.upload-card-img{
  width: 316rpx;
  height: 202rpx;
}
.upload-com .van-uploader__preview{
  margin: 0 !important;
}
.upload-com .van-uploader__preview-image{
  width: 316rpx !important;
  height: 202rpx !important;
  border-radius: 10rpx;
}
```