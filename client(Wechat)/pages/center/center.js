// pages/center/center.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },
  bindMyBottle: function () {
    wx.navigateTo({
      url: '../myBottle/myBottle',
    })
  }
  ,
  bindMyCollect: function () {
    wx.navigateTo({
      url: '../myCollect/myCollect',
    })
  },
  bindMyTreeHole: function () {
    wx.navigateTo({
      url: '../myTreeHole/myTreeHole',
    })
  },
  bindMyComment: function () {
    wx.navigateTo({
      url: '../myComment/myComment?flag=2',
    })
  },
  onShow: function () {
    var cookieKey = app.globalData.cookieKey;
    wx.request({
      url: app.globalData.url +'checkNewMessage',
      header: {
        'cookie': cookieKey
      },
      success: function (res) {
        if (res.statusCode == '200') {
          if (res.data.likeNum != 0 || res.data.commentNum != 0) {
            wx.showTabBarRedDot({
              index: 3,
            })
          }
        }
      }
    })
  },
})