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

  // const [time, setTime] = useState(location.state.value);
  // const [openDate, setOpenDate] = useState(false);

  const min = useState(0);
  const max = useState(999);
  const w = window.innerWidth;

  city = city.toLowerCase().trim();

  const { data, loading } = useFetch(
    `${baseUrl}/api/hotels?type=${type}&city=${city}&min=${min || 0}&max=${
      max || 999
    }`
  );
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const [colony, setColony] = useState("");
  const [colonyWiseShops, setColonyWiseShops] = useState([]);
  const [colonies, setColonies] = useState([]);

  const getAllColonies = async () => {
    const colonies = await axios.post(`${baseUrl}/api/hotels/allColonies`, {
      destination: city,
    });

    setColonies(colonies.data);
  };

  const scroll = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!city || !type) {
      toast("Something went wrong!");
      return navigate("/get-started");
    }
    scroll();
  }, []);

  useEffect(() => {
    getColonyWiseShops(colony);
  }, [colony]);

  useEffect(() => {
    getAllColonies();
  }, []);

  const getColonyWiseShops = async (colony) => {
    const shops = await axios.post(`${baseUrl}/api/hotels/getColonyWiseShops`, {
      colony,
      type,
    });
    setLoaded(true);
    // console.log("makodeeeeeeeeeeeeeee", shops);
    setColonyWiseShops(shops.data);
  };
  if (colony) {
    loaded === false && getColonyWiseShops(colony);
  }
  const { open } = useContext(SearchContext);

  return (
    <div>
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      <div className="w-full mx-auto"
      style={{maxWidth:"1200px"}}
      >
        <div className="w-full">
          <div className=" min-h-screen w-full pb-24 md:pt-0 pt-2">
            {loading ? (
              <div className="min-h-[65vh] flex items-center justify-center">
                <span className="loader "></span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 mx-16 p-10">
                  {data?.length <= 0 && (
                    <div className="min-h-[55vh] flex items-center justify-center ">
                      <p className="text-2xl font-semibold">
                        {" "}
                        No {type}s found
                      </p>
                    </div>
                  )}

                  {colony === ""
                    ? data?.map((item) => (
                    <div className="lg:col-span-4 md:col-span-6 col-span-12">
                      <SearchItem item={item} key={item._id} />
                    </div>
                      ))
                    : colonyWiseShops?.map((item) => (
                            <SearchItem item={item} key={item._id} />
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
