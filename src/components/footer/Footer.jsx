import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur-sm mt-auto py-4 border-t">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Nav */}
        <div className="flex justify-center mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Features</h3>
              <ul className="space-y-1 text-sm">
                {/* Keep createPageUrl only for sounds - it needs language prefix */}
                <li><Link to={createPageUrl("sounds")} className="text-gray-600 hover:text-purple-600">Sounds</Link></li>
                {/* Direct paths for non-language routes */}
                <li><Link to="/leaderboard" className="text-gray-600 hover:text-purple-600">Leaderboard</Link></li>
                <li><Link to="/savedsounds" className="text-gray-600 hover:text-purple-600">Saved Sounds</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Resources</h3>
              <ul className="space-y-1 text-sm">
                {/* Direct path for blog */}
                <li><Link to="/blog" className="text-gray-600 hover:text-purple-600">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Legal</h3>
              <ul className="space-y-1 text-sm">
                {/* These are already direct paths - good! */}
                <li><Link to="/privacy-policy" className="text-gray-600 hover:text-purple-600">Privacy Policy</Link></li>
                <li><Link to="/terms-of-use" className="text-gray-600 hover:text-purple-600">Terms of Use</Link></li>
                <li><Link to="/disclaimer" className="text-gray-600 hover:text-purple-600">Disclaimer</Link></li>
                <li><Link to="/community-guidelines" className="text-gray-600 hover:text-purple-600">Community Guidelines</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-2 text-xs text-gray-500">
          © {new Date().getFullYear()} Z.S.T. SPIRIT. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
