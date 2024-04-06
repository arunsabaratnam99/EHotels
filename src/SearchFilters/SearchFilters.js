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
    const [selectedRatings, setSelectedRatings] = useState(['any']);
    const [hotelChains, setHotelChains] = useState([]);
    const [selectedHotelChain, setSelectedHotelChain] = useState('any');

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedPrices.length) params.append("price", selectedPrices.join(','));
        if (selectedRatings.length) params.append("rating", selectedRatings.join(','));
        setSearchParams(params);

        const fetchHotelChains = async () => {
            const response = await fetch('http://localhost:3001/get-all-hotelchains');
            const data = await response.json();
            setHotelChains(data.rows); // Assuming the data comes in a property named 'rows'
        };

        fetchHotelChains();

    }, [selectedPrices, selectedRatings, setSearchParams]);

    const handleSearchClick = async () => {
        // Perform validation
     if (new Date(checkIn) >= new Date(checkOut)) {
        alert('Check-in date must be before check-out date.');
        return;
      }   

      const searchParams = new URLSearchParams();
      if (destination) searchParams.append("destination", destination);
      if (checkIn) searchParams.append("checkIn", checkIn);
      if (checkOut) searchParams.append("checkOut", checkOut);
      if (guests) searchParams.append("guests", guests);
      if (rooms) searchParams.append("rooms", rooms);
      if (selectedHotelChain) searchParams.append("hotelChain", selectedHotelChain);
      selectedPrices.forEach(price => searchParams.append("price", price));
      selectedRatings.forEach(rating => searchParams.append("rating", rating));

      //output the search parameters to the console without using searchParams.toString()
      console.log('Search Filters:', {
        destination,
        checkIn,
        checkOut,
        guests,
        rooms,
        selectedHotelChain,
        selectedPrices,
        selectedRatings
      });

      const queryString = searchParams.toString();
      try {
          const response = await fetch(`http://localhost:3001/search-rooms?${queryString}`);
          const data = await response.json();
          console.log(data); // do something with the data, e.g., display it
      } catch (error) {
          console.error('Error searching hotels:', error);
      }
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
                    <input type="date" id="check-in" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="search-input">
                    <label htmlFor="check-out">Check-out Date</label>
                    <input type="date" id="check-out" value={checkOut} min={checkIn ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1)).toISOString().split('T')[0] : ''} onChange={(e) => setCheckOut(e.target.value)} />
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
                    <select id="hotel-chain" value = {selectedHotelChain} onChange = {(e) => setSelectedHotelChain(e.target.value)}>
                        <option value="any">Any</option>
                        {hotelChains.map(chain => (
                            <option key={chain.ChainID} value={chain.ChainID}>
                                {chain.Name} 
                            </option>
                        ))}
                    
                    </select>
                </div>
                <div className="filter-input">
                    <h2 className="filter-title">Price per night</h2>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" name="price" value="under150" onChange={() => setSelectedPrices(prev => prev.includes('under150') ? prev.filter(p => p !== 'under150') : [...prev, 'under150'])} checked={selectedPrices.includes('under150')} />
                            Under $150
                        </label>
                        <label>
                            <input type="checkbox" name="price" value="150to250" onChange={() => setSelectedPrices(prev => prev.includes('150to250') ? prev.filter(p => p !== '150to250') : [...prev, '150to250'])} checked={selectedPrices.includes('150to250')} />
                            $150 to $250
                        </label>
                        <label>
                            <input type="checkbox" name="price" value="250to350" onChange={() => setSelectedPrices(prev => prev.includes('250to350') ? prev.filter(p => p !== '250to350') : [...prev, '250to350'])} checked={selectedPrices.includes('250to350')} />
                            $250 to $350
                        </label>
                        <label>
                            <input type="checkbox" name="price" value="over350" onChange={() => setSelectedPrices(prev => prev.includes('over350') ? prev.filter(p => p !== 'over350') : [...prev, 'over350'])} checked={selectedPrices.includes('over350')} />
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
                            <input type="checkbox" name="rating" value="5" onChange={() => setSelectedRatings(prev => prev.includes('5') ? prev.filter(r => r !== '5') : [...prev, '5'])} checked={selectedRatings.includes('5')} />
                            5 Star
                        </label>
                        <label>
                            <input type="checkbox" name="rating" value="4" onChange={() => setSelectedRatings(prev => prev.includes('4') ? prev.filter(r => r !== '4') : [...prev, '4'])} checked={selectedRatings.includes('4')} />
                            4 Star
                        </label>
                        <label>
                            <input type="checkbox" name="rating" value="3" onChange={() => setSelectedRatings(prev => prev.includes('3') ? prev.filter(r => r !== '3') : [...prev, '3'])} checked={selectedRatings.includes('3')} />
                            3 Star
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchFilters;
