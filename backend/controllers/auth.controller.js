import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  try {
    const { email, password, confirmpassword, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "All fields required" });
    }

    if (password != confirmpassword) {
      res.status(400).json({ error: "passwords do not match" });
    }

    if (password.length < 6) {
      res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const userAlredyExists = await User.findOne({ email });
    if (userAlredyExists) {
      res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    // console.log({ hash: hashedPassword });
    const verificationToken = generateVerificationToken();
    // console.log({ vcode: verificationToken });

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    if (user) {
      await user.save();
      generateTokenAndSetCookie(user._id, res);

      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } else {
      res.status(400).json({ error: "User data invalid" });
    }
  } catch (error) {
    res.status(500).json("internal server error");
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json("Invalid or expired verification code");
    }

    user.isVerified = true;

    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      message: "Password update sent successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("Invalid credentials");
    }

    if (user) {
      generateTokenAndSetCookie(user._id, res);
      user.lastLogin = Date.now();
    }

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login");
    res.status(400).json(error.message);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json("logged out successfully");
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User not found");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresIn;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      message: "reset passwrod email sent successfully",
    });
  } catch (error) {
    console.log("error in reset password", error);
    res.status(500).json({ message: "Server error" });
  }
};
