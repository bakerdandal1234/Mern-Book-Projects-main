import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeConext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const isLight = theme === 'light';

  const headerStyle = {
    backgroundColor: isLight ? '#ffffff' : '#333333',
    color: isLight ? '#000000' : '#ffffff',
    padding: '15px 30px',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ccc',
    // marginBottom: '3px',
  };

  const buttonStyle = {
    padding: '8px 14px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',
  };

  const primaryStyle = {
    ...buttonStyle,
    backgroundColor: '#007BFF',
    color: '#fff',
  };

  const logoutStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: '#fff',
  };

  const toggleStyle = {
    ...buttonStyle,
    backgroundColor: isLight ? '#f0f0f0' : '#555',
    color: isLight ? '#000' : '#fff',
    border: '1px solid #ccc',
  };

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0 }}>baker dandal</h1>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={toggleTheme} style={toggleStyle}>
          Toggle {isLight ? 'Dark' : 'Light'} Mode
        </button>

        {user ? (
          <>
            <Link to="/dashboard" style={primaryStyle}>
              Dashboard
            </Link>
            <button onClick={handleLogout} style={logoutStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" style={primaryStyle}>
              Signup
            </Link>
            <Link to="/login" style={primaryStyle}>
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
