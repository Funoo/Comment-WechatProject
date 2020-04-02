// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var mymanager = event.manager
  var myopenid = event.openid
  const managerResult = await db.collection('user').where({
    openid: myopenid
  }).get()
  // const ismanager = managerResult.manager
  // if(ismanager == true){
  //   return{
  //     manager : true
  //   }
  // }else{
  //   return{
  //     manager : false
  //   }
  return managerResult
  // }
  // db.collection('user').where({
  //   manager: 'manager',
  // })
  //   .get({
  //     success: function (res) {
  //       console.log('success????' + manager)
  //       return manager
  //       console.log(res.data)
  //     }
  //   })
}