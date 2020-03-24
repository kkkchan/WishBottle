// pages/treeReply/treeReply.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treeHole:null,
    treeHoleId:0,
    treeReplies:null,
    isLike:0,
    isCollect:0,
    isShow:0,
    isEnlarge:0,
    clientHeight:0,
    height:0,
    inputHeight:250,
    cookieKey:null,
    isMine: 0,
    delArr: [],
    inputValue: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.isMine != undefined) {
      this.setData({
        isMine: options.isMine
      })
    }
    this.data.treeHoleId = options.id;

    var that=this;
    var cookieKey = app.globalData.cookieKey;
    this.setData({
      cookieKey:cookieKey
    })
    //树洞的id
    var id= options.id;
    wx.request({
      url: app.globalData.url+'getTreeReply?id='+id,
      header:{
        'cookie': that.data.cookieKey
      },
      success(res){
          if(res.statusCode=='200'){
            that.setData({
              treeHole:res.data.treeHole,
              treeReplies:res.data.treeReplies
            })
          }
      },
    });

    wx.request({
      url: app.globalData.url+'doCollectAndLike?treeHoleId=' + id,
      header:{
        'cookie': that.data.cookieKey
      },
      success(res){
        if(res.statusCode=='200'){
          that.setData({
            isCollect:res.data.isCollect,
            isLike: res.data.isLike
          })
        }
      }
    })
  },

  bindLike:function(){
    var that= this;
    this.setData({
      isLike: !this.data.isLike
    });
    wx.request({
      url: app.globalData.url+'doCollectAndLike?flag=0&treeHoleId=' + that.data.treeHoleId + '&YoN=' + that.data.isLike,
      header:{
        'cookie':that.data.cookieKey
      },
      success:function(res){
        if (res.statusCode=='200'){
          console.log('success')
        }
      }
    })
  },

  bindCollect:function(){
    var that =this;
    this.setData({
      isCollect: !this.data.isCollect  // this.data.isCollect^1 0和1相互转换
    });
    wx.request({
      url: app.globalData.url+'doCollectAndLike?flag=1&treeHoleId=' + that.data.treeHoleId+'&YoN='      +that.data.isCollect,
      header:{
        'cookie': that.data.cookieKey
      },
      success:function(res){
        if (res.statusCode=='200'){
          console.log('success')
        }

      }
    })
  },

  bindComment:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  },

  closeMask:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  uploadComment:function(e){
    let that = this
    if (that.data.inputValue==''){
      wx.showToast({
        title: '请输入内容',
      })
    }else{
      wx.request({
        url: app.globalData.url + 'setTreeReply',
        header: {
          'cookie': that.data.cookieKey
        },
        method: 'POST',
        data: {
          content: that.data.inputValue,
          treeholeid: that.data.treeHoleId,
        },
        success(res) {
          if (res.statusCode == '200') {
            wx.showToast({
              title: '评论成功',
            })
            console.log("成功")
            that.setData({
              inputValue: '',
            })
          }
        }
      })
    }
  },
  delComment: function (e) {
    var id = e.currentTarget.id;
    var arrId = e.currentTarget.dataset.arrid;
    var that = this;
    wx.showModal({
      title: '确定删除吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url +'delComment?id=' + id,
            header: {
              'cookie': that.data.cookieKey
            },
            success(res) {
              if (res.statusCode == '200') {
                console.log("success")
                var arr = that.data.delArr;
                arr.push(arrId);
                console.log(arr.length);
                for (var j = 0; arr[j] != null; j++) {
                  console.log(arr[j])
                }
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
    var that = this;
    var cookieKey = app.globalData.cookieKey;

    wx.request({
      url: app.globalData.url + 'getTreeReply?id=' + that.data.treeHoleId,
      header: {
        'cookie': cookieKey
      },
      success(res) {
        wx.hideLoading();
        if (res.statusCode == '200') {
          that.setData({
            treeHole: res.data.treeHole,
            treeReplies: res.data.treeReplies
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