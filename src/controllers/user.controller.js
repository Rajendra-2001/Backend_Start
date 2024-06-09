import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user detail from frontEnd
  //validation
  //chech if user already exists
  //check for image,check for avatar
  // upload them to cloudinary
  //create user object - create entry in DB
  //remove password and refresh token field
  //check for user creation
  //return response

  const { fullname, email, username, password } = req.body;
  console.log("email: ", email);

  if (fullname === "") {
  }
});
export { registerUser };
