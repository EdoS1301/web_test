import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/main" replace /> : <LoginPage />} 
          />
          <Route 
            path="/main" 
            element={user ? <MainPage user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/phish-course" 
            element={user ? <PhishCourse user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/quiz" 
            element={user ? <QuizPage user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/stats" 
            element={user ? <StatsPage user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/privacy-policy" 
            element={<PrivacyPolicy user={user} logout={logout} />} 
          />
          <Route 
            path="/consent-form" 
            element={<ConsentForm user={user} logout={logout} />} 
          />
          <Route 
            path="/phishing-example" 
            element={<PhishingExample />} 
          />
          <Route 
            path="/crypto-course" 
            element={user ? <CryptoCourse user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/crypto-quiz" 
            element={user ? <CryptoQuiz user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
        </Routes>
        
        {/* Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;