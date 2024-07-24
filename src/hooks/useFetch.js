import { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import axiosInstance from "../components/axiosInterceptor";

const useFetch = (url, credentials) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const useEffectOnce = (effect) => {
    const destroyFunc = useRef();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState(0);

    if (effectCalled.current) {
      renderAfterCalled.current = true;
    }

    useEffect(() => {
      // only execute the effect first time around
      if (!effectCalled.current) {
        destroyFunc.current = effect();
        effectCalled.current = true;
      }

      // this forces one render after the effect is run
      setVal((val) => val + 1);

      return () => {
        // if the comp didn't render since the useEffect was called,
        // we know it's the dummy React cycle
        if (!renderAfterCalled.current) {
          return;
        }
        if (destroyFunc.current) {
          destroyFunc.current();
        }
      };
    }, []);
  };

  useEffectOnce(() => {
    // console.log("my effect is running");
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(url, {
          withCredentials: credentials ? credentials.credentials : false,
        });
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
    return () => {};
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axios.get(url);
  //       setData(res.data);
  //     } catch (err) {
  //       setError(err);
  //     }
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
