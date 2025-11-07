import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header = ({ user, logout, onTocToggle, isTocOpen }) => {
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
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-container">
                <img 
                  src={logo} 
                  alt="Delo Logo" 
                  className="header-logo"
                />
              </div>
              <h1 className="header-title">Курс по противодействию фишингу</h1>
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
                    <div className="dropdown-item user-details">
                      <strong>{user.email}</strong>
                      <div>Государственное учреждение</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item stats-btn"
                      onClick={handleStatsClick}
                    >
                      <span className="stats-icon">📊</span>
                      <span className="stats-text">Моя статистика</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <span className="logout-text">Выйти и войти в другой аккаунт</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="navigation">
            <Link to="/main" className="nav-link">Теория</Link>
            <Link to="/quiz" className="nav-link">Пройти тест</Link>
          </nav>
        </div>
      </header>

      {/* Кнопка оглавления - отдельный фиксированный элемент */}
      <div className={`toc-button ${isTocOpen ? 'open' : ''} ${isScrolled ? 'scrolled' : ''}`} onClick={onTocToggle}>
        <span className="toc-icon">📚</span>
        <span className="toc-text">Оглавление</span>
      </div>
    </>
  );
};

export default Header;