import express from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", getWishlist);               // GET wishlist
router.post("/", toggleWishlist);            // TOGGLE wishlist
router.delete("/:productId", removeFromWishlist); // REMOVE by productId

export default router;
