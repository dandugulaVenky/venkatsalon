import {
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export default function CarouselBanner({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 4000,
}) {
  const [curr, setCurr] = useState(0);

  const [hovered, setHovered] = useState(false);
  const [startX, setStartX] = useState(null);
  const [endX, setEndX] = useState(null);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (startX !== null && endX !== null) {
      const deltaX = endX - startX;
      if (deltaX > 50) {
        // Swipe left
        prev();
      } else if (deltaX < -50) {
        // Swipe right
        next();
      }
    }
    setStartX(null);
    setEndX(null);
  };

  useEffect(() => {
    let slideInterval;

    if (autoSlide && !hovered) {
      slideInterval = setInterval(next, autoSlideInterval);
    }

    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, hovered]);

  return (
    <div
      className="overflow-hidden relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform ease-out duration-500 w-full  h-auto"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button onClick={prev} className="p-1 rounded-full   ">
          <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" color="white" />
        </button>
        <button onClick={next} className="p-1 rounded-full  ">
          <FontAwesomeIcon icon={faCircleArrowRight} size="lg" color="white" />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides?.map((_, i) => (
            <div
              onClick={() => setCurr(i)}
              className={`
              transition-all w-2 h-2 bg-white rounded-full
              ${curr === i ? "p-1 bg-gray-900" : "bg-opacity-50"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
