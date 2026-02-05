import { useEffect, useState } from "react";
import "./AddCake.css";
import API from "../api";

export default function AddCake() {
  const [form, setForm] = useState({
    title: "",
    rating: 0,
    reviews: "",
    category: "",
    flavor: "",
    occasion: "",
    eggless: false,
    bestseller: false,
  });

  const [pricingType, setPricingType] = useState("kg");

  const [priceByKg, setPriceByKg] = useState({
    "0.5": "",
    "1": "",
    "2": "",
  });

  const [priceByPiece, setPriceByPiece] = useState({
    "1": "",
    "6": "",
    "12": "",
  });

  const [cakeMessage, setCakeMessage] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  /* ===== CLEANUP PREVIEWS ===== */
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  /* ===== HANDLE INPUT ===== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 🔥 CATEGORY → PRICING TYPE RULE
    if (name === "category") {
      if (["classic", "occsional"].includes(value)) {
        setPricingType("kg");
      } else {
        setPricingType("piece");
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===== PRICE HANDLERS ===== */
  const handleKgPrice = (kg, value) =>
    setPriceByKg((prev) => ({ ...prev, [kg]: value }));

  const handlePiecePrice = (qty, value) =>
    setPriceByPiece((prev) => ({ ...prev, [qty]: value }));

  /* ===== IMAGE HANDLING ===== */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("❌ Maximum 5 images only");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===== SUBMIT ===== */
  const submitCake = async (e) => {
    e.preventDefault();

    if (!images.length) {
      alert("❌ Please upload at least one image");
      return;
    }

    if (pricingType === "kg" && !priceByKg["1"]) {
      alert("❌ 1Kg price is required");
      return;
    }

    if (pricingType === "piece" && !priceByPiece["1"]) {
      alert("❌ 1 piece price is required");
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append("pricingType", pricingType);

    if (pricingType === "kg") {
      data.append("priceByKg", JSON.stringify(priceByKg));
      data.append("cakeMessage", cakeMessage);
    } else {
      data.append("priceByPiece", JSON.stringify(priceByPiece));
    }

    images.forEach((img) => data.append("images", img));

    try {
      await API.post("/products", data);
      alert("🎂 Product Added Successfully!");

      // RESET
      setForm({
        title: "",
        rating: 0,
        reviews: "",
        category: "",
        flavor: "",
        occasion: "",
        eggless: false,
        bestseller: false,
      });

      setPricingType("kg");
      setPriceByKg({ "0.5": "", "1": "", "2": "" });
      setPriceByPiece({ "1": "", "6": "", "12": "" });
      setCakeMessage("");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      alert(err.response?.data?.error || "❌ Error adding product");
    }
  };

  return (
    <section className="add-cake-section">
      <h1>Add New Product 🎂</h1>

      <form className="add-cake-form" onSubmit={submitCake}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* CATEGORY */}
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Category</option>
          <option value="classic">Classic</option>
          <option value="occsional">Occasional</option>
          <option value="brownies">Brownies</option>
          <option value="cupcakes">Cupcakes</option>
          <option value="jarcakes">Jar Cakes</option>
          <option value="waffles">Waffles</option>
          <option value="cakepops">Cake Pops</option>
          <option value="cakeslices">Cake Slices</option>
        </select>

        {/* FLAVOR */}
        <select name="flavor" value={form.flavor} onChange={handleChange}>
          <option value="">Flavor</option>
          <option value="chocolate">Chocolate</option>
          <option value="strawberry">Strawberry</option>
          <option value="blackcurrant">Blackcurrant</option>
          <option value="mango">Mango</option>
          <option value="pineapple">Pineapple</option>
          <option value="redvelvet">Red Velvet</option>
          <option value="oreo">Oreo</option>
        </select>

        {/* OCCASION */}
        <select name="occasion" value={form.occasion} onChange={handleChange}>
          <option value="">Occasion</option>
          <option value="birthday">Birthday</option>
          <option value="wedding">Wedding</option>
          <option value="anniversary">Anniversary</option>
          <option value="engagement">Engagement</option>
        </select>

        {/* KG PRICE */}
        {pricingType === "kg" && (
          <>
            <input
              type="number"
              placeholder="0.5 Kg Price ₹"
              value={priceByKg["0.5"]}
              onChange={(e) => handleKgPrice("0.5", e.target.value)}
            />
            <input
              type="number"
              placeholder="1 Kg Price ₹ (Required)"
              value={priceByKg["1"]}
              onChange={(e) => handleKgPrice("1", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="2 Kg Price ₹"
              value={priceByKg["2"]}
              onChange={(e) => handleKgPrice("2", e.target.value)}
            />
            <input
              placeholder="Cake Message"
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
            />
          </>
        )}

        {/* PIECE PRICE */}
        {pricingType === "piece" && (
          <>
            <input
              type="number"
              placeholder="1 Piece Price ₹ (Required)"
              value={priceByPiece["1"]}
              onChange={(e) => handlePiecePrice("1", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="6 Pieces Price ₹"
              value={priceByPiece["6"]}
              onChange={(e) => handlePiecePrice("6", e.target.value)}
            />
            <input
              type="number"
              placeholder="12 Pieces Price ₹"
              value={priceByPiece["12"]}
              onChange={(e) => handlePiecePrice("12", e.target.value)}
            />
          </>
        )}

        {/* IMAGES */}
        <input type="file" multiple accept="image/*" onChange={handleImages} />

        <div className="preview-grid">
          {previews.map((src, i) => (
            <div key={i} className="preview-box">
              <img src={src} alt="preview" />
              <span onClick={() => removeImage(i)}>✕</span>
            </div>
          ))}
        </div>

        {/* CHECKBOXES */}
        <div className="check-row">
          <label>
            <input
              type="checkbox"
              name="eggless"
              checked={form.eggless}
              onChange={handleChange}
            />
            Eggless
          </label>

          <label>
            <input
              type="checkbox"
              name="bestseller"
              checked={form.bestseller}
              onChange={handleChange}
            />
            Bestseller
          </label>
        </div>

        <button className="add-btn">Add Product</button>
      </form>
    </section>
  );
}
