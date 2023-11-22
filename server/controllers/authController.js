import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

export async function registerController(req, res) {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!name) {
      return res.send({ mesaage: "Name is required" });
    }
    if (!email) {
      return res.send({ mesaage: "Email is required" });
    }
    if (!password) {
      return res.send({ mesaage: "Password is required" });
    }
    if (!phone) {
      return res.send({ mesaage: "Phone is required" });
    }
    if (!address) {
      return res.send({ mesaage: "Address is required" });
    }
    if (!answer) {
      return res.send({ mesaage: "Answer is required" });
    }

    // Check existing User
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered please login",
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });

    res.status(201).send({
      success: true,
      message: "User Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in registeration",
      error,
    });
  }
}

// Login
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error logging in",
      error,
    });
  }
}

// Forgot Password Controller
export async function forgotPasswordController(req, res) {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }

    // Check
    const user = await userModel.findOne({ email, answer });

    if (!user) {
      res.status(404).send({
        success: false,
        message: "Email or Answer is wrong",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
}

// Test controller
export function testController(req, res) {
  res.send("protected route");
}
