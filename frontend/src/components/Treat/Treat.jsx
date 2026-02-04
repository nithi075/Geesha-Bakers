import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Treat.css";
import API from "../api";

/* ===== MENU FILTERS ===== */
const menuCategories = [
  { title: "CLASSIC", value: "classic", img: "/images/menu/menu1.jpg" },
  { title: "OCCASIONAL", value: "occsional", img: "/images/menu/menu3.jpg" },
  { title: "BROWNIES", value: "brownies", img: "/images/menu/menu7.jpg" },
  { title: "JAR CAKES", value: "jarcakes", img: "/images/menu/menu2.jpg" },
  { title: "WAFFLES", value: "waffles", img: "/images/menu/menu4.jpeg" },
  { title: "CAKE POPS", value: "cakepops", img: "/images/menu/menu5.jpg" },
  { title: "CAKESLICES", value: "cakeslices", img: "/images/menu/menu6.jpeg" },
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

  /* ===== PRICE HELPER ===== */
  const getBasePrice = (cake) => {
    if (cake.pricingType === "piece") {
      return Number(cake.priceByPiece?.["1"] || 0);
    }
    return Number(cake.priceByKg?.["1"] || 0);
  };

  /* ---------------- FILTER ---------------- */
  const filteredProducts = products
    .filter((cake) => {
      if (category !== "all" && cake.category !== category) return false;

      const price = getBasePrice(cake);
      if (priceRange === "low" && price > 500) return false;
      if (onlyBestseller && !cake.bestseller) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") return getBasePrice(a) - getBasePrice(b);
      if (sortBy === "priceHigh") return getBasePrice(b) - getBasePrice(a);
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {/* ===== FILTER BAR ===== */}
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

        <button className="filter-chip" onClick={() => navigate("/add-cake")}>
          More
        </button>
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
                src={cake.images?.[0] || "/placeholder-cake.jpg"}
                alt={cake.title}
              />

              <span className="treat-price-tag">
                ₹{getBasePrice(cake)}
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
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
