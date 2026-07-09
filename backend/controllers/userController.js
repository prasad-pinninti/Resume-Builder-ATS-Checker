import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

// Controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check it required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if user already exists
    const emailRegex = new RegExp("^" + email.trim() + "$", "i");
    const user = await User.findOne({ email: { $regex: emailRegex } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // return success message
    const token = generateToken(newUser._id);
    newUser.password = undefined; // hide password

    return res
      .status(201)
      .json({ message: "User created successfully", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user already exists
    const emailRegex = new RegExp("^" + email.trim() + "$", "i");
    const user = await User.findOne({ email: { $regex: emailRegex } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check if password is correct
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // return success message
    const token = generateToken(user._id);
    user.password = undefined; // hide password

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // return user
    user.password = undefined; // hide password
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    // return user resumes
    const resumes = await Resume.find({ userId });

    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for requesting password reset link
// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = new RegExp("^" + email.trim() + "$", "i");
    const user = await User.findOne({ email: { $regex: emailRegex } });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Generate JWT token containing userId, expires in 15 mins
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #10b981; text-align: center;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password for your AI Resume Builder account. Please click the button below to set a new password. This link will expire in 15 minutes:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #6b7280; font-size: 13px;">${resetURL}</p>
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin-top: 30px;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset Request - AI Resume Builder",
      html: htmlContent,
    });

    return res.status(200).json({ message: "Password reset link has been sent to your email!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller for resetting the password using the token
// POST: /api/users/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired password reset link" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
