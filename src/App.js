import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header/Header';
import BookingBar from './BookingBar/BookingBar';
import HeroSection from './HeroSection/HeroSection';
import SearchResults from './SearchResults';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <BookingBar />
            </>
          } />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
