import React, { useEffect, useRef } from "react";
import "./Row.css";

const AutoScrollingRow = ({ children, speed = 0.5 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    let animationFrameId;

    const scrollStep = () => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollLeft += speed;

        // When scroll passes the width of the first child set,
        // jump back to the start *silently*
        if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = el.scrollLeft - el.scrollWidth / 2;
        }

        animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
    }, [speed]);


  return (
    <div className="scroll-wrapper">
      <div className="scroll-inner" ref={scrollRef}>
        {children}
        {children}
      </div>
    </div>
  );
};

export default AutoScrollingRow;
