require("dotenv").config()
const crypto = require("crypto");
const User = require("../models/User.model.js");
const bcrypt = require("bcrypt");
const gen_jwt = require("../utilities/generate-jwt.js");
const {sendEmail} = require("../utilities/email.js");
const HandleSignUp = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).send({ message: "All fields are required" });
    }
    if (password != passwordConfirm) {
      return res
        .status(401)
        .send({ message: "Password and Confirmed passwords doesn't match" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({
          message:
            "Invalid email format. Must be in the format 'name@gmail.com'",
        });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(401)
        .send({ message: "User already exists, kindly login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    gen_jwt.generateJWT(newUser._id, res);
    res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const HandleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "Invalid Username or password" });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    gen_jwt.generateJWT(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
    });
  } catch (err) {
    console.log("Error in HandleLogin:", err.message);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const HandleLogout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).send({ message: "logout successfully" });
  } catch (err) {
    res.status(400).send({ message: "Interval server error" });
  }
};

const HandlePassForgot = async (req, res) => {
  // get the user's posted email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ message: "No user found with this email address" });
  }
  // generate the random reset token
  const createPassResetToken = () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    console.log(resetToken);
    return resetToken;
  };
  const token = createPassResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to user's email
  const resetURL = `http://localhost:4006/api/v1/auth/resetPassword/${token}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and confim password
   to : ${resetURL}.\n If you didn't forget your password, please ignore this email`;

   try{
   await sendEmail({
    email:user.email,
    subject:'Your password reset token , valid for only 10 minutes',
    message
   })
   res.status(200).json({
    status:"success",
    message:"token send to the email"
   })}
   catch(err){
    user.passwordResetToken=undefined,
    user.passwordResetExpires = undefined,
    await user.save({ validateBeforeSave: false });
    return res.status(400).send({message:"there was an error sending the email,try again later"})
   }
};
const HandleResetPassword = async(req, res) => {
  // get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})

  // if token has not expired and there is a user , set new password
  if(!user){
    return res.status(400).send({message:"token is invalid or has expired"})
  }
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return res.status(400).send({ message: "All fields are required" });
  }
  if (password != passwordConfirm) {
    return res
      .status(401)
      .send({ message: "Password and Confirmed passwords doesn't match" });
  }

  // update changedPassword for the current user
  user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

  // log the user in, send jwt to client
  const jwtToken = gen_jwt.generateJWT(user._id, res);  

  
  res.status(200).json({
    message: "Password reset successfully.",
    _id: user._id,
    username: user.username,
    token: jwtToken, 
  });
};
module.exports = {
  HandleSignUp,
  HandleLogin,
  HandleLogout,
  HandlePassForgot,
  HandleResetPassword,
};
