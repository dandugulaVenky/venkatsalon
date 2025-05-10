import React, { useState, useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const DistanceSlider = () => {
  const { range, dispatch } = useContext(SearchContext);

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_RANGE",
      payload: e.target.value,
    });
  };

  return (
    <div style={{ maxWidth: "250px" }}>
      <label htmlFor="distanceRange">
        Distance: <strong>{range} km</strong>
      </label>
      <input
        type="range"
        id="distanceRange"
        min="2"
        max="10"
        step="2"
        value={range}
        onChange={handleChange}
        style={{ width: "100%", marginTop: "10px" }}
      />
    </div>
  );
};

export default DistanceSlider;
