import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Herosection.css";

export default function HeroExact() {

  useEffect(() => {
    // 👉 Hero page load ஆனா body class add
    document.body.classList.add("has-hero");

    return () => {
      // 👉 Page leave ஆனா remove (other pages fix header)
      document.body.classList.remove("has-hero");
    };
  }, []);

  return (
    <section className="ref-hero">
      <div className="ref-wrap">
        <div className="ref-left">
          <h1>
            Purely Homemade. <br /> Truly Premium.
          </h1>

          <p>
            Exquisite homemade cakes delivered from our oven to your door.
          </p>

          <NavLink to="/treat" className="ref-btn">
            Order now
          </NavLink>
        </div>
      </div>

      {/* 🔽 HERO → MENU DIVIDER */}
      <div className="hero-divider">
        <div className="divider-dots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
}
