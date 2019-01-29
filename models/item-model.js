// models/item-model.js

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const itemSchema = new Schema({
  pc9:{
    type:String,
    unique:true
  },
  vsGlobal:{
    type:String,
    unique:true
  },
  brand:String,
  gender:String,
  brandCollection:String,
  useType:String,
  line:String,
  name:String,
  description:String,
  extendedDescription:String,
  composition:String,
  color:String,
  spanishColor:String,
  shooting:Boolean,
  masters:{
    type:Array,
    default:[]
  },
  status:{
    type:String,
    enum:['Nuevo', 'Buscando', 'Encontrado', 'En estudio', 'En shooting', 'Faltan masters', 'Por revisar', 'Aprobado','Con comentarios'],
    default:'Nuevo'
  },
  skus:{
    type:Object,
    default:{}
  },
  comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
},
{
  timestamps: { 
    createdAt: "created_at", 
    updatedAt: "updated_at"
  }}
  );

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;