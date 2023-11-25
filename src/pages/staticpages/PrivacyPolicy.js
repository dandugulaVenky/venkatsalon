import React from "react";
import { useContext } from "react";
import { useEffect } from "react";

import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";
import { useTranslation } from "react-i18next";

const siteMetadata = {
  title: "Ensuring User Privacy: SEO Privacy Policy",
  description:
    "Learn how we collect, use, and protect personal information to ensure a secure and transparent online experience. Discover our data handling practices, cookie usage, and user rights to empower you with control over your privacy.",
  canonical: "https://easytym.com/privacy-policy",
};

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();

  return (
    <div className="pt-6 pb-20">
      <Seo props={siteMetadata} />
      <div className=" flex flex-col justify-start items-start md:px-20 px-10 overflow-auto space-y-2 ">
        <h1 className="text-2xl font-bold ">{t("easyTymPrivacyPolicy")}</h1>

        <p>{t("privacyDesc")}</p>

        <h2 className="font-bold">{t("informationCollectionAndUse")}</h2>
        <ul className="list-disc">
          <li>
            <p>
              {t(
                "weCollectInformationFromUsersInSeveralDifferentWaysIncluding"
              )}
            </p>
            <ul className="list-disc">
              <li>{t("informationProvidedByUsersWhenCreatingAccount")}</li>
              <li>
                {t("informationProvidedByUsersWhenPlacingOrdermakingPurchase")}
              </li>
              <li>
                {t("informationProvidedByUsersWhenSubscribingToNewsletter")}
              </li>
              <li>
                {t(
                  "informationAutomaticallyCollectedThroughUseOfCookiesOtherTechnologies"
                )}
              </li>
            </ul>
          </li>
          <li>
            <p>{t("informationCollectedMayInclude:")}</p>
            <ul className="list-disc">
              <li>{t("contactInformationSuchAsName")}</li>
              <li>{t("financialInformationSuchAsCreditCard")}</li>
              <li>{t("demographicInformationSuchAsAge")}</li>
              <li>{t("informationAboutUserActivity")}</li>
            </ul>
          </li>
          <li>
            <p>{t("weUseInformationCollectedFor")}</p>
            <ul className="list-disc">
              <li>{t("personalizeUserExperience")}</li>
              <li>{t("processFulfillOrdersAndTransactions")}</li>
              <li>{t("sendPromotionalEmailsNewsletters")}</li>
              <li>{t("improveQualityOfServicesAndWebsite")}</li>
            </ul>
          </li>
        </ul>

        <h2 className="font-bold">{t("informationSharingDisclosure")}</h2>
        <ul className="list-disc">
          <li>
            <p>{t("privacyPolicy1")}</p>
          </li>
          <li>
            <p>{t("privacyPolicy2")}</p>
          </li>
        </ul>

        <h2 className="font-bold">{t("dataSecurity")}</h2>
        <ul className="list-disc">
          <li>
            <p>{t("privacyPolicy3")}</p>
          </li>
          <li>
            <p>{t("privacyPolicy4")}</p>
          </li>
        </ul>

        <h2 className="font-bold">{t("dataRetention")}</h2>
        <ul className="list-disc">
          <li>
            <p>{t("privacyPolicy5")}</p>
          </li>
        </ul>

        <h2 className="font-bold">{t("changesToPrivacyPolicy")}</h2>
        <ul className="list-disc">
          <li>
            <p>{t("privacyPolicy6")}</p>
          </li>
        </ul>

        <h2 className="font-bold">{t("contactInformation")}</h2>
        <ul className="list-disc">
          <li>
            <p>{t("privacyPolicy7")}</p>
            <ul className="list-disc">
              <li>{t("emailTitle")}: rajeshchitikala888@gmail.com</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
