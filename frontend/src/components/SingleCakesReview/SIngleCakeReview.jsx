import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleCakeReview.css";
import { FaStar } from "react-icons/fa";
import API from "../api";

export default function SingleCakeReview() {
  const { id: productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    review: "",
    rating: 5,
  });

  /* FETCH REVIEWS */
  useEffect(() => {
    if (!productId) return;

    API.get(`/reviews/${productId}`)
      .then((res) => setReviews(res.data))
      .catch(console.error);
  }, [productId]);

  /* SUBMIT REVIEW */
  const submitReview = async (e) => {
    e.preventDefault();
    if (!productId) return;

    const res = await API.post(`/reviews/${productId}`, newReview);
    setReviews([res.data, ...reviews]);
    setNewReview({ name: "", review: "", rating: 5 });
  };

  const avgRating =
    reviews.reduce((a, b) => a + b.rating, 0) /
    (reviews.length || 1);

  return (
    <section className="swiggy-review-section">
      {/* SUMMARY */}
      <div className="swiggy-review-summary">
        <div className="summary-left">
          <h2>{avgRating.toFixed(1)}</h2>
          <div className="summary-stars">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(avgRating) ? "filled" : ""}
              />
            ))}
          </div>
          <p>{reviews.length} ratings</p>
        </div>
      </div>

      {/* REVIEW LIST */}
      <div className="swiggy-review-list">
        {reviews.map((r) => (
          <div className="swiggy-review-item" key={r._id}>
            <div className="review-top">
              <div className="avatar">
                {r.name?.charAt(0).toUpperCase()}
              </div>

              <div className="review-info">
                <p className="review-name">{r.name}</p>
                <div className="review-stars">
                  {[...Array(r.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>

            <p className="review-text">{r.review}</p>
          </div>
        ))}
      </div>

      {/* WRITE REVIEW */}
      <div className="swiggy-write-review">
        <h3>Rate this cake</h3>

        <form onSubmit={submitReview}>
          <div className="rating-select">
            {[1, 2, 3, 4, 5].map((n) => (
              <FaStar
                key={n}
                className={n <= newReview.rating ? "filled" : ""}
                onClick={() =>
                  setNewReview({ ...newReview, rating: n })
                }
              />
            ))}
          </div>

          <input
            placeholder="Your name"
            required
            value={newReview.name}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
          />

          <textarea
            placeholder="Share your experience"
            required
            value={newReview.review}
            onChange={(e) =>
              setNewReview({ ...newReview, review: e.target.value })
            }
          />

          <button type="submit">Submit Review</button>
        </form>
      </div>
    </section>
  );
}
