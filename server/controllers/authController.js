import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

export async function registerController(req, res) {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name) {
      return res.send({ mesaage: "name is required" });
    }
    if (!email) {
      return res.send({ mesaage: "email is required" });
    }
    if (!password) {
      return res.send({ mesaage: "password is required" });
    }
    if (!phone) {
      return res.send({ mesaage: "phone is required" });
    }
    if (!address) {
      return res.send({ mesaage: "address is required" });
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
    console.log(match);

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

// Test controller
export function testController(req, res) {
  res.send("protected route");
}
