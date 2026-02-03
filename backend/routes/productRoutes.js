import express from "express";
import {
  getProducts,
  getSingleProduct,
  createProduct,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// 🔥 ONLY ONE POST ROUTE
router.post("/", upload.array("images", 5), createProduct);

export default router;
