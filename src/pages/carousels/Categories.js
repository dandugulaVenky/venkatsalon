import React, { useContext, useState } from "react";
import Carousel from "react-grid-carousel";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";

import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBuilding } from "@fortawesome/free-solid-svg-icons";
import baseUrl from "../../utils/client";
const Categories = ({ type }) => {
  const { type: type1, dispatch } = useContext(SearchContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const getCount = async () => {
        const { data } = await axios.get(
          `${baseUrl}/api/hotels/countByCity?cities=shadnagar, telangana 509216, india-kothur, telangana 509228, india-thimmapur, telangana 509325, india-shamshabad, telangana 501218, india&&type=${type1}`
        );

        setData(data);
      };

      getCount();
    } catch (err) {
      console.log(err);
    }
  }, [type1]);

  const navigate = useNavigate();

  const handleSearch = (destination) => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { type: type1, destination },
    });
    navigate("/shops", { state: { destination } });
  };

  const handleAllCities = () => {
    navigate("/cities");
  };
  return (
    <div className=" md:mb-0 mb-10 text-black ">
      <div className="flex flex-row justify-between">
        <h1 className="px-4 text-xl font-semibold pb-8">
          Browse Area Wise{" "}
          {type1
            ? type1?.charAt(0)?.toUpperCase() + type1?.slice(1) + "s"
            : "loading"}
        </h1>
        <button
          className="px-4 text-2xl font-semibold pb-8"
          onClick={handleAllCities}
        >
          <FontAwesomeIcon icon={faArrowRight} color="#00ccbb" />
        </button>
      </div>
      <div className="">
        <Carousel cols={4} rows={1} gap={15} loop autoplay={15000}>
          <Carousel.Item>
            <div
              className="relative  h-52 w-full cursor-pointer rounded-md"
              id="section-id"
              onClick={() => {
                handleSearch("shadnagar, telangana 509216, india");
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://picsum.photos/800/600?random=5"
                alt="images"
                style={{
                  width: 800,
                  height: 200,
                  filter: "brightness(70%)",
                  objectFit: "cover",
                  objectPosition: "right bottom",
                  borderRadius: 8,
                }}
              />
              <p className="absolute bottom-10 left-4 text-white font-bold  text-xl ">
                Shadnagar
              </p>
              <p className="absolute bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                <FontAwesomeIcon icon={faBuilding} size="lg" />
                <span className="font-semibold">
                  {data?.length > 0 ? data[0] : "Loading"} Shops
                </span>
              </p>
            </div>
          </Carousel.Item>

          {/* ... */}

          <Carousel.Item>
            <div
              className="relative  h-52 w-full cursor-pointer rounded-md"
              id="section-id"
              onClick={() => {
                handleSearch("kothur, telangana 509228, india");
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://picsum.photos/800/600?random=4"
                alt="images"
                style={{
                  width: 800,
                  height: 200,
                  filter: "brightness(70%)",
                  objectFit: "cover",
                  objectPosition: "right bottom",
                  borderRadius: 8,
                }}
              />
              <p className="absolute bottom-10 left-4 text-white font-bold  text-xl ">
                Kothur
              </p>
              <p className="absolute bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                <FontAwesomeIcon icon={faBuilding} size="lg" />
                <span className="font-semibold">
                  {data?.length > 0 ? data[1] : "Loading"} Shops
                </span>
              </p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              className="relative  h-52 w-full cursor-pointer rounded-md"
              id="section-id"
              onClick={() => {
                handleSearch("thimmapur, telangana 509325, india");
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://picsum.photos/800/600?random=3"
                alt="images"
                style={{
                  width: 800,
                  height: 200,
                  filter: "brightness(70%)",
                  objectFit: "cover",
                  objectPosition: "right bottom",
                  borderRadius: 8,
                }}
              />
              <p className="absolute bottom-10 left-4 text-white font-bold  text-xl ">
                Thimmapur
              </p>
              <p className="absolute bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                <FontAwesomeIcon icon={faBuilding} size="lg" />
                <span className="font-semibold">
                  {data?.length > 0 ? data[2] : "Loading"} Shops
                </span>
              </p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              className="relative  h-52 w-full cursor-pointer rounded-md"
              id="section-id"
              onClick={() => {
                handleSearch("shamshabad, telangana 501218, india");
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://picsum.photos/800/600?random=2"
                alt="images"
                style={{
                  width: 800,
                  height: 200,
                  filter: "brightness(70%)",
                  objectFit: "cover",
                  objectPosition: "right bottom",
                  borderRadius: 8,
                }}
              />
              <p className="absolute bottom-10 left-4 text-white font-bold  text-xl ">
                Shamshabad
              </p>
              <p className="absolute bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                <FontAwesomeIcon icon={faBuilding} size="lg" />
                <span className="font-semibold">
                  {data?.length > 0 ? data[3] : "Loading"} Shops
                </span>
              </p>
            </div>
          </Carousel.Item>

          {/* ... */}
        </Carousel>
      </div>
    </div>
  );
};

export default Categories;
