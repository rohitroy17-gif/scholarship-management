// src/Root.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Root = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh]">
        <Outlet /> {/* Renders Home, Login, Register, etc. */}
      </main>
      <Footer />
    </>
  );
};

export default Root;






