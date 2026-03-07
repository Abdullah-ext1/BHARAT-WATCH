import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./db/db.js";

connectDB()
.then( () => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listening on PORT: ${process.env.PORT}`)
  })
})
.catch((error) => {
    console.log("Error while connecting to the Database", error)
  }
)