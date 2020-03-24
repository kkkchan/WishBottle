const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feed: [],
    flag: 2,
    delArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      flag: options.flag
    })
    if (options.flag == 1) {
      wx.setNavigationBarTitle({
        title: '赞'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '评论'
      })
    }
    var that = this;
    var cookieKey = app.globalData.cookieKey;
    wx.request({
      url: app.globalData.url + 'getMyComment',
      header: {
        'cookie': cookieKey
      },
      success: function (res) {
        if (res.statusCode == '200') {
          that.setData({
            feed: res.data.jsonArray
          })
        }
      }
    })
  },
  delMyComment: function (e) {
    var id = e.currentTarget.id;
    var arrId = e.currentTarget.dataset.arrid;
    console.log(arrId)
    var that = this;
    var cookieKey = app.globalData.cookieKey;
    wx.showModal({
      title: '确定删除吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + 'delComment?id=' + id,
            header: {
              'cookie': cookieKey
            },
            success(res) {
              if (res.statusCode == '200') {
                var arr = that.data.delArr;
                arr.push(arrId);
                that.setData({
                  delArr: arr
                })
                wx.showToast({
                  title: '删除成功',
                })
              }
            }
          })
        }
      }
    })
  },
  nvToTreeReply: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '../treeReply/treeReply?id=' + id,
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