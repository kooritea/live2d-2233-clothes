'use strict'

const AppData = require('./lib/AppData.js')
const bilibili = require('./lib/bilibili.js')
const saveClothes = require('./lib/saveClothes.js')
const fs = require('fs')

async function main(ClothesName){
  //AppData.lastCheckTime()
  let closet = []
  if(!ClothesName){
    closet = await bilibili.getAllClothesName()//设置了延迟查询
  } else {
    closet.push({
      host: 's1.hdslb.com',
      ClothesName,
      path: 'bfs/static/blive/live-assets/haruna'
    })
  }
  let haveNewClothes = saveClothes.contrastCloset(closet)
  if(haveNewClothes){
    //下载了新衣服，准备提交
    AppData.lastCheckTime()
    let clothesList = ''
    for(let clothes of AppData.readData('closet')){
      clothesList +=`${clothes}\n\n`
    }
    let md = `# live2d-2233-clothes\n\n> 一个自动爬取B站直播间2233衣服的项目\n\n## 最后发现新衣服时间 ${AppData.readData('lastCheckTime')}\n\n## 列表\n\n${clothesList}\n\n[保存地址](./dist)`
    fs.writeFile('./README.md',md,(err)=>{
    	if(err){
    		console.log('更新readme出错'+err)
    	}
    })
  }
}
main()
