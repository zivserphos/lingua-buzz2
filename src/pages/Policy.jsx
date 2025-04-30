import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function PolicyPage() {
  const location = useLocation();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  
  // Get language for meta tags
  const userLanguage = localStorage.getItem('selected_language') || 'English';
  const langCode = userLanguage.substring(0, 2).toLowerCase();
  
  // Base URL for canonical links
  const baseUrl = "https://brainrot-memes.com";
  const canonicalUrl = `${baseUrl}${location.pathname}`;
  
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
      <Helmet>
        <title>{title} | Brainrot Memes</title>
        <meta 
          name="description" 
          content={`${title} for Brainrot Memes website. Learn about our policies and guidelines.`} 
        />
        <meta name="keywords" content="privacy policy, terms of service, legal, guidelines, brainrot memes" />
        <meta name="robots" content="noindex, follow" />
        <html lang={langCode} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={`${title} | Brainrot Memes`} />
        <meta property="og:description" content={`${title} for Brainrot Memes website. Learn about our policies and guidelines.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Brainrot Memes" />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${title} | Brainrot Memes`} />
        <meta name="twitter:description" content={`${title} for Brainrot Memes website. Learn about our policies and guidelines.`} />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${title} | Brainrot Memes`,
            "description": `${title} for Brainrot Memes website. Learn about our policies and guidelines.`,
            "url": canonicalUrl,
            "inLanguage": langCode
          })}
        </script>
      </Helmet>
      
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <Link to={createPageUrl("sounds")}>
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
