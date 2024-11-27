const express = require("express")
const dotenv = require("dotenv");
const connection  = require("./db/connection.js");
dotenv.config()
const PORT = process.env.PORT
const app = express();
app.use(express.json())
app.listen(PORT,()=>{
    connection()
    console.log("server is running at ",PORT)
})
