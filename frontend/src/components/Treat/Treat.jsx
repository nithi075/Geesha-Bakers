import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Treat.css";
import API from "../api";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://geesha-bakers.onrender.com";

export default function Treats() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [onlyBestseller, setOnlyBestseller] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch(console.error);

    API.get("/wishlist")
      .then((res) => setWishlist(res.data.map((i) => i.productId)))
      .catch(console.error);
  }, []);

  /* -------- READ CATEGORY FROM URL -------- */
  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    setCategory(catFromUrl || "all");
    setCurrentPage(1);
  }, [searchParams]);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredProducts = products
    .filter((cake) => {
      if (category !== "all" && cake.category !== category) return false;

      const price = cake.priceByKg?.["1"] || 0;

      if (priceRange === "low" && price > 500) return false;
      if (priceRange === "mid" && (price < 500 || price > 1000)) return false;
      if (priceRange === "high" && price < 1000) return false;

      if (onlyBestseller && !cake.bestseller) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priceLow")
        return (a.priceByKg?.["1"] || 0) - (b.priceByKg?.["1"] || 0);
      if (sortBy === "priceHigh")
        return (b.priceByKg?.["1"] || 0) - (a.priceByKg?.["1"] || 0);
      return 0;
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- UI ---------------- */
  return (
    <section className="treats-section">
      {/* ===== PREMIUM FILTER BAR ===== */}
      <div className="filter-bar">
        <button
          className={`filter-chip ${priceRange === "low" ? "active" : ""}`}
          onClick={() =>
            setPriceRange(priceRange === "low" ? "all" : "low")
          }
        >
          Under ₹500
        </button>

        <button
          className={`filter-chip ${onlyBestseller ? "active" : ""}`}
          onClick={() => setOnlyBestseller(!onlyBestseller)}
        >
          Bestseller
        </button>

        <select
          className="sort-btn"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      <div className="treats-grid">
        {paginatedProducts.map((cake) => (
          <div
            key={cake._id}
            className="treat-card"
            onClick={() => navigate(`/cake/${cake._id}`)}
          >
            <div className="card-img-box">
              {cake.bestseller && (
                <span className="badge">BESTSELLER</span>
              )}

              <img
                className="treat-img"
                src={
                  cake.images?.[0]
                    ? `${BACKEND_URL}${cake.images[0]}`
                    : "/placeholder.jpg"
                }
                alt={cake.title}
              />

              <span className="treat-price-tag">
                ₹{cake.priceByKg?.["1"] || "N/A"}
              </span>
            </div>

            <div className="card-content">
              <h3 className="cake-name">{cake.title}</h3>
              <p className="cake-category">4.2 ⭐</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== PAGINATION ===== */}
      {filteredProducts.length > itemsPerPage && (
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredProducts.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
}
