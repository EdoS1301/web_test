import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, не принял ли уже пользователь cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      // Показываем баннер с небольшой задержкой для лучшего UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <h4>🍪 Мы используем файлы cookie</h4>
          <p>
            Этот сайт использует cookies для обеспечения корректной работы и улучшения вашего опыта. 
            Cookies помогают нам запоминать ваши настройки и обеспечивать безопасность.
          </p>
        </div>
        <div className="cookie-consent-buttons">
          <button 
            onClick={declineCookies}
            className="cookie-consent-button decline"
          >
            Отклонить
          </button>
          <button 
            onClick={acceptCookies}
            className="cookie-consent-button accept"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;