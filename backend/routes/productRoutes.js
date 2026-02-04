import express from "express";
import upload from "../middleware/upload.js";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post("/", upload.array("images", 5), createProduct);
router.put("/:id", upload.array("images", 5), updateProduct);

export default router;
