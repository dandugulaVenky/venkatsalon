import React from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import axios from "axios";

import Layout from "../../components/navbar/Layout";

import Footer from "../../components/footer/Footer";
import { useState } from "react";
import { useEffect } from "react";

import Sidebar from "../../components/navbar/SIdebar";
import Greeting from "../../components/navbar/Greeting";
import { useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";
import { useTranslation } from 'react-i18next';


const siteMetadata = {
  title: "Contact Us for Hassle-Free Assistance",
  description:
    "Join EasyTym today and experience a new level of convenience and efficiency in scheduling your self-care needs.",
  canonical: "https://easytym.com/contact-us",
};

export default function Contact() {
  const [loading, setLoading] = useState("");

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
      const res = await axios.post("/api/sendmail", {
        type: "contact",
        contactName: name,
        email,
        phone,
        message,
      });

      if (res.status === 201) {
        toast("Email Sent Successfully!!👍");
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
  const { open } = useContext(SearchContext);
  const { t } = useTranslation();


  let w = window.innerWidth;
  return (
    <>
      <div>
        {open && <Sidebar />}
        {w >= 768 && <Layout />}
        {w < 768 && <Greeting />}

        <Seo props={siteMetadata} />

        <div className=" min-h-screen px-8   flex flex-col items-center justify-center  md:mt-12 -mt-5 ">
          <form
            className="px-10 py-2.5 card h-auto  "
            onSubmit={handleSubmit(submitHandler)}
          >
            <h1 className="mb-4 text-2xl font-semibold">{t('contactUs')}</h1>

            <div className="mb-4">
              <label htmlFor="name">{t('fullName')}</label>
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
              <label htmlFor="email">{t('emailTitle')}</label>
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
              <label htmlFor="phone">{t('phoneTitle')}</label>
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
              <label htmlFor="message">{t('messageTitle')}</label>
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
              <button className="primary-button" disabled={loading}>
                {t('submit')}
              </button>
            </div>
          </form>
          <div className="card h-auto  w-96 p-8 flex items-center justify-center">
            <p>
              {t('aboutAddress')}{" "}
            </p>
            <p>{t('callUs')}</p>
            <p>{t('aboutUsEmail')}</p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
