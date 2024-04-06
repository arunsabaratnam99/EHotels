import React, { useState } from 'react';
import Chip from './Search Page/Chip'; // Update the import path if necessary
import SearchFilters from './SearchFilters/SearchFilters'; // Update the import path if necessary

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showChips, setShowChips] = useState(false);

  const handleSearch = (searchData) => {
    // Perform the search and update searchResults state
    setSearchResults(searchData);
    setShowChips(true);
  };

  const handleChipClose = () => {
    setShowChips(false);
  };

  const handleBook = () => {
    // Implement booking logic here
    console.log('Book button clicked!');
  };

  return (
    <div className="search-results-page">
      <SearchFilters onSearch={handleSearch} />
      {showChips && (
        <div className="chips-container">
          {/* Assuming searchResults is an array of labels */}
          {searchResults.map((label, index) => (
            <Chip key={index} label={label} onBook={handleBook} onClose={handleChipClose} />
          ))}
        </div>
      )}
      {/* Rest of the search results page content */}
    </div>
  );
};

export default SearchResultsPage;
