import React from "react";
import Carousel from "react-grid-carousel";
import saloonOffer from "../pages/images/SOC.png";
import mensOffer from "../pages/images/SAL.png";
import womensOffer from "../pages/images/BP.png";
import "./styles.scss";
const Offers = () => {
  return (
    <div className="  md:py-10 px-1 pb-20 md:mb-0  text-black ">
      <h1 className="px-4 text-xl font-semibold pb-8">Offers</h1>
      <Carousel cols={3} rows={1} gap={10} loop aubottomlay={8000}>
        <Carousel.Item>
          <div className="  h-44 w-full">
            <img
              src={saloonOffer}
              alt="images"
              className="rounded-md image"
              style={{
                width: 800,
                height: 170,

                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "35% 50%",
              }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className=" h-44 w-full">
            <img
              src={mensOffer}
              alt="images"
              className="rounded-md image"
              style={{
                width: 800,
                height: 170,

                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "right 40%",
              }}
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className=" h-44 w-full">
            <img
              src={womensOffer}
              alt="images"
              className="rounded-md image"
              style={{
                width: 800,
                height: 170,

                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "right 40%",
              }}
            />
          </div>
        </Carousel.Item>
        {/* <Carousel.Item>
          <div className="relative h-44 w-full">
            <img
              src="https://picsum.photos/800/600?random=1"
              alt="images"
              className="rounded-md"
            />
            <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
              Dry Cleaning
            </p>
            <p className="absolute bottom-1 right-2 text-white font-bold text-xl">
              Coming Soon
            </p>
          </div>
        </Carousel.Item> */}

        {/* ... */}
      </Carousel>
    </div>
  );
};

export default Offers;
