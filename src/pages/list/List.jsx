import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { toast } from "react-toastify";
import baseUrl from "../../utils/client";

const List = () => {
  let { city, type } = useContext(SearchContext);
  const [data1, setData1] = useState();
  const min = useState(0);
  const max = useState(999);
  const [subType, setSubType] = useState();
  const [gender, setGender] = useState();
  city = city.toLowerCase().trim();

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
    <>
      <div className="min-h-[85.5vh]">
        {loading ? (
          <div className=" flex items-center justify-center h-[70vh]">
            <span className="loader "></span>
          </div>
        ) : (
          <div className="w-full  mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-6xl pb-24">
            <div className="grid grid-cols-10 mx-4 gap-3 md:gap-10 py-8 ">
              <input
                type="text"
                className=" col-span-6 rounded-full p-2 text-center"
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                placeholder="Search shop name..."
                style={{
                  filter: " drop-shadow(0px 0px 0.35px gray)",
                  border: "2.4px solid gray",
                  caretColor: "#00ccbb",
                }}
              />

              <div className="col-span-2">
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
                  <option value="null">Sort By Type</option>
                  <option value={type}>only {type}</option>
                  <option value="spaIncluded">{type} & spa</option>
                </select>
              </div>

              <div className="col-span-2">
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
                  <option value="null">Sort By Gender</option>
                  <option value="women">women</option>
                  <option value="men">men</option>
                  <option value="unisex">unisex</option>
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
                    <p className="text-2xl font-semibold"> No {type}s found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default List;
