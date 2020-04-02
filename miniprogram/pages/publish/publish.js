// pages/publish/publish.js
var timeUtil = require('../../utils/timeUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    // imgList: [],
    textInput: '',
    textareaInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 发布图片代码
  // ChooseImage() {
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['compressed'],
  //     sourceType: ['album'],
  //     success: (res) => {
  //       if (this.data.imgList.length != 0) {
  //         this.setData({
  //           imgList: this.data.imgList.concat(res.tempFilePaths)
  //         })
  //       } else {
  //         this.setData({
  //           imgList: res.tempFilePaths
  //         })
  //       }
  //     }
  //   });
  // },
  // ViewImage(e) {
  //   wx.previewImage({
  //     urls: this.data.imgList,
  //     current: e.currentTarget.dataset.url
  //   });
  // },
  // DelImg(e) {
  //   wx.showModal({
  //     title: '提示',
  //     content: '确定要删除这张图片吗？',
  //     cancelText: '再看看',
  //     confirmText: '删除',
  //     success: res => {
  //       if (res.confirm) {
  //         this.data.imgList.splice(e.currentTarget.dataset.index, 1);
  //         this.setData({
  //           imgList: this.data.imgList
  //         })
  //       }
  //     }
  //   })
  // },
  textInput(e) {
    this.setData({
      textInput: e.detail.value
    })
  },
  textareaInput(e) {
    this.setData({
      textareaInput: e.detail.value
    })
  },
  publishBt: function() {
    const mytitle = this.data.textInput
    const mycontent = '　　' + this.data.textareaInput
    const mydatetime = timeUtil.formatTime(new Date());
    if (mytitle == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入标题',
      })
      return
    }
    if (mycontent == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
      return
    }

    // that = this;
    // wx.cloud.init();
    wx.cloud.callFunction({
      name: 'msgSC',
      data: {
        text: mytitle + mycontent
      }
    }).then((res) => {
      console.log('res.result.code is ' + res.result.code)
      if (res.result.code == "200") {
        //检测通过
        console.log('text is' + mycontent)
        wx.showLoading({
          title: '发布中',
        })
        wx.cloud.callFunction({
          name: 'addBlog',
          data: {
            datetime: mydatetime,
            content: mycontent,
            openid: wx.getStorageSync("openid"),
            // picture: mypicture,
            title: mytitle
          },
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    url: '../myBlog/myBlog'
                  })
                }, 2000);
              }
            })
          },
          fail: function (res) {
            console.log(res)
            wx.showToast({
              icon: 'none',
              title: '发布失败',
            })
          }
        })
      } else {

        //执行不通过
        wx.showToast({
          title: '包含敏感字哦。',
          icon: 'none',
          duration: 3000
        })
      }
    })

    // 选择图片代码
    // if (this.data.imgList.length == 0) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请选择图片',
    //   })
    //   return
    // }
    
    // 上传图片
    // const filePath = this.data.imgList[0]
    // const cloudPath = (Math.random() * 1000000) + "" + filePath.match(/\.[^.]+?$/)[0]
    
    // wx.cloud.uploadFile({
      // cloudPath,
      // filePath,
      // success: res => {
        // console.log('[上传图片] 成功：', res)
        // const mypicture = res.fileID
        
          
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '发布失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    // })
  // }
})