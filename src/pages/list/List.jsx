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

const List = () => {
  let { city, type } = useContext(SearchContext);

  // const [time, setTime] = useState(location.state.value);
  // const [openDate, setOpenDate] = useState(false);

  const min = useState(0);
  const max = useState(999);
  const w = window.innerWidth;

  city = city.toLowerCase().trim();

  const { data, loading } = useFetch(
    `/api/hotels?type=${type}&city=${city}&min=${min || 0}&max=${max || 999}`
  );
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const [colony, setColony] = useState("");
  const [colonyWiseShops, setColonyWiseShops] = useState([]);
  const [colonies, setColonies] = useState([]);

  const getAllColonies = async () => {
    const colonies = await axios.post("/api/hotels/allColonies", {
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
    const shops = await axios.post("/api/hotels/getColonyWiseShops", {
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

      <div>
        <div>
          <div className=" min-h-screen pb-24 md:pt-0 pt-2">
            {loading ? (
              <div className="min-h-[65vh] flex items-center justify-center">
                <span className="loader "></span>
              </div>
            ) : (
              <>
                <div className="md:px-44 px-4 ">
                  <select
                    onChange={(e) => setColony(e.target.value)}
                    className=" mb-8 "
                  >
                    <option value="" disabled selected>
                      Select a colony
                    </option>
                    {colonies?.map((shop, i) => {
                      return (
                        <option value={shop} key={i}>
                          {shop}
                        </option>
                      );
                    })}
                  </select>
                  {data.length <= 0 && (
                    <div className="min-h-[55vh] flex items-center justify-center">
                      <p className="text-2xl font-semibold">
                        {" "}
                        No {type}s found
                      </p>
                    </div>
                  )}

                  {colony === ""
                    ? data.map((item) => (
                        <SearchItem item={item} key={item._id} />
                      ))
                    : colonyWiseShops.map((item) => (
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
