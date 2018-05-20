'use strict'

const fs = require('fs')
const path = require('path')
const pubfun = require('./pubfun.js')

var Data = JSON.parse((fs.readFileSync(path.join(__dirname, '../data.json'))).toString())


function readData(key){
  return Data[key]
}

function writeData(key,valve){
  Data[key] = valve
  save()
}

function addClothes(name){
  Data.closet.push(name)
  save()
}

function save(){
  fs.writeFile(path.join(__dirname, '../data.json'), JSON.stringify(Data),(err)=>{
    if(err){
      console.log(err)
    }
  })
}

function lastCheckTime(){
  let lastTime = pubfun.format(new Date(),'yyyy/MM/dd HH:mm:ss')
  Data.lastCheckTime = lastTime
  writeData('lastCheckTime',lastTime)
}
module.exports = {
  readData,
  writeData,
  lastCheckTime,
  addClothes
}
