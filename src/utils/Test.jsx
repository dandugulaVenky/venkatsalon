import { faClock, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Carousel from "react-grid-carousel";
import image from "../pages/images/barber.jpg";
import "./styles.scss";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { useEffect } from "react";
import { useState } from "react";
const Test = ({
  services,
  smallBanners,
  setHighlightBookingBox,
  higlightBookingBox,
}) => {
  const { type } = useContext(SearchContext);
  const [showInclusions, setShowInclusions] = useState(null);
  const [mergedServices, setMergedServices] = useState();
  console.log(higlightBookingBox);

  useEffect(() => {
    const mergedServices = services
      .filter((item) => item.category === "packages")
      ?.reduce((arr, item) => {
        arr.push(item.services);
        return arr;
      }, [])
      .reduce((arr, item) => {
        return arr.concat(item);
      }, []);

    setMergedServices(mergedServices);
  }, [services]);

  const handleInclusions = (item) => {
    setShowInclusions(item);
  };

  return (
    <div className="  my-4  text-white ">
      {showInclusions && (
        <div className="reserve  overscroll-none ">
          <FontAwesomeIcon
            icon={faClose}
            size="xl"
            color="black"
            onClick={() => setShowInclusions(null)}
            className="absolute md:top-10  top-5 lg:right-52 md:right-20 right-6 bg-white rounded-full px-2.5 py-[0.30rem] cursor-pointer"
          />

          <div className="flex relative slide-in-right items-center justify-center space-y-3 px-4 flex-col h-[50%] md:w-[25%] w-[65%] my-auto  mx-auto bg-white text-black overflow-auto rounded-md">
            <h1 className="text-gray-700 font-bold text-2xl">Inclusions</h1>
            <ul className="list-decimal space-y-1">
              {" "}
              {showInclusions?.inclusions?.map((item) => {
                return <li>{item.service}</li>;
              })}
            </ul>

            <button
              className="primary-button mt-4"
              onClick={() => {
                setShowInclusions(null);
                setHighlightBookingBox(true);
                setTimeout(() => {
                  const intervalId = setInterval(() => {
                    setHighlightBookingBox(false);
                  }, 2500);
                  return () => clearInterval(intervalId);
                });
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      )}

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
                    filter: "brightness(40%)",

                    objectFit: "cover",
                    objectPosition: "right top",
                    borderRadius: 8,
                  }}
                  onClick={() => handleInclusions(item)}
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
