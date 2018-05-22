'use strict'

const AppData = require('./AppData.js')
var https = require('https')
const path = require('path')
const fs = require('fs')

function contrastCloset(closet){
  let haveNewClothes = false //判断是否发现新衣服的记录值
  let myCloset = AppData.readData('closet')//浅拷贝
  for(let clothes of closet){
    if(!clothes||myCloset.indexOf(clothes.ClothesName)<0){
      console.log('发现新衣服：'+clothes.ClothesName)
      haveNewClothes = true
      AppData.addClothes(clothes.ClothesName)//添加到以保存的衣服的记录
      saveNewClothes(clothes)//下载保存衣服
    }
  }
  return haveNewClothes
}

function saveNewClothes(clothes){
  download(clothes.host,clothes.path,clothes.ClothesName,22)
  download(clothes.host,clothes.path,clothes.ClothesName,33)
}

function download(host,path,ClothesName,name){
  for(let i=1;i<4;i++){
    let req = https.get({
      host: host,
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36' },
      path:'/'+`${path}/${name}/${name}.1024/${ClothesName}/texture_0${i}.png`
    },(response) => {
      response.setEncoding('binary')
      let body = ''
      response.on('data',(data) => {
        body += data
      })
      response.on('end',() => {
        if(response.statusCode === 200){
          let exists = fs.exists(path.join(__dirname,`../dist/${name}/${ClothesName}`))
          if(exists){
            fs.writeFile(path.join(__dirname,`../dist/${name}/${ClothesName}/texture_0${i}.png`,body,'binary',(err)=>{});
          }
          else{
            fs.mkdirSync(path.join(__dirname,`../dist/${name}/${ClothesName}`))
            fs.writeFile(path.join(__dirname,`../dist/${name}/${ClothesName}/texture_0${i}.png`,body,'binary',(err)=>{});
          }
        }
      })
      response.on('error',(err) => {

      })
    })
  }
}


module.exports = {
  contrastCloset,
  download
}
