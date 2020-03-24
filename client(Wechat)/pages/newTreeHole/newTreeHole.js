// pages/newTreeHole/newTreeHole.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleText: "",
    contentText: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  publish: function (e) {
    var cookieKey = app.globalData.cookieKey;
    var that = this;
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    if (title == '') {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return
    }
    if (content == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: app.globalData.url +'setTreeHole',
      method: 'POST',
      header: {
        'cookie': cookieKey,
      },
      data: {
        'title': e.detail.value.title,
        'content': e.detail.value.content
      },
      success: function (res) {
        if (res.statusCode == '200') {
          console.log('发布成功');
          wx.showToast({
            title: '发布成功',
          })
          that.setData({
            titleText: "",
            contentText: "",
          });
        }
      }
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