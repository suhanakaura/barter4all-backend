const express = require("express")
const {HandleSignUp,HandleLogin,HandleLogout,HandlePassForgot,HandleResetPassword} = require("../controllers/AuthController.js")
const authRouter = express.Router();
authRouter.post('/signup',HandleSignUp)
authRouter.post('/login',HandleLogin)
authRouter.post('/logout',HandleLogout)
authRouter.post('/forgotPass',HandlePassForgot)
authRouter.post('/resetPassword',HandleResetPassword)
module.exports={authRouter}

