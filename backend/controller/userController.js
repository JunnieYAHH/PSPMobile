const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudinary, secretKey } = require('../config/cloudinaryConfig')
const asyncHandler = require("express-async-handler");
const User = require("../model/user");
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const userController = {
  //!Register
  register: asyncHandler(async (req, res) => {
    try {
      const { email, password, name, role, phone } = req.body;

      const userBranch = req.body.userBranch ? req.body.userBranch : null;

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

      // Create a Stripe customer
      const stripeCustomer = await stripe.customers.create({
        name: name,
        email: email,
      });

      // Create new user with the Cloudinary URL and Stripe customer ID
      let user = new User({
        name,
        email,
        role,
        phone,
        userBranch,
        password: hashedPassword,
        image: { public_id: result.public_id, url: result.secure_url },
        stripeCustomerId: stripeCustomer.id,  // Save the Stripe customer ID
      });

      // Save user to the database
      user = await user.save();

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
      // console.log(user)

      if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid Password' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
      // console.log(user)

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (erro) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }),
  //!UpdateUser
  updateUser: asyncHandler(async (req, res) => {
    try {
      const { _id, name, email } = req.body
      let user = await User.findById({ "_id": _id });

      const imageUrl = req.file.path;

      // const resultDelete = await cloudinary.v2.uploader.destroy(user.image[0].public_id);

      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: 'PSPCloudinaryData/users',
        width: 150,
        crop: "scale"
      });

      user.name = name;
      user.email = email;
      user.image = { public_id: result.public_id, url: result.secure_url };

      console.log(user)

      user = await User.findByIdAndUpdate(_id, user, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });

      return res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: 'Update User Server Error'
      });
    }
  }),
  //!ResetPassword
  updateUserPassword: asyncHandler(async (req, res) => {
    try {

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id);
      console.log('The Body:', req.body)
      // console.log('The newPassword',newPassword)
      console.log('The User ID:', user)

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        message: 'Password Reset Server Error'
      });
    }
  }),
};
module.exports = userController;