import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    pricingType: {
      type: String,
      enum: ["kg", "piece"],
      required: true,
    },

    priceByKg: {
      type: Object,
      default: {},
    },

    priceByPiece: {
      type: Object,
      default: {},
    },

    cakeMessage: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: String,
      default: "",
    },

    images: [String],

    category: String,
    flavor: String,
    occasion: String,

    eggless: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
