import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import baseUrl from "../../utils/client";
import axiosInstance from "../../components/axiosInterceptor";

const RenewalPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user: mainUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false); // Loading state
  const [selectedPlan, setSelectedPlan] = useState(null); // Store selected plan

  const referenceNum = searchParams.get("reference");
  const durationFromQuery = searchParams.get("duration"); // <-- duration from URL (ex: "3 Months")
  const hotelId = mainUser?.shopId;

  const plans = [
    {
      duration: "3 Months",
      price: "1",
      description: "Basic access for 3 months.",
    },
    {
      duration: "6 Months",
      price: "219",
      description: "Save more with a 6-month plan.",
    },
    {
      duration: "1 Year",
      price: "399",
      description: "Best value for a full year.",
    },
  ];

  // Helper to calculate startDate and endDate
  const calculateDates = (months) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + months);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  // Function to update hotel
  const updateHotel = async (planToUpdate) => {
    try {
      setIsUpdating(true);

      const response = await axiosInstance.put(
        `${baseUrl}/api/hotels/${hotelId}`, // Replace with your backend URL
        {
          plan: {
            description: planToUpdate.description,
            duration: planToUpdate.duration,
            price: planToUpdate.price,
            startDate: planToUpdate.startDate,
            endDate: planToUpdate.endDate,
          },
        }
      );

      if (response.status === 200) {
        // console.log("Hotel data updated successfully", response.data);
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error updating hotel data", error);
      navigate("/admin");
      alert("Error updating hotel data. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!durationFromQuery || !hotelId) return;

    // Find the matching plan
    const plan = plans.find((p) => p.duration === durationFromQuery);

    if (plan) {
      const durationMatch = plan.duration.match(/\d+/);
      const monthsToAdd = durationMatch ? parseInt(durationMatch[0], 10) : 0;

      const { startDate, endDate } = calculateDates(monthsToAdd);

      const updatedPlan = {
        ...plan,
        startDate,
        endDate,
      };

      setSelectedPlan(updatedPlan);
      updateHotel(updatedPlan);
    } else {
      console.error("Plan not found for duration:", durationFromQuery);
    }
  }, [durationFromQuery, hotelId]);

  return (
    <div style={{ padding: "20px" }}>
      {isUpdating || !selectedPlan ? (
        <p>Updating hotel data...</p>
      ) : (
        <div>
          <h1>Renewal Successful</h1>
          <p>
            <strong>Plan:</strong> {selectedPlan.duration}
          </p>
          <p>
            <strong>Price:</strong> ₹{selectedPlan.price}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(selectedPlan.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {new Date(selectedPlan.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Reference:</strong> {referenceNum}
          </p>
        </div>
      )}
    </div>
  );
};

export default RenewalPaymentSuccess;
