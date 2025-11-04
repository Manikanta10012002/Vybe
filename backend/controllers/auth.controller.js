import sendMail from "../config/mail.js";
import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    
    const { name,userName, email, password } = req.body;
   

    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({ message: "Email already exists !" });
    }
     const findByUserName = await User.findOne({ userName });
    if (findByUserName) {
      return res.status(400).json({ message: "UserName already exists !" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name,userName, email, password: hashedPassword });

    const token = await genToken(newUser._id);


    res.cookie("token", token, { httpOnly: true,maxAge: 10*365*24*60*60*1000, secure: false, sameSite: "lax", domain: "localhost" });
    const userObj = newUser.toObject();
    delete userObj.password;
    res.status(201).json({ message: "User created successfully", User: userObj, token });
     
  } catch (error) {
    return res.status(500).json(`signup error: ${error}`);  
  }
}


export const signIn = async (req, res) => {
  try {
    const { userName,  password } = req.body;
  
     const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials !" });
    }

    const token =  genToken(user._id);

    res.cookie("token", token, { httpOnly: true,maxAge: 10*365*24*60*60*1000, secure: false, sameSite: "lax", domain: "localhost" });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json(userObj)
     
  } catch (error) {
         return res.status(500).json({ message: `signin error: ${error}` });
  }
}

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");    
    res.status(200).json({ message: "Signout successfully" });
    } catch (error) {   
    return res.status(500).json(`signout error: ${error}`);
    }   
}


export const sendOtp = async (req,res) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found !" });
    } 
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendMail(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });

  }
  catch(error){
    return res.status(500).json(`send otp error: ${error}`);  
  }
}

export const verifyOtp = async (req,res) => {
  try{
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.OtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP !" });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.OtpExpires = undefined;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  }
  catch(error){
    return res.status(500).json(`verify otp error: ${error}`);  
  }
}

export const resetPassword = async (req,res) => { 
  try{
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required !" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch(error){
    return res.status(500).json(`reset password error: ${error}`);  
  }     
}
