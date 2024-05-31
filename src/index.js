//require("dotenv").config({ path: "./env" });

import connectDB from "./db/database.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});
connectDB();

/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  } catch (error) {
    console.error("ERROE", error);
    throw err;
  }
})();
*/
// console.log("HELLO");
