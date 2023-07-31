import React from "react";
import Carousel from "nuka-carousel";
import banner1 from "../pages/images/banner1.png";
import banner2 from "../pages/images/banner2.png";
import banner3 from "../pages/images/banner3.png";
import banner4 from "../pages/images/banner4.jpg";
import banner5 from "../pages/images/banner5.jpg";
import banner6 from "../pages/images/banner6.jpg";
const CarouselBanner = () => {
  let images = [];
  const w = window.innerWidth;

  w >= 768
    ? (images = [banner1, banner2, banner3])
    : (images = [banner4, banner5, banner6]);

  const renderPaginationDots = ({ currentSlide, slideCount }) => {
    const dotElements = [];
    for (let i = 0; i < slideCount; i++) {
      dotElements.push(
        <button
          key={i}
          onClick={() => this.slider.goToSlide(i)}
          className={currentSlide === i ? "active " : ""}
          aria-label={`Slide ${i + 1}`}
        >
          .
        </button>
      );
    }
    return <div className="pagination-dots">{dotElements}</div>;
  };
  return (
    <div className="px-4 scale-in-center md:mt-0 md:pt-0  ">
      <Carousel
        autoplay={true}
        wrapAround={true}
        renderBottomCenterControls={renderPaginationDots}
        // renderCenterLeftControls={null} // Hide the default controls
        // renderCenterRightControls={null}

        autoplayInterval={3000}
      >
        {images.map((banner, i) => {
          return (
            <img
              src={banner}
              key={i}
              alt="text"
              className="rounded-md w-full md:h-48 h-36"
            />
          );
        })}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
