import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Search({ value, onChange, onSearch }) {
  // Local state for controlled input
  const [inputValue, setInputValue] = useState(value || "");
  
  // Keep local state in sync when parent value changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || "");
    }
  }, [value]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      onChange(inputValue); // Update parent state first
      onSearch(); // Then trigger search
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update parent's searchTerm state
    onChange(newValue);
    
    // Don't trigger search here - let debounce handle it
    // This improves performance during typing
  };

  const handleSearchClick = () => {
    onChange(inputValue); // Ensure parent state is updated
    onSearch(); // Explicitly trigger search
  };
  
  const handleClear = () => {
    setInputValue(""); // Clear local state
    onChange(""); // Clear parent state
    
    // Small delay to ensure state updates before search
    setTimeout(() => {
      onSearch(); // Then trigger search with empty string
    }, 0);
  };

  return (
    <div className="relative flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search sounds or hashtags..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-12 bg-white/50 backdrop-blur-sm border-none text-lg w-full"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button 
        onClick={handleSearchClick}
        type="button"
        className="bg-purple-600 hover:bg-purple-700 h-12"
      >
        Search
      </Button>
    </div>
  );
}
