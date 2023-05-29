import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Carousel from "react-grid-carousel";

const Test = ({ services }) => {
  return (
    <div className="  md:py-10 px-1 py-5 md:mb-0  text-black ">
      <Carousel cols={7} rows={1} gap={8}>
        {services?.map((item, i) => {
          return (
            <Carousel.Item key={i}>
              <div className="relative md:h-28 md:w-52 h-44 w-full">
                <img
                  src={`https://picsum.photos/800/600?random=${Math.random(
                    Math.ceil(i + 1 * 0.4)
                  )}`}
                  alt="images"
                  className="rounded-md"
                />
                <p className="absolute bottom-4 left-4 text-white font-bold  text-lg ">
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
