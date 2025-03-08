import React, { useContext, useState, useEffect, useRef } from "react";

import baseUrl from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../components/axiosInterceptor";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import { t } from "i18next";

const MyBarbers = () => {
  const [barberList, setBarberList] = useState([]);
  const [existingBarberList, setExistingBarberList] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading1, setLoading1] = useState(false);
  const [completed, setCompleted] = useState(false);
  const fileInputRef = useRef(null);
  // const [loading, setLoading] = useState(false);
  const [barberData, setBarberData] = useState({
    name: "",
    profileImage: null,
    rawProfileImage: null,
    experience: "",
    number: "",
    phoneVerified: false,
  });

  const [editingBarber, setEditingBarber] = useState(null); // To store barber being edited
  const [roomData, setRoomData] = useState([]);
  // const [phoneVerified, setPhoneVerified] = useState(false);

  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const [disable, setDisable] = useState(false);
  const [disable1, setDisable1] = useState(false);

  // const [number, setNumber] = useState("");
  const [disableNow, setDisableNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Fetch existing barbers when the component mounts
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseUrl}/api/hotels/barbers/${user?.shopId}`
        );

        const { data } = await axiosInstance.get(
          `${baseUrl}/api/hotels/room/${user?.shopId}`
        );

        setRoomData(data[0]?.roomNumbers);

        setExistingBarberList(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.error("Error fetching barbers:", error);
        alert("Failed to fetch barbers.");
      }
    };

    if (user?.shopId) {
      setLoading(true);
      fetchBarbers();
    }
  }, [user?.shopId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBarberData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeNumber = (name, value) => {
    setBarberData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e) => {
  //   setBarberData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);

      setBarberData((prev) => ({
        ...prev,
        profileImage: fileURL, // For preview
        rawProfileImage: file, // For submission
      }));
    }
  };

  // const handleAddBarber = (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (
  //     !barberData.name ||
  //     !barberData.profileImage ||
  //     !barberData.experience
  //   ) {
  //     alert("Please fill all the fields!");
  //     setLoading(false);

  //     return;
  //   }

  //   setBarberList((prev) => [...prev, barberData]);
  //   setBarberData({ name: "", profileImage: null, experience: "" });
  //   setLoading(false);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const handleAddBarber = async (e) => {
    e.preventDefault();

    if (
      !barberData.name ||
      !barberData.rawProfileImage ||
      !barberData.experience ||
      !barberData.phoneVerified ||
      !barberData.number
    ) {
      alert("Please fill all the fields!");
      return;
    }
    console.log({ existingBarberList, barberList });

    if (existingBarberList?.length + barberList?.length >= roomData?.length) {
      return alert(`You can only add maximum of ${roomData?.length} barbers!`);
    }

    // setBarberList((prev) => [
    //   ...prev,
    //   {
    //     name: barberData.name,
    //     experience: barberData.experience,
    //     profileImage: barberData.profileImage, // Preview URL
    //     rawProfileImage: barberData.rawProfileImage,
    //     phone: barberData.number,
    //     phoneVerified: barberData.phoneVerified,
    //     // Actual file object
    //   },
    // ]);

    // setBarberData({
    //   name: "",
    //   profileImage: null,
    //   rawProfileImage: null,
    //   experience: "",
    //   phoneVerified: false,
    //   number: "",
    // });

    setLoading1(true);

    const barbersToSend = new Promise((resolve, reject) => {
      const reader = new FileReader();

      if (barberData.rawProfileImage) {
        reader.readAsDataURL(barberData.rawProfileImage); // Use rawProfileImage
        reader.onloadend = () => {
          resolve({
            shopId: user?.shopId,
            barberDataId: barberData._id || null,
            name: barberData.name,
            experience: barberData.experience,
            profileImage: reader.result,
            phone: barberData.number,
            phoneVerified: barberData.phoneVerified,
            // Base64-encoded image
          });
        };
        reader.onerror = reject;
      } else {
        reject(new Error("No rawProfileImage found for barber"));
      }
    });

    try {
      const barbersData = await Promise.resolve(barbersToSend);

      await axiosInstance.put(
        `${baseUrl}/api/hotels/barbersUpdate/${user?.shopId}`,
        {
          barbers: barbersData,
        },
        {
          withCredentials: true,
        }
      );

      alert("Data submitted successfully!");

      setBarberData({
        name: "",
        profileImage: null,
        rawProfileImage: null,
        experience: "",
        number: "",
        phoneVerified: false,
      });
      setLoading1(false);
      setCompleted(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed!");
    } finally {
      setLoading1(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleSubmitAll = async () => {

  // };

  // Edit Barber: Fill the form with the existing barber data
  const handleEditBarber = (barber) => {
    setEditingBarber(barber); // Set barber being edited
    setBarberData({
      name: barber.name,
      experience: barber.experience,
      profileImage: null,
    });
  };

  // Update Barber
  const handleUpdateBarber = async (e) => {
    e.preventDefault();

    if (
      !barberData.name ||
      !barberData.experience ||
      !barberData.phoneVerified ||
      !barberData.number
    ) {
      alert("Please fill all the fields!");
      return;
    }

    try {
      // Check if a new profile image is uploaded
      let updatedProfileImage = barberData.profileImage;
      let profileImageBase64 = null;

      if (
        updatedProfileImage &&
        updatedProfileImage !== editingBarber.profileImage
      ) {
        // Convert the new profile image to Base64
        const reader = new FileReader();
        profileImageBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(updatedProfileImage);
        });
      }

      // Prepare the payload to send to the backend
      const payload = {
        barberId: editingBarber._id, // Pass barberId to identify the barber
        name: barberData.name,
        experience: barberData.experience,
        profileImage: profileImageBase64 || editingBarber.profileImage, // Use new image if provided
        phone: barberData.number,
      };

      // Send the PUT request to the backend
      const response = await axiosInstance.put(
        `${baseUrl}/api/hotels/updateBarber/${payload.barberId}/${user?.shopId}`,
        {
          barber: payload,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("Barber updated successfully!");
        window.location.reload();
      } else {
        alert(response.data.data.message || "Failed to update barber.");
      }
    } catch (error) {
      console.error("Error updating barber:", error);
      alert("An error occurred while updating the barber.");
    }
  };

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseUrl}/api/hotels/barbers/${user?.shopId}`
        );

        setExistingBarberList(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.error("Error fetching barbers:", error);
        alert("Failed to fetch barbers.");
      }
    };

    fetchBarbers();
  }, [completed]);

  const handleDeleteBarber = async (barberId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this barber?"
    );
    if (!confirmDelete) return;

    try {
      // If this barber is from the backend (existing barber)
      if (barberId) {
        const response = await axiosInstance.delete(
          `${baseUrl}/api/hotels/deleteBarber/${barberId}/${user?.shopId}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          alert("Barber deleted successfully!");
        } else {
          alert(response.data.message || "Failed to delete barber.");
          return;
        }
      }

      // Update local state
      setExistingBarberList((prevList) =>
        prevList.filter((barber) => barber._id !== barberId)
      );
      setBarberList((prevList) =>
        prevList.filter((barber) => barber._id !== barberId)
      );
    } catch (error) {
      console.error("Error deleting barber:", error);
      alert("An error occurred while deleting the barber.");
    }
  };
  const handleDeleteBarber1 = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this barber?"
    );
    if (!confirmDelete) return;

    // If this barber is from the backend (existing barber)
    setBarberList((prevList) => prevList.filter((_, i) => i !== index));

    // Update local state
  };

  const getOtp = async (e) => {
    e.preventDefault();
    setDisableNow(true);
    if (!barberData.number) return toast("Something is wrong!");

    if (
      barberData.number.toString().length !== 13 ||
      barberData.number === undefined
    )
      return;
    try {
      setDisable(true);
      const response = await setUpRecaptcha(barberData.number);
      setResult(response);
      setFlag(true);
    } catch (err) {
      toast(err.message);
      setFlag(false);
      setDisable(false);
    }
  };

  function setUpRecaptcha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          setDisable(false);
          setOtpSent(true);
          // reCAPTCHA solved - allow signInWithPhoneNumber.
        },
        "expired-callback": () => {
          setOtpSent(false);
          setDisable(false);
          // Response expired. Ask user to re-enter.
        },
      },
      auth
    );
    return recaptchaVerifier.verify().then(() => {
      return signInWithPhoneNumber(auth, barberData.number, recaptchaVerifier);
    });
  }

  const verifyOtp = async (e) => {
    e.preventDefault();

    setDisableNow(false);
    if (otp === "" || otp === null) return;
    setDisable(true);

    try {
      await result.confirm(otp);
      setBarberData((prev) => ({ ...prev, phoneVerified: true }));
      toast.success("Phone number verified successfully!");
      setDisable(false);
      setDisable1(true);
    } catch (err) {
      toast.error(`${err.message} please recheck the otp and try again!`);
      setDisable(false);
      setFlag(false);
      setDisable1(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Existing Barbers List */}

      {loading ? (
        "loading..."
      ) : existingBarberList?.length > 0 ? (
        <div className="overflow-x-auto">
          <h1>Existing Barbers</h1>
          <table className="w-full bg-white rounded-md shadow-md mt-3 mb-6">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Experience</th>
                <th className="px-4 py-2 text-left">Profile Image</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {existingBarberList.map((barber, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{barber.name}</td>
                  <td className="px-4 py-2">{barber.experience} years</td>
                  <td className="px-4 py-2">
                    <img
                      src={barber.profileImage}
                      alt="Profile"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditBarber(barber)}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(barber._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        "No exisitng barbers found! please add!"
      )}

      <form
        onSubmit={editingBarber ? handleUpdateBarber : handleAddBarber}
        className="bg-white p-6 rounded-md shadow-md mb-6"
      >
        <h2 className="text-2xl font-bold mb-4">
          {editingBarber ? "Edit Barber Details" : "Add Barber Details"}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={barberData.name}
            onChange={handleChange}
            placeholder="Enter barber's name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Profile Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Profile Image{" "}
            {editingBarber && (
              <span className="text-yellow-500">
                *Upload a new photo otherwise previous will remain same
              </span>
            )}
          </label>
          <input
            type="file"
            ref={fileInputRef}
            name="profileImage"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-gray-700 file:bg-white hover:file:bg-gray-100"
          />
          {/* {editingBarber && barberData.profileImage && (
            <img
              src={barberData.profileImage}
              alt="Profile"
              className="w-16 h-16 object-cover mt-2"
            />
          )} */}
        </div>

        {/* Experience */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Experience (in years)
          </label>
          <input
            type="number"
            name="experience"
            value={barberData.experience}
            onChange={handleChange}
            placeholder="Enter experience"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {
          <div className="space-y-2 mt-7">
            <label htmlFor="phone">{t("phoneTitle")}</label>
            <PhoneInput
              defaultCountry="IN"
              name="number"
              value={barberData.number}
              onChange={(value) => handleChangeNumber("number", value)}
              placeholder="Enter Phone Number"
              readOnly={disableNow}
              className="w-full"
              disabled={flag}
            />
            <div id="recaptcha-container"></div>
            {!otpSent && (
              <button
                className={` ${
                  barberData.number?.length !== 13
                    ? "default-button"
                    : "primary-button"
                } `}
                onClick={getOtp}
                // disabled={
                //   disable || barberData.number?.toString()?.length !== 13
                // }
              >
                {disable ? "Sending..." : t("getOtp")}
              </button>
            )}
          </div>
        }

        {barberData.phoneVerified && (
          <div className="space-y-2"> Phone number verified successfully!</div>
        )}

        {!barberData.phoneVerified && (
          <div className="space-y-2">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter otp"
              className="w-full"
            />
            <div id="recaptcha-container"></div>
            {
              <button
                className={`${disable ? "default-button" : "primary-button"}`}
                onClick={verifyOtp}
                disabled={disable1}
              >
                {disable1 ? "Verifying..." : "Verify"}
              </button>
            }
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {editingBarber
            ? loading
              ? "loading..."
              : "Update Barber"
            : "Add Barber"}
        </button>
      </form>

      {/* {barberList?.length > 0 && (
        <div>
          <h1>Add New Barbers</h1>

          {
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-md shadow-md mb-6">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Experience</th>
                    <th className="px-4 py-2 text-left">Profile Image</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {barberList.map((barber, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{barber.name}</td>
                      <td className="px-4 py-2">{barber.experience} years</td>
                      <td className="px-4 py-2">
                        <img
                          src={barber.profileImage}
                          alt="Profile"
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEditBarber(barber)}
                          className="text-blue-500 hover:underline mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBarber1(index)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      )} */}

      {/* {barberList?.length > 0 && (
        <button
          onClick={handleSubmitAll}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 mb-20"
        >
          {loading1 ? "loading..." : "Submit"}
        </button>
      )} */}
    </div>
  );
};

export default MyBarbers;
