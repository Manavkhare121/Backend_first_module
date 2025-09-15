import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudinary url
      required: true,
    },
    thumbnail: {
      type: String, //cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudinary url
      required: true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"USer",
    },
    

  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate) //mongoose-aggregate-paginate-v2 is used as pluggin  
export const video = mongoose.model("video", videoSchema);   //Bcrypt is a library which helps to hash the passwords and also after ecryption decryption task also perform by this library

