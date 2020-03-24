// pages/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likeNum: 0,
    commentNum: 0
  },


  bindNewLike:function(){
    wx.navigateTo({
      url: '../newLike/newLike?flag=1',
    })
  },
  bindNewComment:function(){
    wx.navigateTo({
      url: '../newLike/newLike?flag=0',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  //   if (typeof this.getTabBar === 'function' &&
  //     this.getTabBar()) {
  //     this.getTabBar().setData({
  //       selected: 2
  //     })
  //   }
  // },
    var that = this;
    var cookieKey = app.globalData.cookieKey;
    console.log(cookieKey)
    wx.request({
      url: app.globalData.url +'checkNewMessage',
      header: {
        'cookie': cookieKey
      },
      success: function (res) {
        if (res.statusCode == '200') {
          that.setData({
            likeNum: res.data.likeNum,
            commentNum: res.data.commentNum
          })
          if (res.data.likeNum != 0 || res.data.commentNum != 0) {
            wx.showTabBarRedDot({
              index: 3,
            })
          } else {
            wx.hideTabBarRedDot({
              index: 3,
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})