import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { user } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token is provided, throw an unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by the ID present in the decoded token and exclude password and refreshToken fields
    const User = await user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    // If user is not found, throw an invalid token error
    if (!User) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach the user object to the request object for further use in the request lifecycle
    req.User = User;
    next(); // Call the next middleware or route handler
  } catch (error) {
    // If any error occurs, throw an unauthorized error with the error message
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
