import {
  faArrowCircleLeft,
  faCog,
  faHistory,
  faHome,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { SearchContext } from "../../context/SearchContext";

const Footer = () => {
  let w = window.innerWidth;
  const { open, dispatch } = useContext(SearchContext);
  const navigate = useNavigate();

  function goBack() {
    navigate(-1); // Navigates back to the previous page
  }

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth <= 768) {
  //       setHideScrollbar(true);
  //     } else {
  //       setHideScrollbar(false);
  //     }
  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  return w >= 768 ? (
    <div className=" w-full">
      <div className="flex items-center justify-center space-x-24 md:space-x-96  bg-[#00ccbb] text-white text-sm pt-10 ">
        <ul className="space-y-2">
          <li className="">Shadnagar</li>
          <li className="">Kothur</li>
          <li className="">Thimmapur</li>
          <li className="">Shamshabad</li>
          <li className="">Attapur</li>
          <li className="">Katedan</li>
        </ul>
        <ul className="space-y-2">
          <li className="">
            <Link to="/about-us" className="text-white">
              About Us
            </Link>{" "}
          </li>
          <li className="">
            <Link to="/contact-us" className="text-white">
              Contact Us
            </Link>{" "}
          </li>
          <li className="text-white">
            <Link to="/privacy-policy" className="text-white">
              Privacy Policy{" "}
            </Link>
          </li>
          <li className="text-white">
            <Link to="/terms-and-conditions" className="text-white">
              Terms & Condi..
            </Link>
          </li>
          <li className="">Careers</li>
          <li className="">Join Us</li>
          <Link to="/test">
            <li>Test</li>
          </Link>
        </ul>
      </div>
      <div className="text-center h-16 text-white bg-[#00ccbb] flex items-center justify-center space-x-2">
        <p>Copyright © 2023 EasyTym </p>
      </div>
    </div>
  ) : (
    <div>
      <div className="h-14  flex items-center justify-center   fixed bottom-0 left-0 right-0  ">
        <div className="bg-gray-200 flex items-center justify-between px-10 py-3  rounded-full w-11/12">
          <Link to="/">
            <FontAwesomeIcon icon={faHome} size="xl" />
          </Link>
          <Link onClick={goBack}>
            <FontAwesomeIcon icon={faArrowCircleLeft} size="xl" />
          </Link>
          <Link to="/history">
            <FontAwesomeIcon icon={faHistory} size="xl" />
          </Link>
          <Link to="/iron-orders">
            <FontAwesomeIcon icon={faShirt} size="xl" />
          </Link>

          <FontAwesomeIcon
            icon={faCog}
            size="xl"
            onClick={() => dispatch({ type: "SIDEBAR_OPEN", payload: !open })}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
