import React from "react";
import { useContext } from "react";
import { useEffect } from "react";

import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";
import { useTranslation } from "react-i18next";

const siteMetadata = {
  title: "Discover Saalons | Know About Us",
  description:
    "Join Saalons today and experience a new level of convenience and efficiency in scheduling your self-care needs.",
  canonical: "https://saalons.com/about-us",
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();

  return (
    <div className="pt-6 pb-20">
      <Seo props={siteMetadata} />

      <div className=" px-10 flex flex-col space-y-3 justify-center">
        <div>
          <h1 className="text-2xl  font-bold">{t("introduction")}   </h1>
          <p className="text-sm bg-[#D7FEFB]  border-4  md:text-[15px] leading-6 ">
            {t("aboutIntroMessage")}
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t("commitmentToConvenience")}  </h1>
          <p className="text-sm bg-[#D7FEFB] border-4  md:text-[15px] leading-6 ">
            {t("commitmentToConvenienceMessage")}
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t("extensiveServiceNetwork")} </h1>
          <p className="text-sm bg-[#D7FEFB] border-4  md:text-[15px] leading-6 ">
            {t("extensiveServiceNetworkMessage")}
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {t("seamlessBookingExperience")} 
          </h1>
          <p className="text-sm bg-[#D7FEFB] border-4  md:text-[15px] leading-6 ">
            {t("seamlessBookingExperienceMessage")}
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("empoweringYourChoices")}  </h1>
          <p className="text-sm bg-[#D7FEFB] border-4  md:text-[15px] leading-6 ">
            {t("empoweringYourChoicesMessage")}
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t("commitmenttoExcellence")} </h1>
          <p className="text-sm bg-[#D7FEFB] border-4  md:text-[15px] leading-6 ">
            {t("commitmenttoExcellenceMessage")}
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("conclusion")}  </h1>
          <p className="text-sm bg-[#D7FEFB] border-4  md:text-[15px] leading-6 ">
            {t("conclusionMessage")}
          </p>
        </div>
        <p>{t("aboutAddress")}</p>
        <p>{t("callUs")}</p>
        <p>{t("aboutUsEmail")}</p>
      </div>
    </div>
  );
};

export default About;
