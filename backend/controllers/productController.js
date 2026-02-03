import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   GET ALL PRODUCTS
========================= */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const formatted = products.map((p) => ({
      ...p._doc,
      price: p.priceByKg?.["1"] || 0,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE PRODUCT
========================= */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      ...product._doc,
      price: product.priceByKg?.["1"] || 0,
    });
  } catch (err) {
    console.error("GET SINGLE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CREATE PRODUCT (CLOUDINARY + MEMORY STORAGE)
========================= */
export const createProduct = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("🖼 FILE COUNT:", req.files?.length);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    /* ✅ parse priceByKg */
    let priceByKg;
    try {
      priceByKg = JSON.parse(req.body.priceByKg);
    } catch {
      return res.status(400).json({ error: "Invalid priceByKg format" });
    }

    /* 🔥 UPLOAD BUFFERS TO CLOUDINARY */
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "cakes",
              resource_type: "image",
              quality: "auto",
              fetch_format: "auto",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url); // 🔥 THIS IS IMPORTANT
            }
          )
          .end(file.buffer); // 🔥 buffer from memoryStorage
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    /* ✅ SAVE PRODUCT */
    const product = new Product({
      title: req.body.title,
      priceByKg,
      rating: Number(req.body.rating || 0),
      reviews: req.body.reviews || "",
      images: imageUrls, // ✅ CLOUDINARY URLS
      category: req.body.category,
      flavor: req.body.flavor,
      occasion: req.body.occasion,
      eggless: req.body.eggless === "true",
      bestseller: req.body.bestseller === "true",
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("🔥 CREATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
