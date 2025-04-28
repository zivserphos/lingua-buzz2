import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
