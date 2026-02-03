import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Treat.css";
import API from "../api";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://geesha-bakers.onrender.com";

/* ===== MENU FILTERS ===== */
const menuCategories = [
  { title: "Classic", value: "classic", img: "/images/menu/menu1.jpg" },
  { title: "Desserts", value: "desserts", img: "/images/menu/menu3.jpg" },
  { title: "Brownies", value: "brownies", img: "/images/menu/menu7.jpg" },
  { title: "Jar Cakes", value: "designer", img: "/images/menu/menu2.jpg" },
  { title: "Waffles", value: "waffles", img: "/images/menu/menu4.jpeg" },
  { title: "Cake Pops", value: "cakepops", img: "/images/menu/menu5.jpg" },
  { title: "Cake Slices", value: "cakeslices", img: "/images/menu/menu6.jpeg" },
];

export default function Treats() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
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
  }, []);

  /* -------- READ CATEGORY FROM URL -------- */
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setCategory(cat);
    setCurrentPage(1);
  }, [searchParams]);

  /* ---------------- FILTER ---------------- */
  const filteredProducts = products
    .filter((cake) => {
      if (category !== "all" && cake.category !== category) return false;

      const price = cake.priceByKg?.["1"] || 0;
      if (priceRange === "low" && price > 500) return false;
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

  return (
    <section className="treats-section">
      {/* ===== IMAGE MENU FILTER ===== */}
      <div className="menu-filter">
        {menuCategories.map((item) => (
          <div
            key={item.value}
            className={`menu-filter-item ${
              category === item.value ? "active" : ""
            }`}
            onClick={() => setSearchParams({ category: item.value })}
          >
            <div className="menu-filter-img">
              <img src={item.img} alt={item.title} />
            </div>
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      {/* ===== SECONDARY FILTER BAR ===== */}
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
          <option value="priceLow">Price ↑</option>
          <option value="priceHigh">Price ↓</option>
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
              {cake.bestseller && <span className="badge">BESTSELLER</span>}

              <img
                className="treat-img"
                src={`${BACKEND_URL}${cake.images?.[0]}`}
                alt={cake.title}
              />

              <span className="treat-price-tag">
                ₹{cake.priceByKg?.["1"]}
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
