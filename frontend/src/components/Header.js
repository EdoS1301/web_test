import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, logout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Эффект для скрытия хедера при скролле
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

  // Закрываем dropdown при клике вне его
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
            <h1>Курс по противодействию фишингу</h1>
          </div>
          
          <div className="header-right">
            <div className="user-profile">
              <button 
                className="user-profile-btn"
                onClick={handleProfileClick}
              >
                <div className="user-avatar">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.full_name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <div className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`}>▼</div>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item user-details">
                    <strong>{user.full_name}</strong>
                    <div>{user.department}</div>
                    <div>{user.organization}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    Выйти и войти в другой аккаунт
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
  );
};

export default Header;