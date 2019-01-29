
const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/item-model');
const uploadCloud = require('../configs/cloudinary.js');
const router = express.Router();

let csvToJson = require('convert-csv-to-json');
var inserted = 0, duplicated= 0, toShoot=0

const csv=require('csvtojson')

function makeItem (rawItem){
  const {PC9, VS_GLOBAL, SKU_SEARS, SKU_LIVERPOOL,
  MARCA,GENDER,COLLECTION,USE_TYPE,LINE,
  NAME,DESCRIPTION,EXTENDED_DESCRIPTION,
  MATERIAL,COLOR,SPANISH_COLOR,
  SHOOTING,STATUS} = rawItem
  let shootBoolean = false
  let statusToReplace = 'Nuevo'

  if (SHOOTING === 'SI'){
    shootBoolean = true
    statusToReplace = 'Buscando'
  }

  const item = {
    pc9:PC9,
    vsGlobal:VS_GLOBAL,
    brand:MARCA,
    gender:GENDER,
    brandCollection:COLLECTION,
    useType:USE_TYPE,
    line:LINE,
    name:NAME,
    description:DESCRIPTION,
    extendedDescription:EXTENDED_DESCRIPTION,
    composition:MATERIAL,
    color:COLOR,
    spanishColor:SPANISH_COLOR,
    shooting: shootBoolean,
    status:statusToReplace,
    skus:{
      sears:SKU_SEARS,
      liverpool:SKU_LIVERPOOL
    }
  }
  return item
}

function makeItemsCollection(rawItems){
  const itemsOk =[]
  let lookFor = 0
  rawItems.map(rawItem =>{
    if(rawItem.SHOOTING === 'SI'){
      lookFor++
    }
    itemsOk.push(makeItem(rawItem))
  })
  return [itemsOk,lookFor]
}


// POST route => to upload a new csv file
router.post('/uploadcsv', (req, res, next)=>{
   const csvFilePath=req.files.csvFile.tempFilePath
   csv()
   .fromFile(csvFilePath)
   .then(itemsJSON=>{
      const [arrItems, lookFor] = makeItemsCollection(itemsJSON)
      Item.collection.insert(arrItems)
      .then(result =>{
        res.status(201).json({
          'inserted':result.insertedCount,
          'duplicated':0,
          'toShoot':lookFor
        })
      }).catch(e=>{
        res.status(400).json({
          'inserted':e.result.nInserted,
          'duplicated':e.writeErrors.length,
          'toShoot':lookFor
        })
      })
    }).catch(err => {
      res.status(400).json(err)
   })
})

// GET route => to get items from db
router.get('/getItems', (req,res,next)=>{
  Item.find()
  .then(result =>{
    res.status(201).json(result)
  })
  .catch(err =>{
    res.status(400).json(err)
  })
})



module.exports = router;