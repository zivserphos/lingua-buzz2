import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-sm mt-auto py-4 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center text-sm text-gray-600 gap-x-6">
          <Link to="/privacy-policy" className="hover:text-purple-600 transition">Privacy Policy</Link>
          <Link to="/terms-of-use" className="hover:text-purple-600 transition">Terms of Use</Link>
          <Link to="/disclaimer" className="hover:text-purple-600 transition">Disclaimer</Link>
          <Link to="/community-guidelines" className="hover:text-purple-600 transition">Community Guidelines</Link>
        </div>
        <div className="text-center mt-2 text-xs text-gray-500">
          © {new Date().getFullYear()} Z.S.T. SPIRIT. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
