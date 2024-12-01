const express = require("express")
const dotenv = require("dotenv");
const connection  = require("./db/connection.js");
const {authRouter} = require("./routes/AuthRouter.js")
dotenv.config()
const PORT = process.env.PORT
const app = express();
app.use(express.json())
app.use('/api/v1/auth',authRouter)
app.listen(PORT,()=>{
    connection()
    console.log("server is running at ",PORT)
})
