import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      title: String,
      price: Number,
      qty: Number,
      kg: String,          // 🔥 NEW
      img: String,
      message: String,
    },
  ],

  wishlist: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      title: String,
      price: Number,
      img: String,
      badge: String,
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
