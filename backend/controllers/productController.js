import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    console.log("✏️ UPDATE BODY:", req.body);
    console.log("🖼 NEW FILES:", req.files?.length);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    /* ✅ parse priceByKg */
    let priceByKg;
    try {
      priceByKg = JSON.parse(req.body.priceByKg);
    } catch {
      return res.status(400).json({ error: "Invalid priceByKg format" });
    }

    /* ✅ EXISTING IMAGES (Cloudinary URLs) */
    let images = [];
    if (req.body.existingImages) {
      images = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    /* 🔥 UPLOAD NEW IMAGES TO CLOUDINARY */
    if (req.files && req.files.length > 0) {
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
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        });
      });

      const newImageUrls = await Promise.all(uploadPromises);
      images = [...images, ...newImageUrls];
    }

    if (images.length > 5) {
      return res.status(400).json({ error: "Maximum 5 images allowed" });
    }

    /* ✅ UPDATE PRODUCT */
    product.title = req.body.title;
    product.priceByKg = priceByKg;
    product.rating = Number(req.body.rating || 0);
    product.reviews = req.body.reviews || "";
    product.images = images;
    product.category = req.body.category;
    product.flavor = req.body.flavor;
    product.occasion = req.body.occasion;
    product.eggless = req.body.eggless === "true";
    product.bestseller = req.body.bestseller === "true";

    await product.save();

    res.json(product);
  } catch (err) {
    console.error("🔥 UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
