import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Carousel from "react-grid-carousel";
import image from "../pages/images/barber.jpg";
import "./styles.scss";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { useEffect } from "react";
import { useState } from "react";
const Test = ({ services, smallBanners }) => {
  const { type } = useContext(SearchContext);

  const [mergedServices, setMergedServices] = useState();

  useEffect(() => {
    const mergedServices = services
      ?.reduce((arr, item) => {
        arr.push(item.services);
        return arr;
      }, [])
      .reduce((arr, item) => {
        return arr.concat(item);
      }, []);

    setMergedServices(mergedServices);
  }, [services]);

  return (
    <div className="  my-4  text-white ">
      <Carousel cols={6} rows={1}>
        {mergedServices?.map((item, i) => {
          return (
            <Carousel.Item key={i}>
              <div
                className="relative md:h-32 h-44 w-full cursor-pointer rounded-md slide-in-left"
                id="section-id"
              >
                <img
                  src={image}
                  alt="images"
                  style={{
                    width: "98%",
                    height: smallBanners ? 170 : 110,
                    boxShadow: "1px 1.5px 2px black",
                    filter: "brightness(70%)",

                    objectFit: "cover",
                    objectPosition: "right top",
                    borderRadius: 8,
                  }}
                />
                <p className="absolute  bottom-6 left-4 text-white font-bold  text-lg ">
                  {item?.service}
                </p>
                <p className="absolute top-0 right-4 text-white font-bold  text-xl space-x-4 ">
                  <span>
                    {item?.duration}{" "}
                    <FontAwesomeIcon icon={faClock} size="sm" color="white" />
                  </span>
                  <span>
                    {item?.price}
                    &nbsp;Rs
                  </span>
                </p>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Test;
