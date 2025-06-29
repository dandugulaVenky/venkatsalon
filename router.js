import React from "react";
import { Routes, Route } from "react-router-dom";

export default (
  <Routes>
    <Route path="/" />
    <Route path="/shops" />
    <Route path="/shop/:id" />
    <Route path="/login" />

    <Route path="/history" />

    <Route path="/register" />
    <Route path="/payment-success" />
    <Route path="/privacy-policy" />
    <Route path="/terms-and-conditions" />
    <Route path="/about-us" />
    <Route path="/contact-us" />
  </Routes>
);
