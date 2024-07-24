import React, { useContext, useEffect } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import baseUrl from "../utils/client";
import { useTranslation } from "react-i18next";
import axiosInstance from "../components/axiosInterceptor";

export default function Profile() {
  //   const { data: session } = useSession();
  const { user, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    setValue("name", user?.username);
    setValue("email", user?.email);
  }, [user, setValue]);

  const submitHandler = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      return toast("Enter full details!");
    }
    try {
      let res = await axiosInstance.put(`${baseUrl}/api/users/${user._id}`, {
        username: name.toLowerCase(),

        password,
        email: email.toLowerCase(),
      });

      if (res.error) {
        toast.error(res.error);
      }
      toast.success("Profile updated successfully");
      localStorage.removeItem("user");

      dispatch({ type: "LOGIN_START" });
      try {
        const res = await axiosInstance.post(`${baseUrl}/api/auth/login`, {
          username: name,
          password,
        });
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      }
    } catch (err) {
      toast.error(
        err.response.data.message.includes(
          "E11000 duplicate key error collection: booking.users index: username_1 dup key: "
        )
          ? "Try using different username "
          : "Try using different email "
      );
      !err.response.data.message.includes(" email_1 dup key") ||
        (err.response.data.message.includes(" username_1 dup key") &&
          navigate("/login", { state: { destination: `/profile` } }));
    }
  };

  return (
    <div className="pt-6 pb-20">
      <div className="px-8 md:min-h-[75.5vh] md:flex justify-center ">
        <form
          className="px-10 py-4 card h-auto "
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-2xl font-semibold">{t("updateProfile")}</h1>

          <div className="mb-4">
            <label htmlFor="name">{t("name")}</label>
            <input
              type="text"
              className="w-full"
              id="name"
              autoFocus
              {...register("name", {
                required: "Please enter name",
              })}
            />
            {errors.name && (
              <div className="text-red-500">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email">{t("emailTitle")}</label>
            <input
              type="email"
              className="w-full"
              id="email"
              {...register("email", {
                required: "Please enter email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Please enter valid email",
                },
              })}
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password">{t("password")}</label>
            <input
              className="w-full"
              type="password"
              id="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "password must be more than 5 chars",
                },
              })}
            />
            {errors.password && (
              <div className="text-red-500 ">{errors.password.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
            <input
              className="w-full"
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                validate: (value) => value === getValues("password"),
                minLength: {
                  value: 6,
                  message: "confirm password must be more than 5 chars",
                },
              })}
            />
            {errors.confirmPassword && (
              <div className="text-red-500 ">
                {errors.confirmPassword.message}
              </div>
            )}
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" && (
                <div className="text-red-500 ">{t("passwordDoNotMatch")}</div>
              )}
          </div>
          <div className="mb-4">
            <button className="primary-button">{t("updateProfile")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
