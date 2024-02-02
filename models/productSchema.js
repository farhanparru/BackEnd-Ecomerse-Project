const mongoose = require("mongoose")
const productschema = new mongoose.Schema({
     title:String,
     discription:String,
     price:Number,
     image:String,
     category:String
})

module.exports = mongoose.model("Product",productschema)