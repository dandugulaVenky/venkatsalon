import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Greeting from "../../components/navbar/Greeting";
import Layout from "../../components/navbar/Layout";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";

const siteMetadata = {
  title: "Discover EasyTym | Know About Us",
  description:
    "Join EasyTym today and experience a new level of convenience and efficiency in scheduling your self-care needs.",
  canonical: "https://easytym.com/about-us",
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  let w = window.innerWidth;
  const { open } = useContext(SearchContext);

  return (
    <>
      {open && <Sidebar />}
      {w >= 768 && <Layout />}
      {w < 768 && <Greeting />}

      <Seo props={siteMetadata} />

      <div className="py-10 px-20 flex flex-col space-y-3 justify-center">
        <div>
          <h1 className="text-2xl font-bold">Introduction</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            Welcome to EasyTym, your go-to platform for effortless appointment
            scheduling. We're on a mission to simplify and streamline the
            process of booking appointments for hair salons, beauty parlors, and
            ironing services. Learn more about us and how we're revolutionizing
            the way you manage your appointments.
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Our Commitment to Convenience</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            At EasyTym, we understand the challenges of finding time for
            self-care. That's why we're dedicated to providing you with a
            convenient and user-friendly platform. With just a few clicks, you
            can schedule your appointments, saving you time and eliminating the
            hassle of phone calls and lengthy wait times.
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Extensive Service Network</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            We take pride in our extensive network of trusted and skilled
            professionals in the beauty and grooming industry. Through EasyTym,
            you gain access to a wide range of service providers, each carefully
            vetted for their expertise and customer satisfaction. Discover new
            salons, explore popular parlors, and find reliable ironing
            services—all in one place.
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Seamless Booking Experience</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            Gone are the days of juggling calendars and playing phone tag.
            EasyTym offers a seamless booking experience that puts you in
            control. Our user-friendly interface allows you to search, select,
            and book appointments based on your preferences and availability.
            Say goodbye to appointment conflicts and hello to hassle-free
            scheduling.
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Empowering Your Choices</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            At EasyTym, we believe in empowering your choices. That's why we
            provide you with comprehensive information about service providers,
            including customer reviews, ratings, and service details. We want
            you to make informed decisions that align with your preferences and
            needs, ensuring a personalized and satisfactory experience.
          </p>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Commitment to Excellence</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            We are committed to excellence in every aspect of our platform. From
            the moment you visit EasyTym to the completion of your appointment,
            we strive to deliver a seamless and exceptional service. Your
            satisfaction is our priority, and we continuously work to enhance
            your experience and exceed your expectations.
          </p>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Conclusion</h1>
          <p className="text-sm md:text-[15px] leading-6 ">
            EasyTym is your reliable partner in simplifying appointment
            scheduling for hair salons, beauty parlors, and ironing services.
            With our commitment to convenience, extensive service network,
            seamless booking experience, and dedication to excellence, we aim to
            revolutionize the way you manage your appointments. Join EasyTym
            today and experience a new level of convenience and efficiency in
            scheduling your self-care needs.
          </p>
        </div>
        <p>Address : Thimmapur, Rangareddy,H.No: 9-101, Hyderabad 509325 </p>
        <p>Call Us : +91 8919788492 </p>
        <p>Email : rajeshchitikala888@gmail.com</p>
      </div>
      <Footer />
    </>
  );
};

export default About;
