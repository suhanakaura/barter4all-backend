const nodemailer = require("nodemailer")

const sendEmail = async(options) =>{
    // create a transporter
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'barter04all@gmail.com',
            pass:'pshk fqpm bqix ivqf'
        },
        
    })
    // define email options
    const mailOptions = {
        from:'barter04all@gmail.com',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    // actually send the email
    await transporter.sendMail(mailOptions,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("email sent")
        }
    })
    

}
module.exports = {sendEmail}