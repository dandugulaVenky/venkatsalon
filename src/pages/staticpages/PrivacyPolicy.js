import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Greeting from "../../components/navbar/Greeting";
import Layout from "../../components/navbar/Layout";
import MobileNav from "../../components/navbar/MobileNav";
import Sidebar from "../../components/navbar/SIdebar";
import { SearchContext } from "../../context/SearchContext";
import Seo from "../../utils/Seo";

const siteMetadata = {
  title: "Ensuring User Privacy: SEO Privacy Policy",
  description:
    "Learn how we collect, use, and protect personal information to ensure a secure and transparent online experience. Discover our data handling practices, cookie usage, and user rights to empower you with control over your privacy.",
  canonical: "https://easytym.com/privacy-policy",
};

const PrivacyPolicy = () => {
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
      <div className="min-h-screen flex flex-col justify-start items-start md:px-20 px-14 overflow-auto space-y-2 pt-5 pb-32">
        <h1 className="text-2xl font-bold mb-5 mt-5">EasyTym Privacy Policy</h1>

        <p>
          At EasyTym, we take your privacy seriously and are committed to
          protecting your personal information. This privacy policy outlines the
          types of information we collect and how it is used and protected. By
          using our website, easytym.com, you are accepting the practices
          described in this policy.
        </p>

        <h2 className="font-bold">Information Collection and Use:</h2>
        <ul className="list-disc">
          <li>
            <p>
              We collect information from our users in several different ways,
              including:
            </p>
            <ul className="list-disc">
              <li>Information provided by users when creating an account</li>
              <li>
                Information provided by users when placing an order or making a
                purchase
              </li>
              <li>
                Information provided by users when subscribing to our newsletter
              </li>
              <li>
                Information automatically collected through the use of cookies
                and other technologies
              </li>
            </ul>
          </li>
          <li>
            <p>The information collected may include:</p>
            <ul className="list-disc">
              <li>
                Contact information, such as name, email address, and postal
                address
              </li>
              <li>
                Financial information, such as credit card numbers and billing
                information
              </li>
              <li>
                Demographic information, such as age, gender, and interests
              </li>
              <li>
                Information about user activity on our website, such as the
                pages visited and the actions taken
              </li>
            </ul>
          </li>
          <li>
            <p>We use the information collected for the following purposes:</p>
            <ul className="list-disc">
              <li>To personalize the user experience on our website</li>
              <li>To process and fulfill orders and transactions</li>
              <li>To send promotional emails and newsletters</li>
              <li>To improve the quality of our services and website</li>
            </ul>
          </li>
        </ul>

        <h2 className="font-bold">Information Sharing and Disclosure:</h2>
        <ul className="list-disc">
          <li>
            <p>
              We may share your information with third-party service providers
              who perform services on our behalf, such as processing payments
              and fulfilling orders. These service providers are bound by
              confidentiality agreements and are only permitted to use your
              information in accordance with our instructions.
            </p>
          </li>
          <li>
            <p>
              We may also disclose your information as required by law or in
              response to a subpoena, court order, or other legal process. We
              may also disclose your information in the good faith belief that
              such action is necessary to protect the safety of our users,
              employees, or the public.
            </p>
          </li>
        </ul>

        <h2 className="font-bold">Data Security:</h2>
        <ul className="list-disc">
          <li>
            <p>
              We take appropriate security measures to protect against
              unauthorized access to or unauthorized alteration, disclosure, or
              destruction of data. These measures include internal reviews of
              our data collection, storage, and processing practices, as well as
              physical security measures to guard against unauthorized access to
              our systems.
            </p>
          </li>
          <li>
            <p>
              Unfortunately, no data transmission over the Internet or any
              wireless network can be guaranteed to be 100% secure. As a result,
              while we strive to protect your personal information, we cannot
              guarantee its security, and you transmit such information at your
              own risk.
            </p>
          </li>
        </ul>

        <h2 className="font-bold">Data Retention:</h2>
        <ul className="list-disc">
          <li>
            <p>
              We will retain your information for as long as your account is
              active or as needed to provide you with our services. We will also
              retain and use your information as necessary to comply with our
              legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </li>
        </ul>

        <h2 className="font-bold">Changes to this Privacy Policy:</h2>
        <ul className="list-disc">
          <li>
            <p>
              We may update this privacy policy from time to time, and we will
              post any changes on this page. If we make any material changes to
              this policy, we will notify you by email or through a notice on
              our website. Your continued use of our services following any such
              changes constitutes your acceptance of the new terms.
            </p>
          </li>
        </ul>

        <h2 className="font-bold">Contact Information:</h2>
        <ul className="list-disc">
          <li>
            <p>
              If you have any questions or concerns about this privacy policy,
              please contact us at:
            </p>
            <ul className="list-disc">
              <li>Email: rajeshchitikala888@gmail.com</li>
            </ul>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
