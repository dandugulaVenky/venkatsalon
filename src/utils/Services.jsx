// import React, { useContext } from "react";
// import { useState } from "react";
// import Carousel from "react-grid-carousel";
// import { SearchContext } from "../context/SearchContext";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import Saloon from "../pages/images/you-have-the-power-to-protect-your-time.png";
// import Salon from "../pages/images/salons.jpeg";
// import Parlour from "../pages/images/parlour.jpg";
// import Spa from "../pages/images/spa.jpeg";
// import DryCleaning from "../pages/images/dry.jpeg";

// const Services = ({ refer }) => {
//   let { city = "shadnagar", type, dispatch } = useContext(SearchContext);
//   const [active, setActive] = useState(type ? type : "salon");

//   const { t } = useTranslation();
//   const handler = (service) => {
//     setActive(service);

//     dispatch({
//       type: "NEW_SEARCH",
//       payload: { type: service, destination: city },
//     });
//   };

<<<<<<< HEAD
  return (
    <div className=" mt-8  text-black " ref={refer}>
      <h1 className="px-2.5 md:px-5 md:text-xl font-semibold pb-3">
        {t("selectService")}
      </h1>
      <Carousel cols={4} rows={1} gap={7}>
        <Carousel.Item>
          <div
            className="relative  h-[8.5rem]  w-full cursor-pointer rounded-md"
            id="section-id"
            onClick={() => ("salon")}
          >
            <img
              src={Salon}
              alt="images"
              style={{
                width: "98%",
                height: 132,
                boxShadow: "1px 1.5px 2px black",
                filter: `${
                  active === "salon" ? "brightness(40%)" : "brightness(70%)"
                }`,
                borderRadius: 10,
                objectFit: "cover",
                objectPosition: "right top",
              }}
            />
            <p
              className={`absolute  ${
                active === "salon"
                  ? "inset-0 flex items-center justify-center"
                  : "bottom-4 left-4"
              }  text-white font-bold  text-2xl `}
            >
              {t("saloons")}
            </p>
            <span
              className={`${
                active === "salon" ? "service-loader" : ""
              } absolute top-1 right-4`}
            ></span>
          </div>
        </Carousel.Item>
=======
//   return (
//     // <div className=" mt-8  text-black " ref={refer}>
//     //   <h1 className="px-2.5 md:px-5 md:text-xl font-semibold pb-3">
//     //     {t("selectService")}
//     //   </h1>
//     //   <Carousel cols={4} rows={1} gap={7}>
//     //     <Carousel.Item>
//     //       <div
//     //         className="relative  h-[8.5rem]  w-full cursor-pointer rounded-md"
//     //         id="section-id"
//     //         onClick={() => handler("salon")}
//     //       >
//     //         <img
//     //           src={Salon}
//     //           alt="images"
//     //           style={{
//     //             width: "98%",
//     //             height: 132,
//     //             boxShadow: "1px 1.5px 2px black",
//     //             filter: `${
//     //               active === "salon" ? "brightness(40%)" : "brightness(70%)"
//     //             }`,
//     //             borderRadius: 8,
//     //             objectFit: "cover",
//     //             objectPosition: "right top",
//     //           }}
//     //         />
//     //         <p
//     //           className={`absolute  ${
//     //             active === "salon"
//     //               ? "inset-0 flex items-center justify-center"
//     //               : "bottom-4 left-4"
//     //           }  text-white font-bold  text-2xl `}
//     //         >
//     //           {t("saloons")}
//     //         </p>
//     //         <span
//     //           className={`${
//     //             active === "salon" ? "service-loader" : ""
//     //           } absolute top-1 right-4`}
//     //         ></span>
//     //       </div>
//     //     </Carousel.Item>
>>>>>>> a73146fe2eab638721f6fff88d6a760251e68001

//     //     <Carousel.Item>
//     //       <div
//     //         className="relative  h-auto w-full cursor-pointer rounded-md"
//     //         onClick={() => handler("parlour")}
//     //       >
//     //         <img
//     //           src={Parlour}
//     //           alt="images"
//     //           style={{
//     //             width: "98%",
//     //             height: 132,
//     //             boxShadow: "1px 1.5px 2px black",
//     //             filter: `${
//     //               active === "parlour" ? "brightness(40%)" : "brightness(70%)"
//     //             }`,
//     //             borderRadius: 8,
//     //             objectFit: "cover",
//     //             objectPosition: "right top",
//     //           }}
//     //         />
//     //         <p
//     //           className={`absolute  ${
//     //             active === "parlour"
//     //               ? "inset-0 flex items-center justify-center"
//     //               : "bottom-4 left-4"
//     //           }  text-white font-bold  text-2xl `}
//     //         >
//     //           {t("beautyParlours")}
//     //         </p>
//     //         <span
//     //           className={`${
//     //             active === "parlour" ? "service-loader" : ""
//     //           } absolute top-1 right-4`}
//     //         ></span>
//     //       </div>
//     //     </Carousel.Item>

//     //     <Carousel.Item>
//     //       <div
//     //         className="relative  h-auto w-full cursor-pointer rounded-md"
//     //         onClick={() => handler("spa")}
//     //       >
//     //         <img
//     //           src={Spa}
//     //           alt="images"
//     //           style={{
//     //             width: "98%",
//     //             height: 132,
//     //             boxShadow: "1px 1.5px 2px black",
//     //             filter: `${
//     //               active === "spa" ? "brightness(40%)" : "brightness(70%)"
//     //             }`,
//     //             borderRadius: 8,
//     //             objectFit: "cover",
//     //             objectPosition: "right top",
//     //           }}
//     //         />
//     //         <p
//     //           className={`absolute  ${
//     //             active === "spa"
//     //               ? "inset-0 flex items-center justify-center"
//     //               : "bottom-4 left-4"
//     //           }  text-white font-bold  text-2xl `}
//     //         >
//     //           {t("spa")}
//     //         </p>
//     //         <span
//     //           className={`${
//     //             active === "spa" ? "service-loader" : ""
//     //           } absolute top-1 right-4`}
//     //         ></span>
//     //       </div>
//     //     </Carousel.Item>
//     //     {/* <Carousel.Item>
//     //       <div
//     //         className="relative h-auto w-full cursor-pointer"
//     //         onClick={() => navigate("/iron")}
//     //       >
//     //         <img
//     //           src="https://res.cloudinary.com/duk9xkcp5/image/upload/v1678872396/drycleaning_r4y1uo.webp"
//     //           alt="images"
//     //           style={{
//     //             width: "98%",
//     //             height: 132,
//     //             boxShadow: "1px 1.5px 2px black",
//     //             filter: `${
//     //               active === "iron" ? "brightness(40%)" : "brightness(70%)"
//     //             }`,
//     //             borderRadius: 8,
//     //             objectFit: "cover",
//     //             objectPosition: "right top",
//     //           }}
//     //         />
//     //         <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
//     //           {t("ironing")}
//     //         </p>
//     //         <span
//     //           className={`${
//     //             active === "iron" ? "service-loader" : ""
//     //           } absolute top-1 right-4`}
//     //         ></span>
//     //       </div>
//     //     </Carousel.Item> */}
//     //     {/* <Carousel.Item>
//     //       <div
//     //         className="relative h-auto w-full cursor-pointer"
//     //         onClick={() =>
//     //           alert(
//     //             "Easytym Dry Cleaning is still under development. We hope to deliver dry cleaning services as soon as poosible!"
//     //           )
//     //         }
//     //       >
//     //         <img
//     //           src={DryCleaning}
//     //           alt="images"
//     //           style={{
//     //             width: "98%",
//     //             height: 132,
//     //             boxShadow: "1px 1.5px 2px black",
//     //             filter: `${
//     //               active === "dryCleaning"
//     //                 ? "brightness(40%)"
//     //                 : "brightness(70%)"
//     //             }`,
//     //             borderRadius: 8,
//     //             objectFit: "cover",
//     //             objectPosition: "right top",
//     //           }}
//     //         />
//     //         <p className="absolute bottom-4 left-4 text-white font-bold  text-2xl ">
//     //           {t("dryCleaning")}
//     //         </p>
//     //       </div>
//     //     </Carousel.Item> */}

//     //     {/* ... */}
//     //   </Carousel>
//     // </div>
//     <></>
//   );
// };

// export default Services;
