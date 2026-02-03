import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import API from "../api";
import "./ReviewPage.css";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newReview, setNewReview] = useState({
    name: "",
    review: "",
    rating: 5,
  });

  /* FETCH REVIEWS */
  useEffect(() => {
    API.get("/reviews")
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  /* AVG RATING */
  const avgRating =
    reviews.reduce((a, r) => a + r.rating, 0) / (reviews.length || 1);

  /* SUBMIT */
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/reviews", newReview);
      setReviews((prev) => [res.data, ...prev]);
      setOpenForm(false);
      setNewReview({ name: "", review: "", rating: 5 });
    } catch {
      alert("Failed to submit review");
    }
  };

  if (loading) {
    return <p className="center">Loading reviews…</p>;
  }

  return (
    <section className="review-page">
      {/* HEADER */}
      <div className="review-header">
        <h1 className="page-title">Customer Reviews</h1>

        {!!reviews.length && (
          <div className="avg-rating">
            <span>{avgRating.toFixed(1)}</span>
            <FaStar />
            <small>{reviews.length} ratings</small>
          </div>
        )}
      </div>

      <button className="write-btn" onClick={() => setOpenForm(true)}>
        Write a Review
      </button>

      {/* REVIEW LIST */}
      {!reviews.length ? (
        <p className="center">Be the first to review</p>
      ) : (
        <div className="review-list">
          {reviews.map((r, i) => (
            <div key={i} className="review-item">
              <h4>{r.name}</h4>

              <div className="rating-row">
                {[...Array(r.rating)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>

              <p>{r.review}</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL (BOTTOM SHEET STYLE) */}
      {openForm && (
        <div
          className="review-modal-overlay"
          onClick={() => setOpenForm(false)}
        >
          <div
            className="review-modal bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Rate your experience</h3>

            {/* STAR INPUT */}
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  className={
                    num <= newReview.rating ? "star filled" : "star"
                  }
                  onClick={() =>
                    setNewReview({ ...newReview, rating: num })
                  }
                />
              ))}
            </div>

            <form onSubmit={submitReview}>
              <input
                placeholder="Your Name"
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
                  setNewReview({
                    ...newReview,
                    review: e.target.value,
                  })
                }
              />

              <button className="submit-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
