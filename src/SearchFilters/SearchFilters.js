import React from 'react';
import './SearchFilters.css';

const SearchFilters = () => {
  return (
    <div className="search-section">
      <div className="search-filters">
        <div className="filter-block">
          <h2 className="filter-title">Your Search</h2>
          <div className="filter-input">
            <label htmlFor="destination">Destination</label>
            <input type="text" id="destination" placeholder="Where are you going?" />
          </div>
          <div className="filter-input">
            <label htmlFor="check-in">Check-in Date</label>
            <input type="date" id="check-in" />
          </div>
          <div className="filter-input">
            <label htmlFor="check-out">Check-out Date</label>
            <input type="date" id="check-out" />
          </div>
          <div className="filter-input-group">
            <div className="filter-input half">
              <label htmlFor="rooms">Rooms</label>
              <input type="number" id="rooms" placeholder="Number of rooms" />
            </div>
            <div className="filter-input half">
              <label htmlFor="guests">Guests</label>
              <input type="number" id="guests" placeholder="Number of guests" />
            </div>
          </div>
          <button className="search-button-2">Search</button>
        </div>
        <div className="additional-filters">
          <div className="filter-input">
            <h2 className="filter-subtitle">Hotel chain</h2>
            <select id="hotel-chain">
              {/* Dropdown options */}
            </select>
          </div>
          <div className="filter-input">
            <h2 className="filter-subtitle">Price per night</h2>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="price" value="under50" />
                Under $50
              </label>
              <label>
                <input type="checkbox" name="price" value="50to100" />
                $50 to $100
              </label>
              <label>
                <input type="checkbox" name="price" value="100to150" />
                $100 to $150
              </label>
              <label>
                <input type="checkbox" name="price" value="over150" />
                Over $150
              </label>
            </div>
          </div>
          <div className="filter-input">
            <h2 className="filter-subtitle">Guest Rating</h2>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" name="rating" value="any" />
                Any
              </label>
              <label>
                <input type="checkbox" name="rating" value="excellent" />
                Excellent
              </label>
              <label>
                <input type="checkbox" name="rating" value="veryGood" />
                Very Good
              </label>
              <label>
                <input type="checkbox" name="rating" value="good" />
                Good
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
