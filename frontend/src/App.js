import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import QuizPage from './components/QuizPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
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
            path="/quiz" 
            element={user ? <QuizPage user={user} logout={logout} /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;