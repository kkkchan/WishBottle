// pages/collect/collect.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      likeFeed:[],
      collectFeed:[],
      sliderOffset: 0,
      sliderLeft: 0,
      tabs:["赞","收藏"],
      activeIndex:0,
      delArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var cookieKey = app.globalData.cookieKey;
    console.log(cookieKey);
    wx.request({
      url: app.globalData.url+'getMyCollectAndLike',
      header: {
        'cookie': cookieKey
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == '200') {
          that.setData({
            collectFeed: res.data.jsonArray_collect,
            likeFeed: res.data.jsonArray_like,
          });
        }
      }
    })
  },

  tabClick: function (e) {
    console.log(this.data.activeIndex)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  bindItem:function(e){
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/treeReply/treeReply?id=' + id,
    })
  },
  bindItemLong: function (e) {
    var cookieKey = app.globalData.cookieKey;
    var id = e.currentTarget.id;
    var arrId = e.currentTarget.dataset.arrid;
    var that = this;
    wx.showModal({
      title: '取消收藏吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url+'doCollectAndLike?flag=1&treeHoleId=' + id + '&YoN=0',
            header: {
              'cookie': cookieKey
            },
            success: function (res) {
              if (res.statusCode == '200') {
                var arr = that.data.delArr;
                arr.push(arrId);
                that.setData({
                  delArr: arr
                })
                wx.showToast({
                  title: '取消收藏',
                })
              }

            }
          })
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