const app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: null,
    isShow: 0,
    itemType: 1,      //0代表语音 1代表文字
    city: null,
    province: null,
    avatarUrl: null,
    sex: null,
    content: null,
    nickName: null,
    strPostDate: null,
    isNone: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.animation2 = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear'
    })
    this.animation1 = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear'
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
      url: app.globalData.url+'checkNewMessage',
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

  throwBottle: function () {
    wx.navigateTo({
      url: '../throwbottle/throwbottle',
    })
  },

  pickUpBottle: function () {
    var that = this;
    that.animation1.width(0).height(0).step();
    that.setData({
      animation: that.animation1.export()
    });
    setTimeout(() => {
      this.animation2.translateY(150).rotate(400).width(100).height(100).step();
      this.setData({
        animation: this.animation2.export()
      });
    }, 100);
    var cookieKey = app.globalData.cookieKey;
    wx.request({
      url: app.globalData.url+'getWishBottle',
      header: {
        'cookie': cookieKey
      },
      success: function (res) {
        if (res.statusCode == '200') {
          that.setData({
            // itemType: res.data.itemType,
            city: res.data.city,
            province: res.data.province,
            sex: res.data.sex,
            avatarUrl: res.data.avatarUrl,
            content: res.data.content,
            nickName: res.data.nickName,
            strPostDate: res.data.strPostDate
          })
        }
        if (res.statusCode == '204') {
          that.setData({
            isNone: 1
          })
        }
      }
    })
  },
  closeMask: function () {
    this.setData({
      isShow: 0
    })
  },
  bindWishBottle: function () {
    if (this.data.isNone) {
      wx.showToast({
        title: '什么也没有，去扔一个吧',
        icon: 'none'
      })
      return
    }

    this.setData({
      isShow: 1
    })
  },
  bindPlayVoice: function () {
    //innerAudioContext.autoplay = true
    innerAudioContext.src = app.globalData.url+'voice/' + this.data.content;
    innerAudioContext.play();
  },
  myBottle: function () {
    wx.navigateTo({
      url: '../myBottle/myBottle',
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