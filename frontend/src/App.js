import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage';
import QuizPage from './components/QuizPage';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData({
        status: "Online",
        message: "Система защиты активна"
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка информации о фишинге...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
        <Footer data={data} />
      </div>
    </Router>
  );
}

const Header = () => (
  <header className="header">
    <div className="container">
      <div className="header-content">
        <h1>Фишинг: Примеры атак и защита</h1>
        <p>Полное руководство по распознаванию и противодействию фишинговым атакам</p>
        <nav className="navigation">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/quiz" className="nav-link">Пройти тест</Link>
        </nav>
      </div>
    </div>
  </header>
);

const Footer = ({ data }) => (
  <footer className="footer">
    <div className="container">
      <p>© 2025 Руководство по противодействию фишингу</p>
      <p>Статус системы: <span className="api-status">{data?.status} - {data?.message}</span></p>
    </div>
  </footer>
);

export default App;