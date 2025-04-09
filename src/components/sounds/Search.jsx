import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Search({ value, onChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative flex items-center gap-3 w-full">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search sounds or hashtags..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 h-12 bg-white/50 backdrop-blur-sm border-none text-lg w-full"
        />
      </div>
      <Button 
        onClick={onSearch} 
        className="bg-purple-600 hover:bg-purple-700 h-12"
      >
        Search
      </Button>
    </div>
  );
}