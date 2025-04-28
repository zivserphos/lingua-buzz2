import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { SUPPORTED_LANGUAGES } from '../../pages/index';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  const location = useLocation();
  const manualChangeRef = useRef(false);
  const isInitialRender = useRef(true);
  
  // Check URL on mount and on path changes
  useEffect(() => {
    if (manualChangeRef.current) {
      return; // Skip if this was triggered by manual selection
    }
    
    // Always process URL on first render
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const urlLanguageLower = pathParts[0].toLowerCase();
      
      const matchedLang = SUPPORTED_LANGUAGES.find(
        lang => lang.code.toLowerCase() === urlLanguageLower
      );
      
      if (matchedLang?.code && matchedLang.code !== currentLanguage) {
        console.log(`📍 URL navigation detected: ${matchedLang.code}`);
        onLanguageChange(matchedLang.code);
      }
    }
    
    isInitialRender.current = false;
  }, [location.pathname, currentLanguage, onLanguageChange]);
  
  // Handle manual selection from dropdown
  const handleValueChange = (newLanguage) => {
    if (newLanguage === currentLanguage) return;
    
    console.log(`🖱️ Manual language selection: ${newLanguage}`);
    manualChangeRef.current = true;
    
    onLanguageChange(newLanguage);
    
    setTimeout(() => {
      manualChangeRef.current = false;
    }, 1000); // Longer timeout for safety
  };
  
  return (
    <Select value={currentLanguage} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
        <SelectValue>
          {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.flag} {currentLanguage}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.code}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
