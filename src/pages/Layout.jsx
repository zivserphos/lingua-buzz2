import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import ProfileDialog from "../components/profile/ProfileDialog";
import { Button } from "../components/ui/button";
import { User } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Fetch user data when needed
const fetchUserData = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log("No access token found");
      return;
    }

    const response = await fetch('https://getuserprofile-stbfcg576q-uc.a.run.app', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
    // Fix: Set userData to data.result.data instead of just data.result
    setUserData(data.result.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    setLoading(false);
  }
};

  // Open profile dialog and fetch user data
  const handleOpenProfile = () => {
    fetchUserData();
    setProfileOpen(true);
  };

  // Handle profile update
  const handleProfileUpdated = () => {
    // Refetch user data to update the UI
    fetchUserData();
  };

return (
  <div className="min-h-screen flex flex-col">
    {/* Comment out the header section below */}
    {/*
    <header className="bg-white shadow-sm p-3 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-purple-600">
          LinguaBuzz
        </Link>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleOpenProfile}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        Profile
      </Button>
    </header>
    */}

    {/* Main content */}
    <div className="flex-grow">
      {children}
    </div>
    
    {/* Profile Dialog */}
    <ProfileDialog 
      open={profileOpen}
      onOpenChange={setProfileOpen}
      userData={userData}
      onProfileUpdated={handleProfileUpdated}
    />
    
    <Footer />
  </div>
);
}
