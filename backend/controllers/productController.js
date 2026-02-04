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
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req, res) => {
  try {
    console.log("BODY 👉", req.body);
    console.log("FILES 👉", req.files?.length);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    let priceByKg;
    try {
      priceByKg = JSON.parse(req.body.priceByKg);
    } catch {
      return res.status(400).json({ error: "Invalid priceByKg format" });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "cakes",
                resource_type: "image",
                quality: "auto",
                fetch_format: "auto",
              },
              (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        })
    );

    const imageUrls = await Promise.all(uploadPromises);

    const product = new Product({
      title: req.body.title,
      priceByKg,
      rating: Number(req.body.rating || 0),
      reviews: req.body.reviews || "",
      images: imageUrls,
      category: req.body.category,
      flavor: req.body.flavor,
      occasion: req.body.occasion,
      eggless: req.body.eggless === "true" || req.body.eggless === true,
      bestseller:
        req.body.bestseller === "true" || req.body.bestseller === true,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let priceByKg;
    try {
      priceByKg = JSON.parse(req.body.priceByKg);
    } catch {
      return res.status(400).json({ error: "Invalid priceByKg format" });
    }

    let images = [];
    if (req.body.existingImages) {
      images = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "cakes",
                  resource_type: "image",
                  quality: "auto",
                  fetch_format: "auto",
                },
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result.secure_url);
                }
              )
              .end(file.buffer);
          })
      );

      const newUrls = await Promise.all(uploadPromises);
      images = [...images, ...newUrls];
    }

    if (images.length > 5) {
      return res.status(400).json({ error: "Maximum 5 images allowed" });
    }

    product.title = req.body.title;
    product.priceByKg = priceByKg;
    product.rating = Number(req.body.rating || 0);
    product.reviews = req.body.reviews || "";
    product.images = images;
    product.category = req.body.category;
    product.flavor = req.body.flavor;
    product.occasion = req.body.occasion;
    product.eggless = req.body.eggless === "true" || req.body.eggless === true;
    product.bestseller =
      req.body.bestseller === "true" || req.body.bestseller === true;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
