// pages/blogDetail/blogDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogdata: {},
    bloguserdata: {},
    commentinfo: {},
    commentuserinfo: {},
    isHavaCollect: false,
    hidden:true,
    manager:false,
    // password: null,
    // rootpassword: 365520,
    myopenid: wx.getStorageSync("openid")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this
    self.setData({
      blogdata: JSON.parse(options.blogdata),
      bloguserdata: JSON.parse(options.bloguserdata)
    })
    console.log('bloguserdata' +self.data.bloguserdata.openid)
    wx.setNavigationBarTitle({
      title: JSON.parse(options.blogdata).title
    })
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        blogid: JSON.parse(options.blogdata)._id
      },
      success: function(res) {
        self.setData({
          commentinfo: res.result.commentinfo.data,
          commentuserinfo: res.result.commentuserinfo.data
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
    wx.cloud.callFunction({
      name: 'isCollect',
      data: {
        blogid: self.data.blogdata._id,
        openid: wx.getStorageSync("openid")
      },
      success: function(res) {
        self.setData({
          isHavaCollect: res.result.isHavaCollect
        })
        console.log(res.result.isHavaCollect)
      },
      fail: function(res) {
        console.log(res)
      }
    })
    wx.cloud.callFunction({
      name: 'isManager',
      data: {
        // manager: self.data.manager,
        openid: self.data.myopenid,
        // ismanager: wx.setStorageSync("manager")
      },
      success: function (res) {
        console.log('res.result')
        console.log(res.result.data[0].manager)
        if (res.result.data[0].manager == true){
          console.log('删除函数执行到了true')
          self.setData({
        hidden: false
      })
      }
      else{
          self.setData({
            hidden: true
          })
      }
        console.log(res.result)
      },
      fail: function (res) {
        console.log('删除函数执行到了fail')
        self.setData({
          hidden: true
        })
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // var userid = String(self.data.bloguserdata.openid)
    // console.log('初次渲染完成' + userid)
    // var test = userid.charAt(0)
    console.log('self.data.myopenid')
    console.log(self.data.myopenid)
    // console.log(test)
    // if (test == ')') {
    //   self.setData({
    //     hidden: false
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    self = this
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        blogid: self.data.blogdata._id
      },
      success: function(res) {
        console.log("comment info")
        console.log(res.result)
        self.commentinfo = res.result.commentinfo.data[0]
        self.commentuserinfo = res.result.commentuserinfo.data[0]
        // self.setData({
        //   commentinfo: res.result.commentinfo.data,
        //   commentuserinfo: res.result.commentuserinfo.data
        // })
        
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
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
  onCollect: function() {
    self = this
    console.log(self.data.isHavaCollect)
    wx.showLoading({
      title: '加载中',
    })
    if (self.data.isHavaCollect == true) {
      wx.cloud.callFunction({
        name: 'deleteCollect',
        data: {
          blogid: self.data.blogdata._id,
          openid: wx.getStorageSync("openid")
        },
        success: function(res) {
          console.log(res)
          if (res.result.msg == 'ok') {
            wx.showToast({
              icon: 'none',
              title: '取消收藏成功',
            })
            self.setData({
              isHavaCollect: false
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '取消收藏失败',
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'addCollect',
        data: {
          blogid: self.data.blogdata._id,
          openid: wx.getStorageSync("openid")
        },
        success: function(res) {
          console.log(res)
          if (res.result.msg == 'ok') {
            wx.showToast({
              icon: 'none',
              title: '收藏成功',
            })
            self.setData({
              isHavaCollect: true
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '收藏失败',
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }

  },
  writecomment: function() {
    self = this
    wx.navigateTo({
      url: '../writecomment/writecomment?blogid=' + self.data.blogdata._id
    });
  },

  managerDel:function(event) {
    var blogdata = this.commentinfo
    console.log(self.data.blogdata)
    // var blogdata = event.currentTarget.dataset.item
    // var blogindex = event.currentTarget.dataset.index
    self = this
    console.log(self.data.myopenid)
    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            name: 'deleteBlog',
            data: {
              blogid: self.data.blogdata._id
            },
            success: function (res) {
              console.log(res)
              if (res.result.msg == 'ok') {
                // wx.cloud.delete({
                  // fileList: [blogdata.picture],
                  // success: res => {
                    
                    // self.data.bloginfo.splice(blogindex, 1)
                    // self.data.userinfo.splice(blogindex, 1)
                    // self.setData({
                    //   bloginfo: self.data.bloginfo,
                    //   userinfo: self.data.userinfo
                    // })
                  //   self.commentinfo = {};
                  //   self.commentuserinfo = {};
                  // },
                  // fail: console.error
                // })
                wx.showToast({
                  icon: 'none',
                  title: '删除成功',
                })
                self.blogdata = {}
                self.bloguserdata = {}
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '删除失败',
                })
              }
            },
            fail: function (res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  delcomment: function(event) {
    self = this
    var commentid = event.currentTarget.dataset.id
    var blogid = this.data.blogdata._id
    var commentindex = event.currentTarget.dataset.commentindex
    wx.showModal({
      title: '提示',
      content: '确认删除这条评论?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            name: 'deleteComment',
            data: {
              commentid: commentid,
              myblogid: blogid
            },
            success: function(res) {
              console.log(res)
              if (res.result.msg == 'ok') {
                wx.showToast({
                  icon: 'none',
                  title: '删除成功',
                })
                self.data.commentinfo.splice(commentindex, 1)
                self.data.commentuserinfo.splice(commentindex, 1)
                self.setData({
                  commentinfo: self.data.commentinfo,
                  commentuserinfo: self.data.commentuserinfo
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '删除失败',
                })
              }
            },
            fail: function(res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})