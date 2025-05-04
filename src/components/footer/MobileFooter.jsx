import {
  faArrowCircleLeft,
  faCog,
  faHistory,
  faHome,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { t } from "i18next";

const MobileFooter = () => {
  const { open, dispatch } = useContext(SearchContext);

  const navigate = useNavigate();

  function goBack() {
    navigate(-1); // Navigates back to the previous page
  }
  return (
    <div>
      <div>
        <div className="h-14  flex items-center justify-center   fixed bottom-0 left-0 right-0  ">
          <div className="bg-gray-200 flex items-center justify-between px-10 py-3  rounded-full md:w-6/12 w-10/12">
            <Link to="/">
              <FontAwesomeIcon icon={faHome} size="xl" />
            </Link>
            {/* <Link onClick={goBack}>
              <FontAwesomeIcon icon={faArrowCircleLeft} size="xl" />
            </Link> */}
            <Link to="/history">
              <FontAwesomeIcon icon={faHistory} size="xl" />
            </Link>

            {/* <Link to="/iron-orders">
              <FontAwesomeIcon icon={faShirt} size="xl" />
            </Link> */}

            <FontAwesomeIcon
              icon={faCog}
              size="xl"
              onClick={() => dispatch({ type: "SIDEBAR_OPEN", payload: !open })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;
