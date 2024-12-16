const express = require("express")
const dotenv = require("dotenv");
const connection  = require("./db/connection.js");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const {authRouter} = require("./routes/AuthRouter.js")
dotenv.config()
const PORT = process.env.PORT
const allowedOrigins = 'http://localhost:5173'
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:allowedOrigins,
    methods:["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders:['Content-Type'],
    credentials:true
}))
app.use('/api/v1/auth',authRouter)
app.listen(PORT,()=>{
    connection()
    console.log("server is running at ",PORT)
})
