import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToeken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { verify } from "jsonwebtoken";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]), //adding this uplaod as middleware
  registerUser
);
router.route("/login").post(upload.none(), loginUser);

//secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToeken);
export default router;
