import React, { useState, useEffect } from 'react';
import Header from './Header';

const StatsPage = ({ user, logout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/user/stats/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка загрузки статистики');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Нет данных';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Header user={user} logout={logout} />
        <main className="main">
          <div className="container">
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка статистики...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header user={user} logout={logout} />
        <main className="main">
          <div className="container">
            <section className="article-section">
              <div className="error-message">
                <h3>Ошибка</h3>
                <p>{error}</p>
                <button onClick={fetchUserStats} className="cta-button">
                  Попробовать снова
                </button>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header user={user} logout={logout} />
      <main className="main">
        <div className="container">
          <section className="article-section">
            <h2>Моя статистика</h2>
            
            {/* Информация о пользователе */}
            <div className="card">
              <h3>Профиль пользователя</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <strong>ФИО:</strong> {stats.user.full_name}
                </div>
                <div>
                  <strong>Отдел:</strong> {stats.user.department}
                </div>
                <div>
                  <strong>Организация:</strong> {stats.user.organization}
                </div>
                <div>
                  <strong>Email:</strong> {stats.user.email}
                </div>
              </div>
            </div>

            {/* Основная статистика */}
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.stats.best_score}%</span>
                <span className="stat-label">Лучший результат</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.stats.total_attempts}</span>
                <span className="stat-label">Всего попыток</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {stats.stats.last_attempt ? formatDate(stats.stats.last_attempt) : 'Нет данных'}
                </span>
                <span className="stat-label">Последняя попытка</span>
              </div>
            </div>

            {/* История попыток */}
            <div className="card">
              <h3>История попыток</h3>
              {stats.stats.attempts_history.length > 0 ? (
                <div className="attempts-history">
                  {stats.stats.attempts_history.map((attempt, index) => (
                    <div key={index} className="attempt-item" style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                      border: '1px solid #e5e5e5',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#1a1a1a' }}>
                          Результат: {attempt.percentage}%
                        </strong>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                          {formatDate(attempt.completed_at)}
                        </span>
                      </div>
                      <div style={{ color: '#666' }}>
                        Правильных ответов: {attempt.score} из {attempt.total_questions}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  У вас пока нет завершенных попыток теста.
                </p>
              )}
            </div>

            {/* Достижения */}
            <div className="card">
              <h3>Достижения</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {stats.stats.best_score >= 90 ? '🏆' : stats.stats.best_score >= 70 ? '⭐' : '📚'}
                  </div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {stats.stats.best_score >= 90 ? 'Эксперт' : 
                     stats.stats.best_score >= 70 ? 'Продвинутый' : 
                     stats.stats.best_score >= 50 ? 'Новичок' : 'Начинающий'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Уровень знаний
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {stats.stats.total_attempts >= 10 ? '🔥' : 
                     stats.stats.total_attempts >= 5 ? '💪' : '🎯'}
                  </div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {stats.stats.total_attempts} попыток
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Активность
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {stats.stats.best_score >= 80 && stats.stats.total_attempts >= 3 ? '✅' : '📝'}
                  </div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {stats.stats.best_score >= 80 && stats.stats.total_attempts >= 3 ? 'Завершено' : 'В процессе'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Прогресс обучения
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => window.location.href = '/quiz'}
                className="cta-button"
              >
                Пройти тест еще раз
              </button>
              <button 
                onClick={() => window.location.href = '/main'}
                className="cta-button"
                style={{ background: 'transparent', color: '#1a1a1a', border: '1px solid #1a1a1a' }}
              >
                Повторить теорию
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default StatsPage;