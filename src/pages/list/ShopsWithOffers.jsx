import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";

import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { toast } from "react-toastify";
import baseUrl from "../../utils/client";
import { t } from "i18next";

function filterShops(array, userInput, city) {
  return array?.filter((shop) => {
    return (
      shop.name.toLowerCase().includes(userInput.toLowerCase()) &&
      shop.city.split(",")[0] === city.split(",")[0]
    );
  });
}

const ShopsWithOffers = () => {
  const navigate = useNavigate();
  const { type, city, lat, lng } = useContext(SearchContext);

  const [userInput, setUserInput] = useState("");
  const [subType, setSubType] = useState("null");
  const [gender, setGender] = useState("null");
  const [areaFilter, setAreaFilter] = useState(city?.split(",")[0] || "null");

  const res = useFetch(
    `${baseUrl}/api/hotels?type=${type || "salon"}&lat=${lat || 0.0}&lng=${
      lng || 0.0
    }`
  );

  const loading = res.loading;

  useEffect(() => {
    if (!city || !type) {
      toast("Something went wrong!");
      navigate("/get-started");
    }
    window.scrollTo(0, 0);
  }, [city, type, navigate]);

  const data = useMemo(() => {
    return (
      res.data?.filter(
        (item) =>
          item?.individualOffer?.length > 0 || item?.overallShopOffer > 0
      ) || []
    );
  }, [res.data]);

  const filteredData = useMemo(() => {
    let result = data;

    if (areaFilter !== "null") {
      result = result.filter((item) => item.city.split(",")[0] === areaFilter);
    }

    if (subType !== "null") {
      result = result.filter((item) => {
        if (subType === type) return item.spaIncluded === false;
        return item.spaIncluded === true;
      });
    }

    if (gender !== "null") {
      result = result.filter((item) => item.subType === gender);
    }

    if (userInput) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(userInput.toLowerCase())
      );
    }

    return result;
  }, [data, userInput, gender, subType, areaFilter, type]);

  const areas = useMemo(() => {
    return [...new Set(data.map((item) => item.city.split(",")[0]))];
  }, [data]);

  return (
    <div className="pt-6 pb-20">
      <div className="min-h-[85.5vh]">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <span className="loader"></span>
          </div>
        ) : (
          <div className="w-full mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
            <div className="grid grid-cols-10 mx-4 gap-3 md:gap-10 pb-6">
              <input
                type="text"
                className="md:col-span-6 col-span-12 rounded-full p-2 text-center"
                style={{
                  filter: "drop-shadow(0px 0px 0.35px gray)",
                  border: "2.4px solid gray",
                  caretColor: "#00ccbb",
                }}
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                placeholder="Search shop name..."
              />

              <div className="md:col-span-2 col-span-6">
                <select
                  className="w-full rounded-full p-2 text-center"
                  onChange={(e) => setSubType(e.target.value)}
                  value={subType}
                  style={{
                    filter: "drop-shadow(0px 0px 0.35px gray)",
                    border: "2.4px solid gray",
                    caretColor: "#00ccbb",
                  }}
                >
                  <option value="null">{t("sortByType")}</option>
                  <option value={type}>only {type}</option>
                  <option value="spaIncluded">{type} & spa</option>
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <select
                  className="w-full rounded-full p-2 text-center"
                  onChange={(e) => setAreaFilter(e.target.value)}
                  value={areaFilter}
                  style={{
                    filter: "drop-shadow(0px 0px 0.35px gray)",
                    border: "2.4px solid gray",
                    caretColor: "#00ccbb",
                  }}
                >
                  <option value="null">Sort By Area</option>
                  {areas.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <select
                  className="w-full rounded-full p-2 text-center"
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  style={{
                    filter: "drop-shadow(0px 0px 0.35px gray)",
                    border: "2.4px solid gray",
                    caretColor: "#00ccbb",
                  }}
                >
                  <option value="null">{t("sortByGender")}</option>
                  <option value="women">{t("women")}</option>
                  <option value="men">{t("men")}</option>
                  <option value="unisex">{t("unisex")}</option>
                </select>
              </div>
            </div>

            <div className="w-full">
              <div className="min-h-screen w-full md:pt-0">
                {filteredData.length > 0 ? (
                  <div className="grid grid-cols-12 mx-auto">
                    {filteredData.map((item) => (
                      <div
                        className="lg:col-span-4 md:col-span-6 col-span-12 mx-4"
                        key={item._id}
                      >
                        <SearchItem item={item} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="min-h-[55vh] grid place-items-center">
                    <p className="text-2xl font-semibold">No {type}s found!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsWithOffers;
