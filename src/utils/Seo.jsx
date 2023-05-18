import PropTypes from "prop-types";
import { HelmetProvider } from "react-helmet-async";
import React from "react";

import FavIcon from "../pages/images/mainLogo.jpeg";

const Seo = ({ props }) => {
  const { title, description, canonical } = props;

  return (
    <HelmetProvider>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href={FavIcon} type="image/jpeg" />
    </HelmetProvider>
  );
};

Seo.propTypes = {
  props: PropTypes.shape({
    description: PropTypes.string, //Meta description

    title: PropTypes.string, //The title displayed in the tab section at the top of the page
    canonical: PropTypes.string,
  }).isRequired,
};

export default Seo;
