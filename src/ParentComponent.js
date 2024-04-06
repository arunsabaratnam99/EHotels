import React, { useState } from 'react';
import SearchFilters from './SearchFilters';
import Titles from './Titles';

const ParentComponent = () => {
    const [searchParams, setSearchParams] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: '',
        rooms: ''
    });

    const handleSearchParamsChange = (newParams) => {
        setSearchParams(prevParams => ({ ...prevParams, ...newParams }));
    };

    return (
        <div>
            <SearchFilters onSearchParamsChange={handleSearchParamsChange} />
            <Titles searchParams={searchParams} />
        </div>
    );
};

export default ParentComponent;
