import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { toast } from "react-toastify";
import baseUrl from "../../utils/client";
import { t } from "i18next";
import LanguageContext from "../../context/LanguageContext";

const List = () => {
  let { city, type } = useContext(SearchContext);
  const [data1, setData1] = useState();
  const min = useState(0);
  const max = useState(999);
  const [subType, setSubType] = useState();
  const [gender, setGender] = useState();
  city = city.toLowerCase().trim();
  const { locale, setLocale } = useContext(LanguageContext);

  const { data, loading } = useFetch(
    `${baseUrl}/api/hotels?type=${type}&city=${city}&min=${min || 0}&max=${
      max || 999
    }`
  );

  const navigate = useNavigate();

  const scroll = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!city || !type) {
      toast("Something went wrong!");
      return navigate("/get-started");
    }
    scroll();
  }, [city, navigate, type]);

  const [userInput, setUserInput] = useState("");
  function filterArray(array, userInput) {
    if (!userInput) {
      return array;
    }
    return array?.filter((shop) => {
      return shop.name.toLowerCase().includes(userInput.toLowerCase());
    });
  }

  const [filteredArray, setFilteredArray] = useState();

  useEffect(() => {
    setData1(data);
    setSubType("null");
    setGender("null");
    let filteredArray = filterArray(data, userInput);
    setFilteredArray(filteredArray);
  }, [data, userInput]);

  // useEffect(() => {
  //   if (gender === "null" && subType === "null") {
  //     let filteredArray = filterArray(data, userInput);

  //     setFilteredArray(filteredArray);
  //   } else if (gender === "null" && subType !== "null") {
  //     let filteredArray = filterArray(data1, userInput);
  //     setFilteredArray(filteredArray);
  //   } else if (gender !== "null" && subType === "null") {
  //     let dat = data.filter((item) => item.subType === gender);
  //     let filteredArray = filterArray(dat, userInput);
  //     setFilteredArray(filteredArray);
  //   } else {
  //     if (gender !== "null" && gender !== undefined) {
  //       let dat = data1?.filter((item) => item.subType === gender);
  //       let filteredArray = filterArray(dat, userInput);
  //       setFilteredArray(filteredArray);
  //     } else {
  //       return;
  //     }
  //     return;
  //   }
  // }, [data, data1, gender, subType, userInput]);

  const filteredType = (e) => {
    setGender(e.target.value);

    if (e.target.value === "null") {
      setFilteredArray(data);
      return;
    }

    const matter = data1?.filter((item) => item.subType === e.target.value);
    setFilteredArray(matter);

    return;
  };
  const filteredTypeofShopType = (e) => {
    setGender("null");
    setSubType(e.target.value);

    if (e.target.value === "null") {
      setFilteredArray(data);
      return;
    }

    const matter = data.filter((item) => {
      if (e.target.value === type) {
        return item.spaIncluded === false;
      } else {
        return item.spaIncluded === true;
      }
    });

    setData1(matter);
    setFilteredArray(matter);
    return;
  };

  return (
    <div className="pt-6 pb-20">
      <div className="min-h-[85.5vh] ">
        {loading ? (
          <div className=" flex items-center justify-center h-[70vh]">
            <span className="loader "></span>
          </div>
        ) : (
          <div className="w-full  mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-6xl ">
            <div className="grid grid-cols-10 mx-4 gap-3 md:gap-10 pb-6 ">
              <input
                type="text"
                className=" md:col-span-6 col-span-12 rounded-full p-2 text-center"
                style={{
                  filter: " drop-shadow(0px 0px 0.35px gray)",
                  border: "2.4px solid gray",
                  caretColor: "#00ccbb",
                }}
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                placeholder="Search shop name..."
              />

              <div className="md:col-span-2 col-span-6">
                <select
                  className=" max-w-2xl mx-auto w-full rounded-full p-2 text-center"
                  onChange={filteredTypeofShopType}
                  style={{
                    filter: " drop-shadow(0px 0px 0.35px gray)",
                    border: "2.4px solid gray",
                    caretColor: "#00ccbb",
                  }}
                  value={subType}
                >
                  <option value="null">{t("sortByType")}</option>
                  <option value={type}>
                    {locale === "en"
                      ? t("onlyType", { type: type })
                      : locale === "te"
                      ? t("onlyType", {
                          type: type === "saloon" ? "సెలూన్లు" : "పార్లర్లు",
                        })
                      : t("onlyType", {
                          type: type === "saloon" ? "सैलून" : "पार्लर",
                        })}
                  </option>
                  <option value="spaIncluded">
                    {locale === "en"
                      ? t("typeSpa", { type: type })
                      : locale === "te"
                      ? t("typeSpa", {
                          type: type === "saloon" ? "సెలూన్లు" : "పార్లర్లు",
                        })
                      : t("typeSpa", {
                          type: type === "saloon" ? "सैलून" : "पार्लर",
                        })}
                  </option>
                </select>
              </div>

              <div className="md:col-span-2 col-span-6">
                <select
                  className=" max-w-2xl mx-auto w-full rounded-full p-2 text-center"
                  onChange={filteredType}
                  style={{
                    filter: "drop-shadow(0px 0px 0.35px gray)",
                    border: "2.4px solid gray",
                    caretColor: "#00ccbb",
                  }}
                  value={gender}
                >
                  <option value="null">{t("sortByGender")}</option>
                  <option value="women">{t("women")}</option>
                  <option value="men">{t("men")}</option>
                  <option value="unisex">{t("unisex")}</option>
                </select>
              </div>
            </div>
            <div className="w-full ">
              <div className=" min-h-screen w-full  md:pt-0 ">
                {!loading && (
                  <>
                    <div className="grid grid-cols-12  gap-8 mx-auto">
                      {filteredArray?.map((item) => (
                        <div className="lg:col-span-4 md:col-span-6 col-span-12  mx-auto ">
                          <SearchItem item={item} key={item._id} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {!loading && data?.length <= 0 && (
                  <div className="min-h-[55vh] grid place-items-center">
                    <p className="text-2xl font-semibold">
                      {locale === "en"
                        ? t("noTypeFound1", { type: type })
                        : locale === "te"
                        ? t("noTypeFound1", {
                            type: type === "saloon" ? "సెలూన్లు" : "పార్లర్లు",
                          })
                        : t("noTypeFound1", {
                            type: type === "saloon" ? "सैलून" : "पार्लर",
                          })}
                    </p>
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

export default List;
