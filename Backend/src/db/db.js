import mongoose from "mongoose";
import { DB_NAME } from "./dbName.js";


const connectDB = async () => {
  try {
    const connectionInstane = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n MongoDb is connected || ${connectionInstane.connection.host}`)
  } catch (error) {
    console.error("Error while connecting to the database", error)
    process.exit(1);
  }
}

export default connectDB;