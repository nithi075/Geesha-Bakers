import { useEffect, useState } from "react";
import "./Products.css";
import { FiHeart } from "react-icons/fi";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function IndiaLoves() {
  const [cakes, setCakes] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  /* FETCH PRODUCTS – RECENT FIRST */
  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const sortedCakes = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCakes(sortedCakes);
      })
      .catch(() => {});
  }, []);

  /* FETCH WISHLIST */
  useEffect(() => {
    API.get("/wishlist")
      .then((res) =>
        setWishlist(res.data.map((item) => item.productId))
      )
      .catch(() => {});
  }, []);

  /* TOGGLE WISHLIST */
  const toggleWishlist = async (cake, e) => {
    e.stopPropagation();
    const res = await API.post("/wishlist", {
      productId: cake._id,
    });
    setWishlist(res.data.map((i) => i.productId));
  };

  return (
    <section className="india-loves">
      <h1 className="il-title">Our Cakes</h1>
      <p className="il-sub">Every slice tells a sweet story</p>

      {/* 🔥 PRODUCTS STRIP – RECENT FIRST */}
      <div className="il-grid">
        {cakes.slice(0, 8).map((cake) => (
          <article
            className="portrait-card"
            key={cake._id}
            onClick={() => navigate(`/cake/${cake._id}`)}
          >
            <div className="portrait-img">
              <img
                src={
                  cake.images?.[0]
                    ? `https://geesha-bakers.onrender.com${cake.images[0]}`
                    : "/placeholder-cake.jpg"
                }
                alt={cake.title}
              />

              <span className="price-tag">
                ₹{cake.priceByKg?.["1"]}
              </span>
            </div>

            <h3 className="portrait-title">{cake.title}</h3>
          </article>
        ))}
      </div>

      {/* 🔽 VIEW MORE */}
      <div className="view-more-wrap">
        <button
          className="view-more-btn"
          onClick={() => navigate("/treat")}
        >
          View More
        </button>
      </div>
    </section>
  );
}
