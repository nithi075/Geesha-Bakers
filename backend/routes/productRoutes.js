import express from "express";
import upload from "../middleware/upload.js";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

/* =========================
   PRODUCT ROUTES
========================= */

// 👉 Get all products
router.get("/", getProducts);

// 👉 Get single product by ID
router.get("/:id", getSingleProduct);

// 👉 Create new product
router.post(
  "/",
  upload.array("images", 5), // max 5 images
  createProduct
);

// 👉 Update existing product
router.put(
  "/:id",
  upload.array("images", 5), // max 5 images
  updateProduct
);

export default router;
