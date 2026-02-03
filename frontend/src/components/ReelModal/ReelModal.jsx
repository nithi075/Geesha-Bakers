import { useState } from "react";
import "./ReelModal.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export default function ReelModal({ reels, index, close }) {
  const [current, setCurrent] = useState(index);

  const next = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % reels.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + reels.length) % reels.length);
  };

  // ✅ Helper: always return a correct embed URL
  const getEmbedUrl = (url) => {
    // remove trailing slash
    const clean = url.replace(/\/$/, "");
    // if already contains /embed, just return
    if (clean.endsWith("/embed")) return clean;
    // else add /embed
    return `${clean}/embed`;
  };

  return (
    <div className="reel-overlay" onClick={close}>
      <div className="reel-modal" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={close}>
          <FiX />
        </button>

        {/* VIDEO WRAPPER */}
        <div className="video-wrapper fade-in">
          <iframe
            src={getEmbedUrl(reels[current].video)}
            className="reel-frame"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
          ></iframe>

          {/* LEFT ARROW */}
          <button className="arrow left" onClick={prev}>
            <FaChevronLeft />
          </button>

          {/* RIGHT ARROW */}
          <button className="arrow right" onClick={next}>
            <FaChevronRight />
          </button>
        </div>

        {/* CAPTION SECTION */}
        <p className="caption">{reels[current].caption}</p>
      </div>
    </div>
  );
}
