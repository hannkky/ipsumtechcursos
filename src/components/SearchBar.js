// src/components/SearchBar.js

import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearch}
      className="border rounded-lg px-4 py-2 w-1/3"
    />
  );
};

export default SearchBar;
