import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Treat.css";
import API from "../api";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
    if (catFromUrl) {
      setCategory(catFromUrl);
    } else {
      setCategory("all");
    }
  }, [searchParams]);

  /* ---------------- FILTER LOGIC ---------------- */
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
      {/* FILTER BAR */}
      <div className="filter-bar">
        <button
          className={`filter-chip ${category === "all" ? "active" : ""}`}
          onClick={() => setCategory("all")}
        >
          All
        </button>

        <button
          className={`filter-chip ${category === "classic" ? "active" : ""}`}
          onClick={() => setCategory("classic")}
        >
          Classic
        </button>

        <button
          className={`filter-chip ${category === "desserts" ? "active" : ""}`}
          onClick={() => setCategory("desserts")}
        >
          Desserts
        </button>

        <button
          className={`filter-chip ${category === "brownies" ? "active" : ""}`}
          onClick={() => setCategory("brownies")}
        >
          Brownies
        </button>

        <button
          className={`filter-chip ${category === "designer" ? "active" : ""}`}
          onClick={() => setCategory("designer")}
        >
          Jar Cakes
        </button>

        <button
          className={`filter-chip ${category === "waffles" ? "active" : ""}`}
          onClick={() => setCategory("waffles")}
        >
          Waffles
        </button>

        <button
          className={`filter-chip ${category === "cakepops" ? "active" : ""}`}
          onClick={() => setCategory("cakepops")}
        >
          Cake Pops
        </button>

        <button
          className={`filter-chip ${
            category === "cakeslices" ? "active" : ""
          }`}
          onClick={() => setCategory("cakeslices")}
        >
          Cake Slices
        </button>

        <div
          style={{
            width: "1px",
            height: "20px",
            background: "#e9e9eb",
            margin: "0 10px",
          }}
        />

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
          <option value="">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {/* PRODUCTS GRID */}
      <div className="treats-grid">
        {paginatedProducts.map((cake) => (
          <div
            key={cake._id}
            className="treat-card"
            onClick={() => navigate(`/cake/${cake._id}`)}
          >
            <div className="card-img-box">
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
    </section>
  );
}
