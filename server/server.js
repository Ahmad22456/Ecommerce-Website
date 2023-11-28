import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Configure env
dotenv.config();

// Connect to Database
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Rest API
app.get("/", (req, res) => {
  res.send({
    message: "Welcome",
  });
});

// PORT Number
const PORT = process.env.PORT || 8000;

// Running Listener
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
