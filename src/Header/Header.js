import React from 'react';
import { useLocation } from 'react-router-dom';
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
        <div className="header-title">Goatel</div>
      </div>
    </div>
  );
};

export default Header;
