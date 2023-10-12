import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Greeting from "../../components/navbar/Greeting";
import Layout from "../../components/navbar/Layout";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";
import { useTranslation } from "react-i18next";

const siteMetadata = {
  title: "Discover EasyTym | Know About Us",
  description:
    "Join EasyTym today and experience a new level of convenience and efficiency in scheduling your self-care needs.",
  canonical: "https://easytym.com/about-us",
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  let w = window.innerWidth;
  const { open } = useContext(SearchContext);
  const { t } = useTranslation();

  return (
    <>
      <Seo props={siteMetadata} />

      <div className="py-10 px-20 flex flex-col space-y-3 justify-center">
        <div>
          <h1 className="text-2xl font-bold">{t("introduction")}</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("aboutIntroMessage")}
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t("commitmentToConvenience")}</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("commitmentToConvenienceMessage")}
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t("extensiveServiceNetwork")}</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("extensiveServiceNetworkMessage")}
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {t("seamlessBookingExperience")}
          </h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("seamlessBookingExperienceMessage")}
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("empoweringYourChoices")}</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("empoweringYourChoicesMessage")}
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{t("commitmenttoExcellence")}</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("commitmenttoExcellenceMessage")}
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("conclusion")}</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            {t("conclusionMessage")}
          </p>
        </div>
        <p>{t("aboutAddress")}</p>
        <p>{t("callUs")}</p>
        <p>{t("aboutUsEmail")}</p>
      </div>
    </>
  );
};

export default About;
