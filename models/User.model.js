const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Buyer','Seller','Both'],
        default:'Both'
    },
    createdPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    followedPosts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    ongoingMessages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
})
const User = mongoose.model('User',userSchema)
module.exports = User