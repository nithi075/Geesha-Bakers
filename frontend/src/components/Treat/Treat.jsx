import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Treat.css";
import API from "../api";

/* ===== MAIN MENU ===== */
const menuCategories = [
  { title: "CLASSIC", value: "classic", img: "/images/menu/menu1.jpg" },
  { title: "OCCASIONAL", value: "occsional", img: "/images/menu/menu3.jpg" },
  { title: "BROWNIES", value: "brownies", img: "/images/menu/menu7.jpg" },
  { title: "CUPCAKES", value: "cupcakes", img: "/images/menu/menu8.jpg" },
  { title: "JAR CAKES", value: "jarcakes", img: "/images/menu/menu2.jpeg" },
  { title: "WAFFLES", value: "waffles", img: "/images/menu/menu4.jpg" },
  { title: "CAKE POPS", value: "cakepops", img: "/images/menu/menu5.jpeg" },
  { title: "CAKESLICES", value: "cakeslices", img: "/images/menu/menu6.jpg" },
];         

/* ===== OCCASION TYPES ===== */
const occasionTypes = [
  { title: "Wedding", value: "wedding", img: "/images/occasion/wedding.jpg" },
  { title: "Birthday", value: "birthday", img: "/images/occasion/birthday.jpg" },
  { title: "Anniversary", value: "anniversary", img: "/images/occasion/anniversary.jpg" },
  { title: "Engagement", value: "engagement", img: "/images/occasion/engagement.jpg" },
];

/* ===== FLAVOURS ===== */
const flavourMenu = [
  { title: "Chocolate", value: "chocolate", img: "/images/flavours/chocolate.jpg" },
  { title: "Strawberry", value: "strawberry", img: "/images/flavours/strawberry.jpg" },
  { title: "Blackcurrant", value: "blackcurrant", img: "/images/flavours/blackcurrant.jpg" },
  { title: "Mango", value: "mango", img: "/images/flavours/mango.jpg" },
  { title: "Pineapple", value: "pineapple", img: "/images/flavours/pineapple.jpg" },
  { title: "Red Velvet", value: "redvelvet", img: "/images/flavours/redvelvet.jpg" },
  { title: "Oreo", value: "oreo", img: "/images/flavours/oreo.jpg" },
];

export default function Treats() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [flavour, setFlavour] = useState("all");
  const [occasionType, setOccasionType] = useState("all");

  const [priceRange, setPriceRange] = useState("all");
  const [onlyBestseller, setOnlyBestseller] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ===== FETCH PRODUCTS ===== */
  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch(console.error);
  }, []);

  /* ===== READ CATEGORY FROM URL ===== */
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setCategory(cat);
    setCurrentPage(1);
  }, [searchParams]);

  /* ===== RESET SUB FILTERS WHEN CATEGORY CHANGES ===== */
  useEffect(() => {
    setFlavour("all");
    setOccasionType("all");
    setPriceRange("all");
    setOnlyBestseller(false);
    setSortBy("");
  }, [category]);

  /* ===== PRICE HELPER ===== */
  const getBasePrice = (item) => {
    if (item.pricingType === "piece") {
      return Number(item.priceByPiece?.["1"] || 0);
    }
    return Number(item.priceByKg?.["1"] || 0);
  };

  /* ===== FILTER LOGIC ===== */
  const filteredProducts = products
    .filter((item) => {
      if (category !== "all" && item.category !== category) return false;

      if (category === "occsional" && occasionType !== "all") {
        if (item.occasionType !== occasionType) return false;
      }

      if (
        ["classic", "cupcakes", "brownies"].includes(category) &&
        flavour !== "all"
      ) {
        if (item.flavour !== flavour) return false;
      }

      const price = getBasePrice(item);
      if (priceRange === "low" && price > 500) return false;
      if (onlyBestseller && !item.bestseller) return false;

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
      {/* ===== MAIN CATEGORY MENU ===== */}
      <div className="menu-filter">
        {menuCategories.map((item) => (
          <div
            key={item.value}
            className={`menu-filter-item ${
              category === item.value ? "active" : ""
            }`}
            onClick={() =>
              setSearchParams({
                category: category === item.value ? "all" : item.value,
              })
            }
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

      {/* ===== OCCASIONAL SUB MENU ===== */}
      {category === "occsional" && (
        <div className="menu-filter">
          {occasionTypes.map((item) => (
            <div
              key={item.value}
              className={`menu-filter-item ${
                occasionType === item.value ? "active" : ""
              }`}
              onClick={() =>
                setOccasionType(
                  occasionType === item.value ? "all" : item.value
                )
              }
            >
              <div className="menu-filter-img">
                <img src={item.img} alt={item.title} />
              </div>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* ===== FLAVOUR MENU ===== */}
      {["classic", "cupcakes", "brownies"].includes(category) && (
        <div className="menu-filter">
          {flavourMenu.map((item) => (
            <div
              key={item.value}
              className={`menu-filter-item ${
                flavour === item.value ? "active" : ""
              }`}
              onClick={() =>
                setFlavour(flavour === item.value ? "all" : item.value)
              }
            >
              <div className="menu-filter-img">
                <img src={item.img} alt={item.title} />
              </div>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* ===== PRODUCTS GRID ===== */}
      <div className="treats-grid">
        {paginatedProducts.map((item) => (
          <div
            key={item._id}
            className="treat-card"
            onClick={() => navigate(`/cake/${item._id}`)}
          >
            <div className="card-img-box">
              {item.bestseller && <span className="badge">BESTSELLER</span>}
              <img
                className="treat-img"
                src={item.images?.[0] || "/placeholder-cake.jpg"}
                alt={item.title}
              />
              <span className="treat-price-tag">₹{getBasePrice(item)}</span>
            </div>

            <div className="card-content">
              <h3 className="cake-name">{item.title}</h3>
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
