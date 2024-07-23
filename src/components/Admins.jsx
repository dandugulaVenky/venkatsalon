import React, { useEffect, useState } from "react";
import axios from "axios";
const Admins = () => {
  const [data, setData] = useState();

  const getData = async () => {
    let { data } = await axios.get(
      "http://localhost:8800/api/get-all-contacts"
    );

    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-auto p-10">
      <h1>All Contacts from companies</h1>

      {data?.length > 0
        ? data.map((item) => {
            return (
              <div className="bg-slate-400 p-4 m-4 rounded-md w-400px">
                <p>Name : {item.name}</p>
                <p>Email : {item.email}</p>
                <p>Company : {item.company}</p>
                <p>Message : {item.message}</p>
              </div>
            );
          })
        : "loading..."}
    </div>
  );
};

export default Admins;
