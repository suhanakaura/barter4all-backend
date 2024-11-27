const mongoose = require('mongoose')
const paymentSchema = new mongoose.Schema({
    transactionId:{
        type:String,
        required:true,
        unique:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    payer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    status:{
        type:String,
        enum:['Pending','Completed','Failed'],
        default:'Pending'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Payment = mongoose.model('Payment',paymentSchema)
module.exports = Payment