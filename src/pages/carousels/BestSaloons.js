import React, { memo, useContext } from "react";
import { useState } from "react";
import Carousel from "react-grid-carousel";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./styles.scss";
import baseUrl from "../../utils/client";

import Skeleton from "../../utils/Skeleton";
import GetSize from "../../utils/GetSize";
import { useTranslation } from "react-i18next";

const BestSaloons = () => {
  const { type: type1, city } = useContext(SearchContext);

  const [data, setData] = useState([]);
  const [status, setStatus] = useState();
  const { t } = useTranslation();

  const size = GetSize();
  useEffect(() => {
    console.log(city);
    try {
      const getSaloons = async () => {
        const { data, status } = await axios.get(
          `${baseUrl}/api/hotels?type=${type1 ? type1 : "saloon"}&city=${
            city ? city : "shadnagar"
          }`
        );

        if (data) {
          setData(data);
          setStatus(status);
        } else {
          return null;
        }
      };

      getSaloons();
    } catch (err) {
      console.log(err);
    }
  }, [type1, city]);
  const navigate = useNavigate();
  const gotoHotel = (hotel) => {
    navigate(`/shops/${hotel}`);
  };

  return (
    <div className="mt-5  text-black w-full ">
      <h1 className=" px-4 text-xl font-semibold pb-4">
        {type1 ? (
          type1?.charAt(0)?.toUpperCase() + type1?.slice(1) + "s For You"
        ) : (
          <Skeleton cards={1} />
        )}
      </h1>
      {status !== 200 ? (
        <Skeleton cards={size} />
      ) : status === 200 && data?.length > 0 ? (
        <div>
          <Carousel cols={4} rows={1} gap={7}>
            {data?.map((item, i) => {
              return (
                <Carousel.Item key={i}>
                  <div
                    className="relative h-44 w-full cursor-pointer rounded-md slide-in-left"
                    id="section-id"
                    onClick={() => gotoHotel(item._id)}
                  >
                    <img
                      src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1678872396/Hair_cutting_in_salon_illustration_vector_concept_generated_1_ywx6vs.webp"
                      alt="images"
                      style={{
                        width: "98%",
                        height: 170,
                        boxShadow: "1px 1.5px 2px black",
                        filter: "brightness(70%)",

                        objectFit: "cover",
                        objectPosition: "right top",
                        borderRadius: 8,
                      }}
                    />
                    <p className="absolute md:bottom-[2.55rem] bottom-10 left-4 text-white font-bold  text-xl content break-words">
                      {/* {item.name} */}
                      {t("salonName", { name: item.name })}
                    </p>
                    <p className="absolute  bottom-4 left-4 text-white flex items-center justify-center space-x-2  ">
                      <span className="font-semibold">
                        {Math.ceil(item.rating)}{" "}
                      </span>
                      <FontAwesomeIcon icon={faStar} size="lg" />
                    </p>
                  </div>
                </Carousel.Item>
              );
            })}

            {/* ... */}
          </Carousel>
        </div>
      ) : (
        <div className="flex items-center justify-center md:space-x-5 space-x-3 ">
          <img
            src="https://cdn.dribbble.com/userupload/2641500/file/original-b2b4da3f25a13ff275d03cd646d1fec3.png?compress=1&resize=1200x900"
            alt="no results"
            height={100}
            width={200}
            style={{
              borderRadius: 8,
              boxShadow: "1px 1.5px 2px black",
              filter: "brightness(70%)",
            }}
          ></img>
          <p className="text-black md:text-xl text-xs font-semibold">
            No {type1}s found!
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(BestSaloons);
