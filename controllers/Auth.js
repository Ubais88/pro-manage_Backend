const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup Controller for Registering USers
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { name, email, password, confirmPassword } = req.body;

    // Check if All Details are there or not
    if (!name || !email || !password || !confirmPassword) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    //Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id.toString(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({
        success: true,
        token,
        name:user.name,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};


exports.updateDetails = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Fetch user details from the database
    const userDetails = await User.findById(req.user.id);

    // Check if both old and new passwords are provided together
    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Both password fields are required together",
      });
    }

    // Update name if provided and different from current name
    if (name && name !== userDetails.name) {
      userDetails.name = name;
    }

    // Update password if both old and new passwords are provided
    if (oldPassword && newPassword) {
      if (oldPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: "New Password cannot be the same as Old Password",
        });
      }
      
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: "The password is incorrect" });
      }
      
      // Hash and update the new password
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      userDetails.password = encryptedPassword;
    }

    // Save the updated user details
    const updatedUserDetails = await userDetails.save();

    // Return success response
    return res.status(200).json({
      success: true,
      updatedUserDetails,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

