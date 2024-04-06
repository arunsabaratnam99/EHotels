import React from 'react';

const Chip = ({ label, onBook, onClose }) => {
  return (
    <div className="chip">
      <span>{label}</span>
      <button onClick={onBook}>Book</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Chip;
