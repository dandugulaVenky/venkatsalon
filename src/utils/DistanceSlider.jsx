import React, { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

const DistanceSlider = () => {
  const { range, dispatch } = useContext(SearchContext);

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_RANGE",
      payload: parseInt(e.target.value),
    });
  };

  // Helper to calculate the tooltip position
  const getPosition = (value, min = 2, max = 10) =>
    ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full max-w-xs px-2">
      {/* Tooltip */}
      <div
        className="absolute -top-7 transform -translate-x-1/2 bg-[#00ccbb] text-white text-xs px-2 py-1 rounded-full shadow-md transition-all"
        style={{ left: `${getPosition(range)}%` }}
      >
        near by {range} km
      </div>

      {/* Slider */}
      <input
        type="range"
        id="distanceRange"
        min="2"
        max="10"
        step="2"
        value={range}
        onChange={handleChange}
        className="w-full h-2 bg-gradient-to-r from-[#00ccbb] to-purple-500 rounded-lg appearance-none accent-white focus:outline-none
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-pink-600
          [&::-webkit-slider-thumb]:shadow-md
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-pink-600"
      />
    </div>
  );
};

export default DistanceSlider;
