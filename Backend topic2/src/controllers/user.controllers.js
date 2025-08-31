import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
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
export { registerUser };
