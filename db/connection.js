const mongoose = require("mongoose")
const connection = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("database connection successful")
    }
    catch(err){
        console.log("error connecting database ",err.message)
    }
}
module.exports = connection