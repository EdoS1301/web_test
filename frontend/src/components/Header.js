import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header = ({ user, logout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStatsClick = () => {
    setShowDropdown(false);
    navigate('/stats');
  };

  const handleLogoClick = () => {
    navigate('/main');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-profile')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
              <img 
                src={logo} 
                alt="Delo Logo" 
                className="header-logo"
              />
            </div>
            <h1 className="header-title" onClick={handleLogoClick} style={{cursor: 'pointer'}}>
              Курсы по кибербезопасности
            </h1>
          </div>
          
          <div className="header-right">
            <div className="user-profile">
              <button 
                className="user-profile-btn"
                onClick={handleProfileClick}
              >
                <div className="user-avatar">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.email}</div>
                </div>
                <div className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`}>▼</div>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item stats-btn"
                    onClick={handleStatsClick}
                    style={{height: '48px', display: 'flex', alignItems: 'center'}}
                  >
                    <span className="stats-icon">📊</span>
                    <span className="stats-text">Моя статистика</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                    style={{height: '48px', display: 'flex', alignItems: 'center'}}
                  >
                    <span className="logout-text">Выйти и войти в другой аккаунт</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;