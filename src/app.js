import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser());

// Logging middleware to debug requests

app.use((req, res, next) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body); // Log the body to debug
  next();
});
// app.use(errorHandler);

//routes import
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

export { app };
