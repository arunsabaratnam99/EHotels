import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchFilters.css';

const SearchFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || '');
    const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || '');
    const [guests, setGuests] = useState(searchParams.get("guests") || '');
    const [rooms, setRooms] = useState(searchParams.get("rooms") || '');
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedPrices.length) params.append("price", selectedPrices.join(','));
        if (selectedRatings.length) params.append("rating", selectedRatings.join(','));
        setSearchParams(params);
    }, [selectedPrices, selectedRatings, setSearchParams]);

    const handleSearchClick = () => {
      const searchParams = new URLSearchParams();
      if (destination) searchParams.append("destination", destination);
      if (checkIn) searchParams.append("checkIn", checkIn);
      if (checkOut) searchParams.append("checkOut", checkOut);
      if (guests) searchParams.append("guests", guests);
      if (rooms) searchParams.append("rooms", rooms);
      selectedPrices.forEach(price => searchParams.append("price", price));
      selectedRatings.forEach(rating => searchParams.append("rating", rating));

    };

    return (
        <>
            <div className="search-section-wrapper">
                <h2 className="search-title">Your Search</h2>
                <div className="search-input">
                    <label htmlFor="destination">Destination</label>
                    <input type="text" id="destination" value = {destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where are you going?" />
                </div>
                <div className="search-input">
                    <label htmlFor="check-in">Check-in Date</label>
                    <input type="date" id="check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="search-input">
                    <label htmlFor="check-out">Check-out Date</label>
                    <input type="date" id="check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
                <div className="search-input-group">
                    <div className="search-input half">
                        <label htmlFor="rooms">Rooms</label>
                        <input type="number" id="rooms" placeholder="# of rooms" value={rooms} onChange={(e) => setRooms(e.target.value)} />
                    </div>
                    <div className="search-input half">
                        <label htmlFor="guests">Guests</label>
                        <input type="number" id="guests" placeholder="# of guests" value={guests} onChange={(e) => setGuests(e.target.value)} />
                    </div>
                </div>
                <button className="search-button-2" onClick={handleSearchClick}>Search</button>
            </div>

            <div className="filter-section-wrapper">
                <div className="filter-input">
                    <h2 className="filter-title">Hotel chain</h2>
                    <select id="hotel-chain">
                        {/* Dropdown options */}
                    </select>
                </div>
                <div className="filter-input">
                    <h2 className="filter-title">Price per night</h2>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" name="price" value="under150" onChange={() => setSelectedPrices(prev => prev.includes('under50') ? prev.filter(p => p !== 'under50') : [...prev, 'under50'])} checked={selectedPrices.includes('under50')} />
                            Under $150
                        </label>
                        <label>
                            <input type="checkbox" name="price" value="150to250" onChange={() => setSelectedPrices(prev => prev.includes('50to100') ? prev.filter(p => p !== '50to100') : [...prev, '50to100'])} checked={selectedPrices.includes('50to100')} />
                            $150 to $250
                        </label>
                        <label>
                            <input type="checkbox" name="price" value="250to350" onChange={() => setSelectedPrices(prev => prev.includes('100to150') ? prev.filter(p => p !== '100to150') : [...prev, '100to150'])} checked={selectedPrices.includes('100to150')} />
                            $250 to $350
                        </label>
                        <label>
                            <input type="checkbox" name="price" value="over350" onChange={() => setSelectedPrices(prev => prev.includes('over150') ? prev.filter(p => p !== 'over150') : [...prev, 'over150'])} checked={selectedPrices.includes('over150')} />
                            Over $350
                        </label>
                    </div>
                </div>
                <div className="filter-input">
                    <h2 className="filter-title">Star Rating</h2>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" name="rating" value="any" onChange={() => setSelectedRatings(prev => prev.includes('any') ? prev.filter(r => r !== 'any') : [...prev, 'any'])} checked={selectedRatings.includes('any')} />
                            Any
                        </label>
                        <label>
                            <input type="checkbox" name="rating" value="excellent" onChange={() => setSelectedRatings(prev => prev.includes('excellent') ? prev.filter(r => r !== 'excellent') : [...prev, 'excellent'])} checked={selectedRatings.includes('excellent')} />
                            5 Star
                        </label>
                        <label>
                            <input type="checkbox" name="rating" value="veryGood" onChange={() => setSelectedRatings(prev => prev.includes('veryGood') ? prev.filter(r => r !== 'veryGood') : [...prev, 'veryGood'])} checked={selectedRatings.includes('veryGood')} />
                            4 Star
                        </label>
                        <label>
                            <input type="checkbox" name="rating" value="good" onChange={() => setSelectedRatings(prev => prev.includes('good') ? prev.filter(r => r !== 'good') : [...prev, 'good'])} checked={selectedRatings.includes('good')} />
                            3 Star
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchFilters;
