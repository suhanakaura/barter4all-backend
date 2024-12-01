const express = require("express")
const {HandleSignUp,HandleLogin,HandleLogout} = require("../controllers/AuthController.js")
const authRouter = express.Router();
authRouter.post('/signup',HandleSignUp)
authRouter.post('/login',HandleLogin)
authRouter.post('/logout',HandleLogout)
module.exports={authRouter}

