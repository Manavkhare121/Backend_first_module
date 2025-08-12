import { json } from "express"
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}
export  default asyncHandler;//asynchandler is higher order function which can pass as parameter and also as a return




                    //******using try catch method so we can use it various places******
// const asyncHandler =(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(err.code||500),json({
//             success:false,
//             message:err.message
//         })
//     }
// }
