//app.js
var mylogin=require("mylogin.js");
App({

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);


    var cookieKey = wx.getStorageSync("cookieKey");
    console.log(cookieKey);
    if(!cookieKey){
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: this.globalData.url+'login',
            data: {
              code: res.code
            },
            success: res => {
              console.log(res.data.cookiekey)
              // var cookieKey = res.header['Set-Cookie'];
              wx.setStorageSync('cookieKey', res.data.cookiekey);
              this.globalData.cookieKey = res.data.cookiekey;
              console.log(this.globalData.cookieKey)
            }
          })
        }
      })
     
    }else{
      this.globalData.cookieKey = cookieKey;
      console.log(this.globalData.cookieKey);
      wx.checkSession({
        fail:function(){
          console.log('session fail')
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wx.request({
                url: this.globalData.url+'login',
                data: {
                  code: res.code
                },
                success: res => {
                  // var cookieKey = res.header['Set-Cookie'];
                  console.log(res.data.cookiekey);
                  wx.setStorageSync('cookieKey', res.data.cookiekey);
                  this.globalData.cookieKey = res.data.cookiekey;
                  console.log(this.globalData.cookieKey);
                }
              })
            }
          })
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },



  userLogin: function (obj) {
    return new Promise(function (resolve, reject) {
      wx.login({
        
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: this.globalData.url+'login',
            data: {
              code: res.code
            },
            success: res => {
              // var cookieKey = res.header['Set-Cookie']; 
              console.log(res.data.cookiekey)
              wx.setStorageSync('cookieKey', res.data.cookiekey);
              this.globalData.cookieKey = res.data.cookiekey;
              console.log(this.globalData.cookieKey)
              resolve(res);
            }
          })
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    cookieKey: null,
    url:'http://localhost:8000/wx/'
    // url:'http://183.92.249.12:8000/wx/'
    // url:'http://39.105.95.246:8000/wx/',
  }
})
