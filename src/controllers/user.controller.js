import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { application } from "express";
import { user } from "../models/user.model.js";
import { uploadOnCloud } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Find the user by their unique identifier
    const User = await user.findById(userId);

    // Generate an access token for the user
    const accessToken = User.generateAccessToken();

    // Generate a refresh token for the user
    const refreshToken = User.generateRefreshToken();

    // Save the refresh token in the user document
    User.refreshToken = refreshToken;

    // Save the user document with the new refresh token
    // `validateBeforeSave: false` skips validation checks
    await User.save({ validateBeforeSave: false });

    // Return the generated access and refresh tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // If an error occurs, throw an ApiError with a 500 status code
    // and a custom error message
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  // Get user details from the front end
  const { fullname, email, username, password } = req.body;
  // console.log("email: ", email);

  // Validate the input fields
  if (
    [fullname, email, username, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    // If any field is missing or empty, throw a 400 error
    throw new ApiError(400, "All fields are required!");
  }

  // Check if a user with the given email or username already exists
  const existedUser = await user.findOne({
    $or: [{ username }, { email }],
  });
  console.log(req.files);
  if (existedUser) {
    // If a user already exists, throw a 409 error
    throw new ApiError(409, "User already exists!");
  }

  // Get file paths for avatar and cover image from the request
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // Check if avatar file is provided
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar and cover image to cloud storage (Cloudinary)
  const avatar = await uploadOnCloud(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloud(coverImageLocalPath)
    : null;

  if (!avatar) {
    // If avatar upload fails, throw a 400 error
    throw new ApiError(400, "Avatar upload failed");
  }

  // Create a new user object and save it to the database
  await user.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Find the created user and remove password and refreshToken fields from the response
  const createdUser = await user
    .findOne({ email })
    .select("-password -refreshToken");

  if (!createdUser) {
    // If user creation fails, throw a 500 error
    throw new ApiError(500, "Something went wrong in creating the new user");
  }

  // Return a success response with the created user details
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Created"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username or password is required");
  }
  const User = await user.findOne({
    $or: [{ username }, { email }],
  });
  if (!User) {
    throw new ApiError(404, "User does not exist!");
  }

  const isPasswordValid = await User.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect!");
  }
  const { accessToken, refreshToken } = generateAccessAndRefreshToken(User._id);
  const loggedInUser = await user
    .findById(User._id)
    .select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("Refrsh Token", refreshToken, options);
});
export { registerUser, loginUser };
