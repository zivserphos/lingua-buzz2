import React from "react";
import Search from "./Search";
import LanguageSelector from "./LanguageSelector";

export default function SearchControls({ 
  searchTerm, 
  language, 
  onSearchChange, 
  onLanguageChange, 
  onSearch 
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Search 
          value={searchTerm}
          onChange={onSearchChange}
          onSearch={onSearch}
        />
      </div>
      
      <LanguageSelector 
        currentLanguage={language}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
}
