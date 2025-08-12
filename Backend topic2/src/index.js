//require('dotenv').config({path:'./env'});
import dotenv from "dotenv"
import connectDB from "./db/db.js";
dotenv.config({
    path: './.env'
});







//  *******FIRST APPROACH********
// import express from "express"
// const app=express()
// ( async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERROR:",error);
//             throw error
//         }) // express ka part hai as a listeners use karrhe hain ki database toh connect hogya hai lekin kya pta humari express ki app hai bo baat nhi karparhi hai
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is Listening on Port ${process.env.PORT}`);
//         })
//     }
//     catch(error){
//         console.log("ERROR:",error)
//         throw err
//     }
// })()
