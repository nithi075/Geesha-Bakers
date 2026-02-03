import express from "express";
import {
  getAllReviews,
  addGeneralReview,
  getProductReviews,
  addProductReview,
} from "../controllers/reviewController.js";

const router = express.Router();

/* HOME PAGE */
router.get("/", getAllReviews);
router.post("/", addGeneralReview);

/* SINGLE CAKE */
router.get("/:id", getProductReviews);
router.post("/:id", addProductReview);

export default router;
