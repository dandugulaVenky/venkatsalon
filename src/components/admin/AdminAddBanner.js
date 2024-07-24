import { useContext, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import baseUrl from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../axiosInterceptor";

const AdminAddBanner = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const { data } = await axiosInstance.get(
        `${baseUrl}/api/hotels/find/${user?.shopId}`
      );

      setData(data);
    };
    window.scrollTo(0, 0);
    getData();
  }, [user?.shopId]);

  //handle images
  const handleImage = (e) => {
    setImages([]);
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImages((oldArray) => [...oldArray, reader.result]);
      };
    });
  };

  //submit the form
  const submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(images);
    if (images.length <= 0) {
      setLoading(false);

      return toast.warn("Add atleast one image!");
    }
    if (images.length >= 7) {
      setLoading(false);

      setImages([]);
      return toast.warn("Only 6 images should be uploaded!");
    }

    try {
      const { data: shopData } = await axiosInstance.get(
        `${baseUrl}/api/hotels/find/${user?.shopId}`,
        {
          withCredentials: true,
        }
      );

      if (shopData?.images?.length > 6) {
        return toast.warn(
          "Only 6 images are supported! Please delete exisiting ones and add others!"
        );
      }

      if (shopData?.images?.length >= 6) {
        return alert(
          "Already shop has 6 images! If u want to add more, please delete any other photo and try adding again!"
        );
      }
      if (!(images?.length > 6 - shopData?.images?.length)) {
        const { data } = await axiosInstance.put(
          `${baseUrl}/api/hotels/hotelImagesUpdate/${user?.shopId}`,
          {
            images,
          },
          {
            withCredentials: true,
          }
        );

        console.log(data);
        if (data.success === true) {
          toast.success("Images added successfully");
          setImages([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setData(data.hotel);
          setLoading(false);
        }
      } else {
        setLoading(false);

        return alert(
          `Please select only ${
            6 - shopData?.images?.length
          } images because this shop already has ${
            shopData?.images?.length
          } images! As Easytym supports only 6 images as per today!`
        );
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
      if (error.response.data.status === 413) {
        toast.warn("Images collectively should contain 10mb or less! ");
      }
    }

    // console.log("images from submit", images);
  };

  const removeImage = async (image) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) {
      return;
    }

    setLoading(true);
    console.log(image);
    if (!image || image === "" || image === undefined) {
      return;
    }
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/api/hotels/hotelImagesDelete/${user?.shopId}`,
        image,
        { withCredentials: true }
      );
      setLoading(false);
      setData(data.hotel);
      toast.success("Deleted Successfuly!");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const [loading2, setLoading2] = useState(false);

  const data1 = {
    name: "Waleed",
    amount: 1,
    number: "7498608775",
    MUID: "MUID" + Date.now(),
    transactionId: "T" + Date.now(),
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading2(true);
    await axiosInstance
      .post(`${baseUrl}/api/phonepe/payment`, { ...data1 })
      .then((res) => {
        setTimeout(() => {
          setLoading2(false);
        }, 1500);
      })
      .catch((error) => {
        setLoading2(false);
        console.error(error);
      });
  };
  return (
    <div className="pt-6 pb-20">
      <div className="min-h-[86.2vh] flex flex-col items-center justify-center mx-2 ">
        <>
          <p className="text-red-400 font-semibold px-4">
            Note1 : Total 6 images are being supported
          </p>
          <p className="text-red-400 font-semibold px-4">
            Note2 : If you want to update any other details, please contact
            easytym
          </p>
          <form
            onSubmit={submitForm}
            className=" col-sm-6 offset-3 pt-5 signup_form "
            enctype="multipart/form-data"
          >
            <div className="form-outline mb-4">
              <input
                ref={fileInputRef}
                onChange={handleImage}
                type="file"
                id="formupload"
                name="image"
                className="form-control"
                multiple
              />
            </div>
            <img className="img-fluid" alt="" />
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Uploading..." : "Add Images"}
            </button>
          </form>
        </>
        <div className="flex card flex-col w-auto   gap-2 my-10 border-2 rounded border-gray-400 p-2  m-8">
          <p className="text-[#00ccbb] font-semibold">
            My Total Pics : {data?.images?.length || 0}
          </p>
          <div className="flex flex-wrap items-center justify-center space-x-5 max-w-7xl ">
            {data?.images?.length > 0
              ? data?.images.map((image, i) => {
                  return (
                    <div className="flex  items-center justify-between space-x-5 my-4">
                      <img
                        src={image.url}
                        style={{
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          maxWidth: 300,
                        }}
                        alt="shop img"
                        key={i}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="lg"
                        className="cursor-pointer "
                        onClick={() => removeImage(image)}
                        disabled={loading}
                      />
                    </div>
                  );
                })
              : data?.images?.length === 0
              ? "No images found!"
              : "Loading...."}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="center">
          {/* <img width={300} src={phonepe} alt="" /> */}
          <h2 className="fs-4 mt-2">
            <span className="text-danger fw-bold">LIVE</span> Payment
            Integration
          </h2>
        </div>
        <div className="card px-5 py-4 mt-5">
          <form onSubmit={handlePayment}>
            <div className="col-12 ">
              <p className="fs-5">
                <strong>Name:</strong> {data1.name}
              </p>
            </div>
            <div className="col-12 ">
              <p className="fs-5">
                <strong>Number:</strong> {data1.number}
              </p>
            </div>
            <div className="col-12 ">
              <p className="fs-5">
                <strong>Amount:</strong> {data1.amount}Rs
              </p>
            </div>

            <div className="col-12 center">
              <button className="w-100 " type="submit">
                Pay Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBanner;
