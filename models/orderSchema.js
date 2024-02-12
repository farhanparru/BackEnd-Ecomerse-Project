const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userid:String,
    products:[{type:mongoose.Schema.ObjectId,ref:'Product'}],
    // This field stores the date of the order. It defaults to the current date in the local time zone
    date:{type: String, default: new  Date().toLocaleDateString()},
    // This field stores the time of the order. It defaults to the current time in the local time zone
    time:{type:String,default: new Date().toLocaleTimeString()},
    order_id: String,
    payment_id: String,
    // /This field stores the total amount of the order. It is of type Number.
    total_amount: Number,
})

module.exports = mongoose.model('orders', orderSchema)