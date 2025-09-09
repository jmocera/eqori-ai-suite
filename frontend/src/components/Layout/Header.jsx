import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Eqori AI
        </Link>

        {isAuthenticated && (
          <nav>
            <ul className="nav-links">
              <li><Link to="/dashboard">Generate</Link></li>
              <li><Link to="/history">History</Link></li>
            </ul>
          </nav>
        )}

        <div className="user-actions">
          {isAuthenticated ? (
            <>
              <span>Hello, {user?.email}</span>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;