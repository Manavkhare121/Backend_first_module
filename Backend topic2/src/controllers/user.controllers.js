import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { error } from "console";
import { cpSync } from "fs";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens=async(userId)=>{
  try{
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

    user.refreshToken=refreshToken; // save in databse
    await user.save({validateBeforeSave:false}) // if u hitting the save then u will hit the all others field then u should have to validate the user
    return {accessToken,refreshToken} //then accesstoken generate

  }
  catch(error){
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
  
}
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // Validation:empty username,empty email Address,email field is in correct format or not (not empty validation);
  // check if user already exists:(emails or username);
  // check for images and check for avatar
  // upload them to cloudinary,avatar is uploaded or not
  // create user object(beacuase in mongodb this is the no sequeal database this will store data so basically in object)-create    entry in db
  // remove password and refresh token field from response(because from mongodb as it response will came which we don not want to gave to the user)
  // check for user creation(user is created or not)
  // return response
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400,"All Fields are required")
  }
  const existedUser = await User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
  }
  // console.log("req.files:", req.files); 
   const avatarlocalpath = req.files?.avatar?.[0]?.path //path is that multer upload on there server
  // const coverimagelocalpath = req.files?.coverimage?.[0]?.path

  let coverimagelocalpath;
  if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
    coverimagelocalpath=req.files?.coverimage?.[0]?.path
  }

  if(!avatarlocalpath){
    throw new ApiError(400,"Avatar file is required");
  }
  const avatar=await uploadOnCloudinary(avatarlocalpath) // as we know that async the function  which give us promise but sometimes it is required to use await intentionally
  const coverimage=await uploadOnCloudinary(coverimagelocalpath)
  if(!avatarlocalpath){
    throw new ApiError(400,"Avatar file is required");
  }

  const user=await User.create({
    fullName,
    avatar:avatar.secure_url,
    coverimage:coverimage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken") //mongoose is add after every each entry with _id     it also use for user getting        select is used to get those field we did not want

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered succesfully")
  )

});

const loginuser=asyncHandler(async(req,res)=>{
  // get data from req body
  // check is there username or email and it is totally upon you how can you should gave access to user by there username or email
  // find the user is it present or not
  // password check if it is present or not
  // generate access and refresh token
  // send in cookies
  // response is success full or not
  const {email,username,password}=req.body;
  console.log(email)
  if(!username && !email){
    throw new ApiError(400,"username or email is required")
  }
//   if(!(username || email)){
//     throw new ApiError(404,"username or email is required")   here is alternative of above code when we want only one of them
// }
    //findone is used when it get first entry or body it will send to u
  const user=await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"User does not exist");
  }
  // "User" is mongodb ke mongoose object and this "user" is yours object that u just made it
  const isPasswordvalid=await user.isPasswordCorrect(password)

  if(!isPasswordvalid){
    throw new ApiError(404,"Invalid user credentials");
  }
  const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
const loggedinuser=await User.findById(user._id).select("-password,-refreshToken");
  const options={
    httpOnly:true,
    secure:true   //modifiable by server are not from frontend

  }
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedinuser,accessToken,refreshToken // it is used when user wanted to give it by himself
      },
      "User logged in successfully"
    )
  )

//"accessToken and refreshToken main work" is that user should not have to give many time there email and password and accesstoken is short lived i think it should important to refresh access token


})
const logoutuser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new:true }
  )
  const options={ httpOnly:true, secure:true }
  return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user Logged out"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken;
  
  if(!incomingRefreshToken){  
    throw new ApiError(401,"Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")
    }

    const options = { httpOnly: true, secure: true } //modifiable by server not by frontend

    const {accessToken, refreshToken: newRefreshToken} = 
      await generateAccessAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200, 
          {accessToken, refreshToken: newRefreshToken},
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

export { registerUser,loginuser,logoutuser,refreshAccessToken};
