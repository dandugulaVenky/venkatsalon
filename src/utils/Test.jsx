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
const Test = ({ services }) => {
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
    <div className="   pt-5 md:mb-0  text-white ">
      <Carousel cols={7} rows={1} gap={8}>
        {mergedServices?.map((item, i) => {
          return (
            <Carousel.Item key={i}>
              <div className="relative md:h-28 md:w-52 h-32 w-full">
                <img
                  src={
                    type === "saloon"
                      ? image
                      : "https://img.freepik.com/premium-psd/top-view-beauty-salon-concept_23-2148600664.jpg?w=2000"
                  }
                  style={{
                    width: 700,
                    height: 110,
                  }}
                  alt="images"
                  className="rounded-md img"
                />
                <p className="absolute md:bottom-3 bottom-6 left-4 text-white font-bold  text-lg ">
                  {item?.service}
                </p>
                <p className="absolute top-0 right-2 text-white font-bold  text-xl space-x-4 ">
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
