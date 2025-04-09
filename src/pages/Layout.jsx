
import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
