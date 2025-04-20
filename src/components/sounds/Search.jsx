import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Search({ value, onChange, onSearch }) {
  const [inputValue, setInputValue] = useState(value || "");
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onChange(inputValue);
      onSearch();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    onChange(inputValue);
    onSearch();
  };
  
  const handleClear = () => {
    setInputValue("");
    onChange("");
    onSearch();
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button 
        onClick={handleSearchClick}
        className="bg-purple-600 hover:bg-purple-700 h-12"
      >
        Search
      </Button>
    </div>
  );
}