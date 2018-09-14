'use strict'

const https = require('https')

function getLiveList(){
  return new Promise(async (res,rej)=>{
    let req = https.get({
      host: 'api.live.bilibili.com',
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' },
      path: '/room/v1/RoomRecommend/biliIndexRecList'
    },(response) => {
      let body = ''
      response.on('data',(data) => {
        body += data
      })
      response.on('end',() => {
        res(JSON.parse(body).data.recommend)
      })
      response.on('error',(err) => {
        console.log('获取房间列表出错')
        rej(err)
      })
    })
  })
}

function getClothesName(roomId){
  return new Promise(async (res,rej)=>{
    let req = https.get({
      host: 'api.live.bilibili.com',
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' },
      path: `/live/getRoomKanBanModel?roomid=${roomId}`
    },(response) => {
      let body = ''
      response.on('data',(data) => {
        body += data
      })
      response.on('end',() => {
        body = JSON.parse(body)
        let host = (body.textures[1].match(/https:\/\/(.*?)\/(.*?)\/(22|33)\/(22|33)\.1024\/(.*?)\/texture_/))[1]
        let ClothesName = (body.textures[1].match(/https:\/\/(.*?)\/(.*?)\/(22|33)\/(22|33)\.1024\/(.*?)\/texture_/))[5]
        let path = (body.textures[1].match(/https:\/\/(.*?)\/(.*?)\/(22|33)\/(22|33)\.1024\/(.*?)\/texture_/))[2]
        res({host,ClothesName,path})
      })
      response.on('error',(err) => {
        rej(err)
      })
    })
  })
}

async function getAllClothesName(){
  let liveList = await getLiveList()
  let closet = []
  for(let item of liveList){
    closet.push((await getClothesName(item.roomid)))
    await sleep(1000)
  }
  return closet
}

function sleep(s){
  return new Promise(async (res)=>{
    setTimeout(()=>{
      res(1)
    },s)
  })
}

module.exports = {
  getAllClothesName
}
