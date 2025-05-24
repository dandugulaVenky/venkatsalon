import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Footer = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  return (
    <div className=" w-full footer ">
      <div className="flex items-center justify-center space-x-24 md:space-x-96  bg-[#00ccbb] text-white text-sm pt-10 ">
        <ul className="space-y-2">
          <li className="">{t("shadnagar")}</li>
          <li className="">{t("best hair salon in kothur")}</li>
          <li className="">{t("best hair salon in thimmapur")}</li>
          <li className="">{t("best hair salon in shamshabad")}</li>
          <li className="">{t("best hair salon in attapur")}</li>
          <li className="">{t("best hair salon in katedan")}</li>
        </ul>
        <ul className="space-y-2">
          <li className="">
            <Link to="/about-us" className="text-white">
              {t("aboutUs")}
            </Link>{" "}
          </li>
          <li className="">
            <Link to="/contact-us" className="text-white">
              {t("contactUs")}
            </Link>{" "}
          </li>
          <li className="text-white">
            <Link to="/privacy-policy" className="text-white">
              {t("privacyPolicy")}{" "}
            </Link>
          </li>
          <li className="text-white">
            <Link to="/terms-and-conditions" className="text-white">
              {t("termscondi")}
            </Link>
          </li>
          <li className="">{t("careers")}</li>

          <button
            onClick={() => {
              if (user) {
                navigate("/shop-details");
              } else {
                alert("Please login to join with us!");
              }
            }}
          >
            {t("joinUs")}
          </button>
        </ul>
      </div>
      <div className="text-center h-16 text-white bg-[#00ccbb] flex items-center justify-center space-x-2">
        <p>Copyright © 2023 EasyTym </p>
      </div>
    </div>
  );
};

export default Footer;
