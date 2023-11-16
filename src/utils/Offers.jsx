import React from "react";
import Carousel from "react-grid-carousel";
import saloonOffer from "../pages/images/SOC.png";
import mensOffer from "../pages/images/SAL.png";
import womensOffer from "../pages/images/BP.png";
import "./styles.scss";
import { useTranslation } from "react-i18next";

const Offers = () => {
const { t } = useTranslation();

  return (
    <div className=" mt-8  text-black md:mb-10 mb-20">
      <h1 className="px-2.5 md:px-5 md:text-xl font-semibold pb-3">{t('offers')}</h1>
      <Carousel cols={3} rows={1} gap={7}>
        <Carousel.Item>
          <div className="h-44 w-full">
            <img
              src={saloonOffer}
              alt="images"
              className="rounded-md image"
              style={{
                width: "98%",
                height: 170,
                boxShadow: "1px 1.5px 2px black",

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
                width: "98%",
                height: 170,
                boxShadow: "1px 1.5px 2px black",

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
                width: "98%",
                height: 170,
                boxShadow: "1px 1.5px 2px black",

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