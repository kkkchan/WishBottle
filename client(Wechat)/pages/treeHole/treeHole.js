// pages/bottle/bottle.js

var app= getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      feed:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var cookieKey = app.globalData.cookieKey;
    console.log(cookieKey);
      wx.request({
        url: app.globalData.url+'getTreeHole',
        header:{
          'cookie': cookieKey
        },
        success(res){
          wx.hideLoading();
          if(res.statusCode=='200'){
            that.setData({
              feed: res.data.jsonArray
            });
          }
        }
      })
  },

  bindItem:function(e){
    var id=e.currentTarget.id
    var isMine=e.currentTarget.dataset.ismine
    wx.navigateTo({
      url: '/pages/treeReply/treeReply?id='+id+'&isMine='+isMine,
    })
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
    var that = this;
    var cookieKey = app.globalData.cookieKey;
    //var cookieKey = wx.getStorageSync("cookieKey")
    wx.request({
      url: app.globalData.url +'getTreeHole',
      header: {
        'cookie': cookieKey
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == '200') {
          that.setData({
            feed: res.data.jsonArray
          });
        }
      }
    })
    wx.stopPullDownRefresh();
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