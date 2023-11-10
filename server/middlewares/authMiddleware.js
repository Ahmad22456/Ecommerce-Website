import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token base
export async function requireSignIn(req, res, next) {
  try {
    const decode = jwt.verify(
      req.headers.authorization, // checking the request header
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      messsage: "Error in SignIn middle",
      error,
    });
  }
}

// Admin access
export async function isAdmin(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    if (user.role !== 1) {
      res.status(401).send({
        success: false,
        messsage: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      messsage: "Error in Admin middle",
      error,
    });
  }
}
