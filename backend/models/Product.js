import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    priceByKg: {
      type: Object,
      required: true,
    },

    rating: Number,
    reviews: String,

    images: [String], // 🔥 CLOUDINARY URLs

    category: String,
    flavor: String,
    occasion: String,

    eggless: Boolean,
    bestseller: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
