import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header = ({ user, logout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
      
      // Показываем кнопку "Наверх" когда проскроллили 30% страницы
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      setShowScrollTop(scrollPercentage > 30);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

      {/* Кнопка "Наверх" */}
      <button 
        className={`scroll-top-button ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Вернуться наверх"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20L12 4M12 4L5 11M12 4L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
};

export default Header;