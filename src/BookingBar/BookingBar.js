import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingBar.css'; // Ensure this CSS file is created with the content below

const BookingBar = () => {
  const today = new Date().toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(today);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  // This function calculates the minimum checkout date, which is the day after the check-in date
  const getMinCheckoutDate = () => {
    const checkInDate = new Date(checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1); // Add one day to the check-in date
    return checkInDate.toISOString().split('T')[0];
  };

  const navigate = useNavigate();

  // This useEffect will update the checkOut date whenever the checkIn date changes
  useEffect(() => {
    const minCheckoutDate = getMinCheckoutDate();
    if (new Date(checkIn) >= new Date(checkOut)) {
      setCheckOut(minCheckoutDate);
    }
  }, [checkIn]);

  // This useEffect will update the checkIn date whenever the checkOut date changes
  useEffect(() => {
    if (new Date(checkOut) <= new Date(checkIn)) {
      const newCheckInDate = new Date(checkOut);
      newCheckInDate.setDate(newCheckInDate.getDate() - 1);
      setCheckIn(newCheckInDate.toISOString().split('T')[0]);
    }
  }, [checkOut]);

  const handleSearchClick = () => {
    const searchParams = new URLSearchParams();
    searchParams.append("checkIn", checkIn);
    searchParams.append("checkOut", checkOut);
    searchParams.append("guests", guests);
    searchParams.append("rooms", rooms);
    
    navigate(`/search?${searchParams.toString()}`);
  };
  
  

  return (
    <div className="booking-bar">
      <div className="booking-option">
        <label htmlFor="checkIn" className="booking-label">
          <i className="fas fa-calendar input-icon"></i> Check in
        </label>
        <div className="input-with-icon">
          <input
            type="date"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="booking-input"
            min={today} // Sets the min date to today
          />
        </div>
      </div>

      <div className="booking-option">
        <label htmlFor="checkOut" className="booking-label">
          <i className="fas fa-calendar input-icon"></i> Check out
        </label>
        <div className="input-with-icon">
          <input
            type="date"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="booking-input"
            min={getMinCheckoutDate()} // Calls the function to get the minimum checkout date
          />
        </div>
      </div>

      <div className="booking-option">
        <label htmlFor="guests" className="booking-label">
          <i className="fas fa-user input-icon"></i> Guests
        </label>
        <div className="input-with-icon">
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="booking-input"
            min="1"
          />
        </div>
      </div>

      <div className="booking-option">
        <label htmlFor="rooms" className="booking-label">
          <i className="fas fa-bed input-icon"></i> Rooms
        </label>
        <div className="input-with-icon">
          <input
            type="number"
            id="rooms"
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="booking-input"
            min="1"
          />
        </div>
      </div>

      <button onClick={handleSearchClick} className="search-button">
        <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default BookingBar;
