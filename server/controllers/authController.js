import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

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
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New password is required" });
    }

    // Check
    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
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

// Update Profile
export async function updateProfileController(req, res) {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined; // why check when we validated before it ??
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    console.log(req.user._id);
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
}

// Orders
export async function getOrdersController(req, res) {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
}

// All Orders
export async function getAllOrdersController(req, res) {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
}

// Order Status
export async function orderStatusController(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
}
