import React from "react";
import { Link } from "react-router-dom";
import "./styles.scss";
import getStarted from "../images/getStarted.jpeg";

const GetStarted = () => {
  const handleMouseMove = (e) => {
    const el = document.getElementById("wrapper");
    const d = el.getBoundingClientRect();
    let x = e.clientX - (d.left + Math.floor(d.width / 2));
    let y = e.clientY - (d.top + Math.floor(d.height / 2));
    // Invert values
    x = x - x * 2;
    y = y - y * 2;
    document.documentElement.style.setProperty("--scale", 1.6);
    document.documentElement.style.setProperty("--x", x / 2 + "px");

    document.documentElement.style.setProperty("--y", y / 2 + "px");
  };

  const handleMouseLeave = () => {
    document.documentElement.style.setProperty("--scale", 1);
    document.documentElement.style.setProperty("--x", 0);
    document.documentElement.style.setProperty("--y", 0);
  };

  return (
    <div
      id="wrapper"
      className="flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={handleMouseLeave}
    >
      <Link to="/get-started ">
        <div className="flex items-center justify-center flex-col space-y-5">
          <img
            src={getStarted}
            height={250}
            width={300}
            alt="img"
            className="rounded-md img1"
          ></img>
          <button className="primary-button img1">Get Started</button>
        </div>
      </Link>
    </div>
  );
};

export default GetStarted;
