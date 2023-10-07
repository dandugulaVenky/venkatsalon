import React, { useContext } from "react";
import { useState } from "react";
import Carousel from "react-grid-carousel";
import { SearchContext } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Services = ({ refer }) => {
  let { city = "shadnagar", type, dispatch } = useContext(SearchContext);
  const [active, setActive] = useState(type ? type : "saloon");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handler = (service) => {
    setActive(service);

    dispatch({
      type: "NEW_SEARCH",
      payload: { type: service, destination: city },
    });
  };

  return (
    <div className=" mt-6  text-black " ref={refer}>
      <h1 className="px-4 text-xl font-semibold pb-4">Select A Service</h1>
      <Carousel cols={4} rows={1} gap={7}>
        <Carousel.Item>
          <div
            className="relative  h-[8.5rem]  w-full cursor-pointer rounded-md"
            id="section-id"
            onClick={() => handler("saloon")}
          >
            <img
              src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1678872396/Hair_cutting_in_salon_illustration_vector_concept_generated_1_ywx6vs.webp"
              alt="images"
              style={{
                width: "98%",
                height: 132,
                boxShadow: "1px 1.5px 2px black",
                filter: "brightness(70%)",
                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "right top",
              }}
            />
            <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
              {t("saloons")}
            </p>
            <span
              className={`${
                active === "saloon" ? "service-loader" : ""
              } absolute top-3 right-4`}
            ></span>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="relative  h-auto w-full cursor-pointer rounded-md"
            onClick={() => handler("parlour")}
          >
            <img
              src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1678881963/beauty2_nttutx.webp"
              alt="images"
              style={{
                width: "98%",
                height: 132,
                boxShadow: "1px 1.5px 2px black",
                filter: "brightness(70%)",
                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "right top",
              }}
            />
            <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
              {t("beautyParlours")}
            </p>
            <span
              className={`${
                active === "parlour" ? "service-loader" : ""
              } absolute top-3 right-4`}
            ></span>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="relative h-auto w-full cursor-pointer"
            onClick={() => navigate("/iron")}
          >
            <img
              src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1678872396/drycleaning_r4y1uo.webp"
              alt="images"
              style={{
                width: "98%",
                height: 132,
                boxShadow: "1px 1.5px 2px black",
                filter: "brightness(70%)",
                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "right top",
              }}
            />
            <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
              {t("ironing")}
            </p>
            <span
              className={`${
                active === "iron" ? "service-loader" : ""
              } absolute top-3 right-4`}
            ></span>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="relative h-auto w-full cursor-pointer">
            <img
              src="https://picsum.photos/800/600?random=1"
              alt="images"
              style={{
                width: "98%",
                height: 132,
                boxShadow: "1px 1.5px 2px black",
                filter: "brightness(70%)",
                borderRadius: 8,
                objectFit: "cover",
                objectPosition: "right top",
              }}
            />
            <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
              {t("dryCleaning")}
            </p>
          </div>
        </Carousel.Item>

        {/* ... */}
      </Carousel>
    </div>
  );
};

export default Services;
