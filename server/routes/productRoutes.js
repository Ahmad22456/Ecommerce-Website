import Express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = Express.Router();

// Create Product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Update Product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get All Products
router.get("/get-product", getProductController);

// Single Product
router.get("/get-product/:slug", getSingleProductController);

// Product Photo
router.get("/product-photo/:pid", productPhotoController);

// Delete Product
router.delete("/delete-product/:pid", deleteProductController);

// Filter Product
router.post("/product-filters", productFiltersController);

// Count Product
router.get("/product-count", productCountController);

// Number of Products in a Single Page
router.get("/product-list/:page", productListController);

// Search Product
router.get("/search/:keyword", searchProductController);

// Similar Product
router.get("/related-product/:pid/:cid", realtedProductController);

// Category Wise Product
router.get("/product-category/:slug", productCategoryController);

export default router;
