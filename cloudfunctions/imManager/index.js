// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  var mymanager = event.manager
  var myopenid = event.openid
  const managerResult = await db.collection('user').where({
    openid: myopenid
  }).get()
  const ismanager = managerResult.manager
  if (ismanager == true) {
    return {
      manager = true
    }
  } else {
    return {
      manager = false
    }
}
}