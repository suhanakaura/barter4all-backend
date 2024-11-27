const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Message = mongoose.model("Message",messageSchema);
module.exports = Message