// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var myavatarUrl = event.avatarUrl
  var mynickName = event.nickName
  var myopenid = event.openid
  var mymanager = event.manager
  try {
    return await db.collection('user').doc(myopenid).set({
      data: {
        avatarUrl: myavatarUrl,
        manager: mymanager,
        nickName: mynickName,
        openid: myopenid
      }
    })
  } catch (e) {
    console.log(e)
  }
}