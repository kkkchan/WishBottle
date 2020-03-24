// pages/throwbottle/throwbottle.js
const recorderManager = wx.getRecorderManager();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: 1,  //1表示文字  0表示音频
    tempFilePath: null,
    startPageY: null,
    isCancle: 0,  //判断是否取消发送  1表示取消
    animation: null,
    content: '',
    textAreaValue: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.animation2 = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear',
    })
    this.animation1 = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    })
    var cookieKey = app.globalData.cookieKey;
    recorderManager.onError((errMsg) => {
      console.log(errMsg)
    })
    recorderManager.onStop((res) => {
      this.setData({
        tempFilePath: res.tempFilePath
      })
      if (!this.data.isCancle) {


        var that = this;
        this.animation1.width(100).height(100).step();
        this.setData({
          animation: this.animation1.export()
        });
        this.animation2.translateY(-60).translateX(-60).rotate(360).scale(0, 0).step();
        this.setData({
          animation: this.animation2.export()
        });

        setTimeout(() => {
          that.animation1.width(0).height(0).step();
          that.setData({
            animation: that.animation1.export()
          })
        }, 611)
        wx.uploadFile({
          url: app.globalData.url+'fileUpload',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            'cookie': cookieKey,
            'Content-Type': 'multipart/form-data' //指定传输的数据为二进制数据
            //'Content-Type':'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if (res.data == '200') {
              console.log(123)
            }
          }
        })
      }
    })
  },

  // bindIcon: function () {
  //   this.setData({
  //     flag: !this.data.flag
  //   })
  // },
  bindTextAreaInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  throwOut: function () {
    var content = this.data.content;
    if (content == '') {
      wx.showToast({
        title: '请输入心愿',
        icon: 'none'
      })
      return
    }
    var that = this;
    this.animation1.width(100).height(100).step();
    this.setData({
      animation: this.animation1.export()
    });
    this.animation2.translateY(-60).translateX(-60).rotate(360).scale(0, 0).step();
    this.setData({
      animation: this.animation2.export()
    });
    setTimeout(() => {
      that.animation1.width(0).height(0).step();
      that.setData({
        animation: that.animation1.export()
      })
    }, 611)
    this.setData({
      textAreaValue: '',
      content: ''
    })
    var cookieKey = app.globalData.cookieKey;
    wx.request({
      url: app.globalData.url+'setWishBottle',
      method: 'POST',
      header: {
        'cookie': cookieKey
      },
      // 希望三月无灾无难
      data: {
        content: content,
      },
      success: function (res) {
        if (res.statusCode == '200') {
          console.log("成功");
        }
      }
    })
  },
  showTips: function () {
    wx.showToast({
      title: '说话事件太短',
      icon: 'none'
    })
  },
  beginRecord: function (e) {
    var pageY = e.touches[0].pageY;
    console.log(pageY);
    this.setData({
      startPageY: pageY
    })
    recorderManager.start({
      format: 'mp3',
    });
    wx.showToast({
      title: '上滑可取消发送',
      image: '/imgs/voice.png',
      duration: 60000,
    })
    console.log("begin")
  },
  endRecord: function () {
    wx.hideToast();
    recorderManager.stop();
    console.log("end");
  },
  upCancle: function (e) {
    var pageY = e.touches[0].pageY;
    console.log(this.data.startPageY - pageY);
    if (this.data.startPageY - pageY > 70 && this.data.isCancle == 0) {
      wx.hideToast();
      this.data.isCancle = 1;
      wx.showToast({
        title: '取消',
        image: '/imgs/cancle.png',
        duration: 60000
      })
    }
    if (this.data.startPageY - pageY <= 70 && this.data.isCancle == 1) {
      wx.hideToast();
      this.data.isCancle = 0;
      wx.showToast({
        title: '上滑可取消发送',
        image: '/imgs/voice.png',
        duration: 60000,
      })
    }
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