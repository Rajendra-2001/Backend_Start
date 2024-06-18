import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // index: true,
    },

    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Videos",
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
// Middleware to hash password before saving user document
userSchema.pre("save", async function (next) {
  // Check if the password field has been modified
  if (!this.isModified("password")) return; // If password is not modified, skip hashing and proceed to next middleware

  // Hash the password with bcrypt before saving
  // 10 is the salt rounds, which determines the complexity of the hashing
  this.password = await bcrypt.hash(this.password, 10); // Hash the password

  next(); // Proceed to the next middleware or save operation
});

// Method to compare provided password with hashed password stored in the database
userSchema.methods.isPasswordCorrect = async function (password) {
  // Compare the provided password with the hashed password
  return await bcrypt.compare(password, this.password); // Returns true if the passwords match, otherwise false
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      // Payload: includes user-specific information
      _id: this._id, // User's unique identifier
      email: this.email, // User's email address
      username: this.username, // User's username
      fullname: this.fullname, // User's full name
    },
    // Secret key to sign the token, stored in an environment variable for security
    process.env.ACCESS_TOKEN_SECRET,
    {
      // Token expiration time, stored in an environment variable
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // e.g., '15m' for 15 minutes
    }
  );
};

// Method to generate a refresh token for a user
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      // Payload: minimal information, only the user ID
      _id: this._id, // User's unique identifier
    },
    // Secret key to sign the refresh token, stored in an environment variable for security
    process.env.REFRESH_TOKEN_SECRET,
    {
      // Token expiration time, stored in an environment variable
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // e.g., '7d' for 7 days
    }
  );
};

export const user = mongoose.model("User", userSchema);
