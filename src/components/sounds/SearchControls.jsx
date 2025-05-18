import React from 'react';
import { Search } from 'lucide-react'; // Added Search icon import

export default function SearchControls({
  searchTerm,
  language,
  onSearchChange,
  onLanguageChange,
  onSearch
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };
  
  return (
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search sounds..."
            className="w-full h-10 pl-9 pr-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={language}
            onChange={onLanguageChange}
            className="h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/50 backdrop-blur-sm"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="hebrew">Hebrew</option>
            {/* Other languages */}
          </select>
          
          <button
            type="submit"
            className="h-10 px-4 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Search className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
