const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const crypto = require('crypto');
const asyncHandler = require("express-async-handler");
const User = require("../model/user");

// Controller methods for user operations
//endpoint to login in the app
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey
}
const secretKey = generateSecretKey()

cloudinary.config({
  cloud_name: 'ds7jufrxl',
  api_key: '827497948387292',
  api_secret: 'qZygsilGaETbzQ5rnN8v-k8Ai4g',
})

const userController = {
  //!Register
  register: asyncHandler(async (req, res) => {
    try {
      const { email, password, name, role, phone, userBranch } = req.body;
      // console.log('Request body:', req.body); 
      // console.log('Request file:', req.file); 
            
      // Validation
      if (!email || !password) {
        throw new Error("Please all fields are required");
      }

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error("User already exists");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'PSPCloudinaryData/users',
        width: 150,
        crop: "scale"
      });

      // Create new user with the Cloudinary URL
      let user = new User({
        name,
        email,
        role,
        phone,
        userBranch,
        password: hashedPassword,
        image: { public_id: result.public_id, url: result.secure_url }
      });

      console.log(user)

      // Save user to the database
      // user = await user.save();

      return res.status(201).json({
        success: true,
        message: 'User Registered Successfully',
        user
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Error in Register API',
        error: error.message
      });
    }
  }),
  //!Login
  login: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid Password' });
      }

      const token = jwt.sign({ userId: user._id }, secretKey);
      res.status(200).json({ token, user });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Login Error" });
    }
  }),
  //!Profile
  profile: asyncHandler(async (req, res) => {
    try {
      const { userId } = req.query;
      let query = {};
      if (userId) {
        query = { '_id': userId };
      }
      const user = await User.findById(query);
      console.log(user)

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (erro) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),
};
module.exports = userController;