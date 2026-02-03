import Review from "../models/Review.js";

/* ================= HOME PAGE REVIEWS ================= */
export const getAllReviews = async (req, res) => {
  const reviews = await Review.find({ productId: null }).sort({
    createdAt: -1,
  });
  res.json(reviews);
};

export const addGeneralReview = async (req, res) => {
  const review = new Review({
    ...req.body,
    productId: null,
  });
  await review.save();
  res.json(review);
};

/* ================= SINGLE CAKE REVIEWS ================= */
export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({
    productId: req.params.id,
  }).sort({ createdAt: -1 });

  res.json(reviews);
};

export const addProductReview = async (req, res) => {
  const review = new Review({
    ...req.body,
    productId: req.params.id,
  });

  await review.save();
  res.json(review);
};
