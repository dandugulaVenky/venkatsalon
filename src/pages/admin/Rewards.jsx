import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";

const Rewards = () => {
  const { user } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${baseUrl}/api/hotels/getRewards/${user?.shopId}`
        );
        setRewards(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [user?.shopId]);
  return (
    <div className="h-screen">
      <div className="flex items-center justify-between px-5 py-5">
        <p className="text-2xl font-semibold">My Rewards</p>
        <p className="text-2xl font-semibold">
          Total :{" "}
          {rewards.reduce(
            (curr, newReward) => curr + newReward.rewardAmount,
            0
          )}{" "}
          Rs
        </p>
      </div>
      <div className="flex items-center space-x-4 flex-wrap px-5 py-5">
        {rewards?.map((reward) => {
          return (
            <div key={reward._id} className="card p-4">
              <h1>Refrence : {reward.referenceNumber}</h1>
              <p>Amount : {reward.rewardAmount}</p>
              <p>From : {reward.fromCustomer}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;
