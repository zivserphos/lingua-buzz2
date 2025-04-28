import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PolicyPage() {
  const location = useLocation();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  
  useEffect(() => {
    // Extract policy type from the URL path
    const path = location.pathname.substring(1); // Remove leading slash
    console.log("Current path:", path);
    
    let policyFile = "";
    let policyTitle = "";
    
    // Map current path to file and title
    switch (path) {
      case "privacy-policy":
        policyFile = "/policies/privacy_policy.txt";
        policyTitle = "Privacy Policy";
        break;
      case "terms-of-use":
        policyFile = "/policies/terms_of_use.txt";
        policyTitle = "Terms of Use";
        break;
      case "disclaimer":
        policyFile = "/policies/disclaimer.txt";
        policyTitle = "Disclaimer";
        break;
      case "community-guidelines":
        policyFile = "/policies/community_guidelines.txt";
        policyTitle = "Community Guidelines";
        break;
      default:
        policyTitle = "Not Found";
    } 
    
    setTitle(policyTitle);
    
    // Fetch the policy file content
    if (policyFile) {
      fetch(policyFile)
        .then(response => response.text())
        .then(data => {
          // Format content by preserving paragraphs
          const formattedContent = data.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ));
          setContent(formattedContent);
        })
        .catch(error => {
          console.error("Error loading policy:", error);
          setContent(<p>Error loading content. Please try again later.</p>);
        });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        
        <div className="prose max-w-none text-gray-700">
          {content}
        </div>
      </div>
    </div>
  );
}
