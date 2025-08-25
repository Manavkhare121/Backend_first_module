import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // when u have to make the one field as a searchable in optimize way so u can easily make index=true;
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverimage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// arrow function is not used here as we know that in javascript  arrow function doesnot have 'this ' it doesnot know about the context
userSchema.pre("save",async function(next) {  // 'pre' is hook of a middleware which having a all access of the object
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next();
    
})

//'methods' also have access of there object and also it used to check the password from user is correct or not
userSchema.methods.isPasswordCorrect= async function(password){ 
    bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expressIN:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



userSchema.methods.generateRefreshToken=function(){
 return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expressIN:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema);
