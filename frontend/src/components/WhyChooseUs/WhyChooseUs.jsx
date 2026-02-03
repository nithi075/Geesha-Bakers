import "./WhyChooseUs.css";
import {
  FaBirthdayCake,
  FaLeaf,
  FaShippingFast,
  FaStar,
  FaGift,
  FaShieldAlt,
} from "react-icons/fa";

export default function WhyChooseUs() {
  return (
    <section className="why-section">
      {/* TITLE */}
      <h1 className="why-title">Why People Love Us ❤️</h1>
      <p className="why-sub">
        Trusted by thousands for every celebration
      </p>

      {/* GRID */}
      <div className="why-grid">
        <div className="why-card">
          <FaBirthdayCake className="why-icon" />
          <h3>Freshly Baked</h3>
          <p>We bake only after you order. No frozen cakes.</p>
        </div>

       

        <div className="why-card">
          <FaShippingFast className="why-icon" />
          <h3>Same Day Delivery</h3>
          <p>Order before evening & get it delivered today.</p>
        </div>

        <div className="why-card">
          <FaGift className="why-icon" />
          <h3>Custom Messages</h3>
          <p>Add your personal message & make it special.</p>
        </div>

        <div className="why-card">
          <FaShieldAlt className="why-icon" />
          <h3>Hygienic Packing</h3>
          <p>Sealed & premium packaging for safe delivery.</p>
        </div>

       
      </div>
    </section>
  );
}
