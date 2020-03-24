var app = getApp();
Page({
  data: {
    isShow: true
  },
  onLoad: function () {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
          })
        }

        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '../center/center'
          })
        } else {
          that.setData({
            isShow: true
          })
        }
      }
    })
  },

  //用户按了允许授权按钮
  onAuth:function(e){
    wx.authorize({
      scope: 'scope.record',
    })
    var cookieKey = app.globalData.cookieKey;
    console.log(cookieKey);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      isShow:false
    });
    console.log(e.detail.encryptedData);
    console.log(e.detail.iv);
    wx.request({
      url: app.globalData.url+'userInfo',
      method:'post',
      data:{
        iv:e.detail.iv,
        encryptedData:e.detail.encryptedData
      },
      header: {
        'cookie': cookieKey,
        'content-type':'application/x-www-form-urlencoded'
      }, 
      success(res){
        console.log(res);
      }
    });

      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '../center/center'
      });
    }
})