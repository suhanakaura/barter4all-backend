const jwt = require('jsonwebtoken')
const generateJWT = (userid,res) =>{
    const token = jwt.sign({id:userid},process.env.JWT_SECRET_KEY,{
        expiresIn:'1d'
    })
    res.cookie("jwt",token,{
        maxAge:1*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict"
    })
}
module.exports = {generateJWT}