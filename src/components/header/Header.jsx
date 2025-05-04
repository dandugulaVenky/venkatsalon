import React, { memo, useMemo } from "react";

import "./header.css";
import AutoComplete from "../AutoComplete";

const Header = (props) => {
  const {
    setHeader,
    setAddress,
    dispatch,
    type,
    city,
    register,
    header,
    bestRef,
  } = useMemo(() => props, [props]);

  if (header === null) {
    return;
  }
  return (
    header !== null && (
      <div
        className={`header  z-50 ${
          header === null
            ? "hidden"
            : header
            ? "slide-right-in"
            : "slide-right-out"
        }`}
      >
        <p className="text-center  md:text-lg text-xs space-x-1  font-semibold">
          {/* <FontAwesomeIcon icon={faLocationDot} size="lg" color="#00ccbb" /> */}
          {/* <span>{city}</span> */}
        </p>

        <AutoComplete
          setHeader={setHeader}
          setAddress={setAddress}
          dispatch={dispatch}
          type={type}
          register={register}
          bestRef={bestRef}
        />
      </div>
    )
  );
};

export default memo(Header);
