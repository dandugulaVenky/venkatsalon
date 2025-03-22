import React from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useState } from "react";
import { useEffect } from "react";

import Seo from "../../utils/Seo";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../components/axiosInterceptor";
import baseUrl from "../../utils/client";

const siteMetadata = {
  title: "Contact Us for Hassle-Free Assistance",
  description:
    "Join Saalons today and experience a new level of convenience and efficiency in scheduling your self-care needs.",
  canonical: "https://saalons.com/contact-us",
};

export default function Contact({ company }) {
  const [loading, setLoading] = useState("");

  console.log(company);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    handleSubmit,
    register,

    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, phone, message }) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`${baseUrl}/api/contact`, {
        name,
        email,
        phone,
        message,
        company,
      });

      if (res.status === 200) {
        alert(" Submitted Successfully!!👍");
        setValue("name", "");
        setValue("email", "");
        setValue("phone", "");
        setValue("message", "");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="pt-6 pb-20">
        <Seo props={siteMetadata} />

        <div className=" px-8   flex flex-col items-center justify-center   ">
          <form
            className="px-10 py-2.5 card h-auto  "
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-4 text-2xl font-semibold">{t("contactUs")}</h1>

            <div className="mb-4">
              <label htmlFor="name">{t("fullName")}</label>
              <input
                type="text"
                className="w-full"
                id="name"
                autoFocus
                {...register("name", {
                  required: "Please enter fullname",
                  minLength: {
                    value: 5,
                    message: "Please enter more than 5 chars",
                  },
                })}
              />
              {errors.name && (
                <div className="text-red-500">{errors.name.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email">{t("emailTitle")}</label>
              <input
                className="w-full"
                type="email"
                id="password"
                {...register("email", {})}
              />
              {errors.email && (
                <div className="text-red-500 ">{errors.email.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="phone">{t("phoneTitle")}</label>
              <input
                type="text"
                className="w-full"
                id="phone"
                {...register("phone", {
                  required: "Please enter contact number",
                  minLength: {
                    value: 10,
                    message: "Please enter 10 numbers",
                  },
                })}
              />
              {errors.phone && (
                <div className="text-red-500">{errors.phone.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="message">{t("messageTitle")}</label>
              <textarea
                type="text"
                className="w-full"
                id="message"
                {...register("message", {
                  required: "Please enter message",
                  minLength: {
                    value: 30,
                    message: "Please enter more than 30 chars",
                  },
                })}
              />
              {errors.message && (
                <div className="text-red-500">{errors.message.message}</div>
              )}
            </div>
            <div className="mb-1">
              <button className="primary-button">{t("submit")}</button>
            </div>
          </form>
          {/* <div className="card h-auto  w-96 p-8 flex items-center justify-center">
            <p>{t("aboutAddress")} </p>
            <p>{t("callUs")}</p>
            <p>{t("aboutUsEmail")}</p>
          </div> */}
        </div>
      </div>
    </>
  );
}
