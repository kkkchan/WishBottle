
function dologin(){
  return new Promise(function (resolve,reject){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://localhost:8000/wx/login',
          data: {
            code: res.code
          },
          success: res => {
            var cookieKey = res.header['Set-Cookie'];
            wx.setStorageSync('cookiekey', cookieKey);
            resolve(cookieKey)
          }
        })
      }
    })
  })
}

module.exports.dologin = dologin;

