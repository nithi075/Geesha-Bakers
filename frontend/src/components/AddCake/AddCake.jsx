import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./AddCake.css";

export default function UpdateCake() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    rating: "",
    reviews: "",
    category: "",
    flavor: "",
    occasion: "",
    eggless: false,
    bestseller: false,
  });

  const [priceByKg, setPriceByKg] = useState({
    "0.5": "",
    "1": "",
    "2": "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchCake = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const cake = res.data;

        setForm({
          title: cake.title,
          rating: cake.rating,
          reviews: cake.reviews,
          category: cake.category,
          flavor: cake.flavor,
          occasion: cake.occasion,
          eggless: cake.eggless,
          bestseller: cake.bestseller,
        });

        setPriceByKg(cake.priceByKg);
        setExistingImages(cake.images || []);
      } catch (err) {
        alert("❌ Error loading cake");
      }
    };

    fetchCake();
  }, [id]);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleKgPrice = (kg, value) => {
    setPriceByKg({ ...priceByKg, [kg]: value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + newImages.length + files.length > 5) {
      alert("❌ Maximum 5 images only");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (i) => {
    setExistingImages(existingImages.filter((_, index) => index !== i));
  };

  const removeNewImage = (i) => {
    setNewImages(newImages.filter((_, index) => index !== i));
    setPreviews(previews.filter((_, index) => index !== i));
  };

  /* =========================
     UPDATE SUBMIT
  ========================= */
  const updateCake = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append("priceByKg", JSON.stringify(priceByKg));

    existingImages.forEach((img) => {
      data.append("existingImages", img);
    });

    newImages.forEach((img) => {
      data.append("images", img);
    });

    try {
      await API.put(`/products/${id}`, data);
      alert("✅ Cake Updated Successfully");
      navigate("/admin/products");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  /* =========================
     JSX
  ========================= */
  return (
    <section className="add-cake-section">
      <h1>Update Cake 🎂</h1>

      <form className="add-cake-form" onSubmit={updateCake}>
        <input name="title" value={form.title} onChange={handleChange} />

        <input
          placeholder="0.5 Kg Price"
          value={priceByKg["0.5"]}
          onChange={(e) => handleKgPrice("0.5", e.target.value)}
        />
        <input
          placeholder="1 Kg Price"
          value={priceByKg["1"]}
          onChange={(e) => handleKgPrice("1", e.target.value)}
          required
        />
        <input
          placeholder="2 Kg Price"
          value={priceByKg["2"]}
          onChange={(e) => handleKgPrice("2", e.target.value)}
        />

        <input type="file" multiple accept="image/*" onChange={handleImages} />

        <div className="preview-grid">
          {existingImages.map((img, i) => (
            <div key={i} className="preview-box">
              <img src={img} alt="cake" />
              <span onClick={() => removeExistingImage(i)}>✕</span>
            </div>
          ))}

          {previews.map((src, i) => (
            <div key={i} className="preview-box">
              <img src={src} alt="preview" />
              <span onClick={() => removeNewImage(i)}>✕</span>
            </div>
          ))}
        </div>

        <button className="add-btn">Update Cake</button>
      </form>
    </section>
  );
}
