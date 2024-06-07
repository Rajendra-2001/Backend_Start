// Import the multer package for handling file uploads
import multer from "multer";

// Configure the storage settings for multer
const storage = multer.diskStorage({
  // Set the destination for uploaded files
  destination: function (req, file, cb) {
    cb(null, "/public/temp"); // Save files in the "/public/temp" directory
  },
  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original name of the file
  },
});

// Create an instance of multer with the defined storage settings
const upload = multer({ storage: storage });

// Export the upload middleware to be used in other modules
export { upload };
