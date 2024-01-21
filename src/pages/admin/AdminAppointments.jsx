import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import baseUrl from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import DatePicker from "react-date-picker";
import { useTranslation } from "react-i18next";
import Charts from "../../utils/Charts";
import { useNavigate } from "react-router-dom";

function tileClassName({ date, view }) {
  // Add logic to check if it's Tuesday
  if (view === "month" && date.getDay() === 2) {
    return "red-tuesday";
  }
  return null;
}
const AdminAppointments = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  function formatDateToBackendFormat(date) {
    const formattedDate = new Date(date);
    console.log(formattedDate);
    const c = moment(formattedDate).format("MMM Do YY");

    return c;
  }
  const [value, setValue] = useState();
  const [allOrders, setAllOrders] = useState();
  const [appointments, setAppointments] = useState();
  const endRef = useRef(null);
  const [months, setMonths] = useState(100);
  const [appointmentChart, setAppointmentChart] = useState();
  const [update, setUpdate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const requests = async () => {
      let startDate = "";
      let endDate = "";
      console.log("req", months);
      if (months === 1) {
        startDate = moment().date(1).format("MMM Do YY");
        endDate = moment().add(6, "days").format("MMM Do YY");
      } else if (months === 2) {
        startDate = moment().subtract(1, "month").date(1).format("MMM Do YY");
        endDate = moment(new Date()).format("MMM Do YY");
      } else if (months === 3) {
        startDate = moment().subtract(2, "month").date(1).format("MMM Do YY");
        endDate = moment(new Date()).format("MMM Do YY");
      } else if (months === 6) {
        startDate = moment().subtract(5, "month").date(1).format("MMM Do YY");
        endDate = moment(new Date()).format("MMM Do YY");
      } else if (months === 7) {
        startDate = moment(new Date()).format("MMM Do YY");
        endDate = moment().add(6, "days").format("MMM Do YY");
      } else if (months === 100) {
        startDate = moment(value).format("MMM Do YY");
        endDate = moment(value).format("MMM Do YY");
      } else {
        console.log("nothing selected");
      }
      await axios
        .post(
          `${baseUrl}/api/hotels/getShopAppointmentsCompare/${user?.shopId}`,
          {
            startDate,
            endDate,
          },
          { withCredentials: true }
        )

        .then(async (res) => {
          setAllOrders(res.data);
          setAppointments(res.data);
          let statusDoneServices = res.data.filter(
            (booking) => booking.status === "Accepted"
          );
          let resultInServices = {};

          for (let i = 0; i < statusDoneServices.length; i++) {
            const date = statusDoneServices[i].date;

            resultInServices[date] = (resultInServices[date] || 0) + 1;
          }

          console.log(resultInServices);

          const arr = Object.keys(resultInServices).map((key) => {
            return {
              name: key,
              count: resultInServices[key],
            };
          });
          setAppointmentChart(arr);
        })

        .catch((error) => {
          console.error(error.response.data.message);
          navigate("/login", { state: { destination: `/admin` } });
        });
    };
    requests();
  }, [months, value, update]);

  const handleAcception = async (date, userId) => {
    const initialSelectedDates = Array.from({ length: 7 }, (_, index) => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + index);

      return formatDateToBackendFormat(currentDate);
    });

    if (initialSelectedDates.includes(date)) {
      try {
        let { status } = await axios.put(
          `${baseUrl}/api/hotels/updateAppointment/${user?.shopId}`,
          { date: date, status: "Accepted", userId },
          { withCredentials: true }
        );
        setUpdate(!update);
        setValue(null);
        alert("Updated Successfully");

        if (status !== 200) {
          alert("something Wrong!");
        }
      } catch (error) {
        setUpdate(!update);
        setValue(null);

        console.log(error);
        alert("something Wrong!");
      }
    } else {
      setUpdate(!update);
      setValue(null);

      alert("cannot accept");
    }
  };

  const handleRejection = async (date, userId) => {
    const initialSelectedDates = Array.from({ length: 7 }, (_, index) => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + index);

      return formatDateToBackendFormat(currentDate);
    });

    if (initialSelectedDates.includes(date)) {
      try {
        let { status } = await axios.put(
          `${baseUrl}/api/hotels/updateAppointment/${user?.shopId}`,
          { date: date, status: "Cancelled", userId },
          { withCredentials: true }
        );

        setUpdate(!update);

        setValue(null);

        alert("Cancelled Successfully");

        if (status !== 200) {
          alert("something Wrong!");
        }
      } catch (error) {
        setUpdate(!update);
        setValue(null);

        console.log(error);
        alert("something Wrong!");
      }
    } else {
      setUpdate(!update);
      setValue(null);

      alert("cannot cancel");
    }
  };

  const modifiedOnChange = (selectedDate) => {
    console.log(typeof selectedDate, "strokeLinejoin");

    if (selectedDate === null) {
      setAppointments(allOrders);
      setValue(null);
      setMonths(100);

      return;
    }
    // Perform your desired modifications or actions her
    setValue(selectedDate);
    setMonths(100);
  };

  return (
    <>
      <div className="bg-slate-300 p-4 flex flex-wrap gap-2 items-center justify-around ">
        <DatePicker
          onChange={modifiedOnChange}
          tileClassName={tileClassName}
          value={value}
          className="bg-slate-200 text-blue-400  h-10 z-10  rounded-md p-2 ml-2.5 my-2  w-auto"
        />
        <div className="">
          <select
            className="bg-slate-100  px-2.5  h-10 rounded-md md:w-[14.3rem] w-auto z-10 border-2 border-black"
            onChange={(e) => {
              setMonths(Number(e.target.value));
              setValue(null);
            }}
            value={months}
          >
            <option value={100} selected>
              {t("selectMonth")}
            </option>
            <option value={7}>this week</option>
            <option value={1}>{t("thisMonth")}</option>
            <option value={2}>{t("lastMonth")}</option>

            <option value={3}>{t("lastThreeMonths")}</option>
            <option value={6}>{t("lastSixMonths")}</option>
          </select>
        </div>
        <button
          className="bg-green-600 px-2 py-1.5  rounded-md text-white"
          onClick={() => {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t("seeStatistics")}
        </button>
      </div>
      <div className="min-h-[87vh] py-5  px-5 md:m-10 mb-20">
        {appointments?.length === 0 && <p>No Appointments Found!</p>}

        <div className=" grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {appointments?.map((item, i) => {
            return (
              <div className="border-2 border-gray-300 p-3 rounded-lg md:max-w-[300px] mx-auto shadow-2xl">
                <div className="flex  justify-between items-start gap-5">
                  <div className="flex-1 flex-col flex justify-start items-center gap-3 cursor-pointer ">
                    <div className="px-2 flex flex-col space-y-3">
                      <h3 className="font-satoshi  md:text-xl text-sm font-extrabold text-gray-900">
                        Date: {item.date}
                      </h3>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-blue-600 to-[#00ccbb] rounded-md py-1">
                        Phone: {item.phone}
                      </p>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-blue-600 to-[#00ccbb] rounded-md p-2">
                        Email: {item.email}
                      </p>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-blue-600 to-[#00ccbb] rounded-md py-1">
                        Ref: {item.referenceNum}
                      </p>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-blue-600 to-[#00ccbb] rounded-md py-1">
                        TotalAmount: {item.totalAmount}
                      </p>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-blue-600 to-[#00ccbb] rounded-md py-1">
                        Username: {item.username}
                      </p>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md py-1">
                        Validity: {item.validity}
                      </p>
                      <p className="font-satoshi text-md text-white font-extrabold text-center bg-gradient-to-r from-green-700 to-cyan-600 rounded-md py-1">
                        Status: {item.status}
                      </p>
                    </div>

                    <div className="flex space-x-2 space-y-2">
                      <button
                        className="primary-button"
                        onClick={() => handleAcception(item.date, item.userId)}
                      >
                        Accept
                      </button>
                      <button
                        className="default-button"
                        onClick={() => handleRejection(item.date, item.userId)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="min-w-full overflow-auto py-10" ref={endRef}>
            <p className="py-10 text-center font-bold">
              This Chart Shows only Accepted Count
            </p>
            <Charts
              data={appointmentChart}
              XAxisDatakey="name"
              BarDataAmount="count"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAppointments;
