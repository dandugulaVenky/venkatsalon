import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

import Layout from "../../components/navbar/Layout";

import axios from "axios";
import Footer from "../../components/footer/Footer";

import Greeting from "../../components/navbar/Greeting";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import { toast } from "react-toastify";
import baseUrl from "../../utils/client";

const List = () => {
  let { city, type } = useContext(SearchContext);

  const min = useState(0);
  const max = useState(999);
  const w = window.innerWidth;

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

  const { open } = useContext(SearchContext);

  const [userInput, setUserInput] = useState("");
  function filterArray(array, userInput) {
    if (!userInput) {
      return array;
    }
    return array?.filter((shop) => {
      return shop.name.toLowerCase().includes(userInput.toLowerCase());
    });
  }
  const filteredArray = filterArray(data, userInput);

  return (
    <div>
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      <div className="w-full mx-auto md:max-w-xl lg:max-w-3xl xl:max-w-6xl pb-24">
        <div className="flex  items-center justify-center py-10 space-x-2 mx-3">
          <label className="font-semibold md:text-md text-sm">
            Find Shop:{" "}
          </label>
          <input
            type="text"
            className="w-64 rounded-md"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            placeholder="Search shop name"
          />
        </div>
        <div className="w-full ">
          <div className=" min-h-screen w-full  md:pt-0 pt-2">
            {data?.length <= 0 && (
              <div className="min-h-[55vh] grid place-items-center">
                <p className="text-2xl font-semibold"> No {type}s found</p>
              </div>
            )}

            {loading ? (
              <div className="min-h-[65vh] flex items-center justify-center">
                <span className="loader "></span>
              </div>
            ) : (
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
