import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser" //cookieparser is used to perform the crud operation on cookies from server to user's browser
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"})) //this will convert the object 
app.use(express.urlencoded({extended:true,limit:"16kb"})) // url like manav+%20 this will encoded by these configuration
app.use(express.static) // when you want to store the file/folder like pdf,images then you should have to convert it into public assests whihc can easily accessible to public
app.use(cookieParser())
export default app;