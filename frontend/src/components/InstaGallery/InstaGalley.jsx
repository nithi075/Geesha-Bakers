import { useState } from "react";
import { reelsData } from "../../data/reelsData";
import ReelModal from "../ReelModal/ReelModal";
import "./InstaGalley.css";

export default function InstaGallery() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="insta-section">
      <h1 className="insta-title">From Our Oven to Instagram</h1>
      <p className="insta-sub">Little moments. Sweet memories.</p>

      <button className="follow-btn">Follow Us</button>

      <div className="polaroid-grid">
        {reelsData.map((item, index) => (
          <div
            key={item.id}
            className="polaroid-card"
            onClick={() => {
              setActiveIndex(index);
              setOpen(true);
            }}
          >
            <img src={item.thumbnail} alt="reel" />
            <span className="polaroid-tag">Sweet Reel</span>
          </div>
        ))}
      </div>

      {open && (
        <ReelModal
          reels={reelsData}
          index={activeIndex}
          close={() => setOpen(false)}
        />
      )}
    </section>
  );
}
