import mongoose,{Schema} from "mongoose";
import { registerUser } from "../controllers/user.controllers";
const playlistSchema=new Schema({
    name:{
        type:String,
        required:true
    }
    ,decription:{
        type:String,
        required:true
    },
    videos:[
    {
        type:Schema.Types.ObjectId,
        ref:"video"
    }

],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
},
{
    timestamps:true
})

export const Playlist=mongoose.model("Playlist",playlistSchema)