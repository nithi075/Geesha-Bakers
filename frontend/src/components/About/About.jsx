import { Link } from "react-router-dom";
import "./About.css";

export default function AboutUs() {
  return (
    <section className="about-new">

      {/* ===== HERO ===== */}
      <div className="about-hero-new">
        <div className="hero-text">
          <h1>We Bake Memories</h1>
          <p>
            Geesha Bakers is not just a bakery —  
            it’s where emotions turn into desserts 🍰
          </p>
          <Link to="/treat" className="hero-btn">
            Explore Our Desserts
          </Link>
        </div>
      </div>

      {/* ===== WHO WE ARE ===== */}
      <div className="about-split">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            Started as a home kitchen passion, Sweet Tooth grew into a
            dessert destination loved by hundreds of families.
          </p>
          <p>
            From birthdays to weddings, we believe every occasion
            deserves a dessert that feels personal.
          </p>
        </div>

        <div className="about-img">
          <img src="/banner.jpg" alt="Our Bakery" />
        </div>
      </div>

      {/* ===== WHY CHOOSE US ===== */}
      <div className="why-us">
        <h2>Why Geesha Bakers?</h2>

        <div className="why-cards">
          <div className="why-card">
            <span>🎂</span>
            <h3>Made To Order</h3>
            <p>No frozen items. Every dessert is freshly baked for you.</p>
          </div>

          <div className="why-card">
            <span>❤️</span>
            <h3>Emotion First</h3>
            <p>We design desserts that match your moments & memories.</p>
          </div>

          <div className="why-card">
            <span>✨</span>
            <h3>Premium Finish</h3>
            <p>Elegant designs, rich taste, perfect presentation.</p>
          </div>
        </div>
      </div>

      

      {/* ===== CTA ===== */}
      <div className="about-cta">
        <h2>Let’s Make Your Celebration Sweeter</h2>
        <p>Tell us your idea — we’ll turn it into a dessert.</p>
        <Link to="/treat" className="cta-btn">
          Order Now
        </Link>
      </div>

    </section>
  );
}
