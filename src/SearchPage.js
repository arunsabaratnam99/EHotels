import React, { useState } from 'react';
import Chip from './Search Page/Chip';

const SearchPage = () => {
  const [showChip, setShowChip] = useState(false);

  const handleSearch = () => {
    // Perform the search and update showChip state to true
    setShowChip(true);
  };

  const handleChipClose = () => {
    setShowChip(false);
  };

  const handleBook = () => {
    // Implement booking logic here
    console.log('Book button clicked!');
  };

  return (
    <div>
      {showChip && (
        <Chip label="Your Search" onBook={handleBook} onClose={handleChipClose} />
      )}
      {/* Rest of the search page content */}
    </div>
  );
};

export default SearchPage;
