import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const location = useLocation();

  return (
    <div className={`header ${location.pathname === '/search' ? 'header-search' : ''}`}>
      {!user && (
        <div className="auth-buttons">
          <button className="log-in">Log in</button>
          <button className="sign-up">Sign up</button>
        </div>
      )}
      <div className="header-center">
        {/* Use Link component to navigate to home ("/") when clicked */}
        <Link to="/" className="header-title">Goatel</Link>
      </div>
    </div>
  );
};

export default Header;
