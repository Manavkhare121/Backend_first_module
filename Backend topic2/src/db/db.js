import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    ); //mongoose can be store in variable it will return the object
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    ); //host is used to see in which host I am connecting because for production there is another server,development server is another
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1); //current application is running on the some process that process is the refrence of the process
  }
};
export default connectDB;
