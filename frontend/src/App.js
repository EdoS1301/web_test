import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import PhishCourse from './components/PhishCourse';
import QuizPage from './components/QuizPage';
import StatsPage from './components/StatsPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import ConsentForm from './components/ConsentForm';
import PhishingExample from './components/PhishingExample';
import CookieConsent from './components/CookieConsent';
import CryptoCourse from './components/CryptoCourse';
import CryptoQuiz from './components/CryptoQuiz';
import NotFoundPage from './components/NotFoundPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <div className="app">
          {/* Базовые мета-теги для всех страниц */}
          <Helmet>
            <link rel="icon" href="/images/logo.png" type="image/png" />
            <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
            <link rel="apple-touch-icon" href="/images/logo.png" />
            <meta name="theme-color" content="#000000" />
          </Helmet>

          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Helmet>
                    <title>Вход | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <Navigate to="/main" replace /> : <LoginPage />}
                </>
              } 
            />
            <Route 
              path="/main" 
              element={
                <>
                  <Helmet>
                    <title>Главная | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <MainPage user={user} logout={logout} /> : <Navigate to="/" replace />}
                </>
              } 
            />
            <Route 
              path="/phish-course" 
              element={
                <>
                  <Helmet>
                    <title>Противодействие фишингу | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <PhishCourse user={user} logout={logout} /> : <Navigate to="/" replace />}
                </>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <>
                  <Helmet>
                    <title>Тест по фишингу | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <QuizPage user={user} logout={logout} /> : <Navigate to="/" replace />}
                </>
              } 
            />
            <Route 
              path="/stats" 
              element={
                <>
                  <Helmet>
                    <title>Моя статистика | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <StatsPage user={user} logout={logout} /> : <Navigate to="/" replace />}
                </>
              } 
            />
            <Route 
              path="/privacy-policy" 
              element={
                <>
                  <Helmet>
                    <title>Политика конфиденциальности | Курсы по кибербезопасности</title>
                  </Helmet>
                  <PrivacyPolicy user={user} logout={logout} />
                </>
              } 
            />
            <Route 
              path="/consent-form" 
              element={
                <>
                  <Helmet>
                    <title>Согласие на обработку данных | Курсы по кибербезопасности</title>
                  </Helmet>
                  <ConsentForm user={user} logout={logout} />
                </>
              } 
            />
            <Route 
              path="/phishing-example" 
              element={
                <>
                  <Helmet>
                    <title>Пример фишинга | Курсы по кибербезопасности</title>
                  </Helmet>
                  <PhishingExample />
                </>
              } 
            />
            <Route 
              path="/crypto-course" 
              element={
                <>
                  <Helmet>
                    <title>Криптографическая защита | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <CryptoCourse user={user} logout={logout} /> : <Navigate to="/" replace />}
                </>
              } 
            />
            <Route 
              path="/crypto-quiz" 
              element={
                <>
                  <Helmet>
                    <title>Тест по криптографии | Курсы по кибербезопасности</title>
                  </Helmet>
                  {user ? <CryptoQuiz user={user} logout={logout} /> : <Navigate to="/" replace />}
                </>
              } 
            />
            
            {/* Маршрут 404 - должен быть последним */}
            <Route 
              path="*" 
              element={
                <>
                  <Helmet>
                    <title>Страница не найдена | Курсы по кибербезопасности</title>
                  </Helmet>
                  <NotFoundPage />
                </>
              } 
            />
          </Routes>
          
          {/* Cookie Consent Banner */}
          <CookieConsent />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;