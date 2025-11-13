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

  // Функция для группировки попыток по курсам
  const groupAttemptsByCourse = (attempts) => {
    const grouped = {
      phishing: [],
      crypto: []
    };

    attempts.forEach(attempt => {
      if (attempt.course === 'crypto') {
        grouped.crypto.push(attempt);
      } else {
        grouped.phishing.push(attempt);
      }
    });

    return grouped;
  };

  // Функция для расчета статистики по курсу
  const calculateCourseStats = (attempts) => {
    if (attempts.length === 0) {
      return {
        bestScore: 0,
        totalAttempts: 0,
        lastAttempt: null,
        averageScore: 0
      };
    }

    const bestScore = Math.max(...attempts.map(a => a.percentage));
    const totalAttempts = attempts.length;
    const lastAttempt = attempts[0]?.completed_at || null;
    const averageScore = attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts;

    return {
      bestScore: Math.round(bestScore),
      totalAttempts,
      lastAttempt,
      averageScore: Math.round(averageScore)
    };
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

  // Группируем попытки по курсам
  const groupedAttempts = groupAttemptsByCourse(stats.stats.attempts_history);
  const phishingStats = calculateCourseStats(groupedAttempts.phishing);
  const cryptoStats = calculateCourseStats(groupedAttempts.crypto);

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
                  <strong>Email:</strong> {stats.user.email}
                </div>
                <div>
                  <strong>Зарегистрирован:</strong> {formatDate(stats.user.registered_at)}
                </div>
                <div>
                  <strong>Всего попыток:</strong> {stats.stats.total_attempts}
                </div>
              </div>
            </div>

            {/* Статистика по курсу фишинга */}
            <div className="card">
              <h3>📧 Противодействие фишингу</h3>
              {groupedAttempts.phishing.length > 0 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{phishingStats.bestScore}%</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Лучший результат</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{phishingStats.averageScore}%</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Средний результат</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{phishingStats.totalAttempts}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Всего попыток</div>
                    </div>
                  </div>

                  <h4>История попыток:</h4>
                  <div className="attempts-history">
                    {groupedAttempts.phishing.map((attempt, index) => (
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
                </>
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  У вас пока нет завершенных попыток теста по фишингу.
                </p>
              )}
            </div>

            {/* Статистика по курсу криптографии */}
            <div className="card">
              <h3>🔐 Криптографическая защита информации</h3>
              {groupedAttempts.crypto.length > 0 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{cryptoStats.bestScore}%</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Лучший результат</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{cryptoStats.averageScore}%</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Средний результат</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{cryptoStats.totalAttempts}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>Всего попыток</div>
                    </div>
                  </div>

                  <h4>История попыток:</h4>
                  <div className="attempts-history">
                    {groupedAttempts.crypto.map((attempt, index) => (
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
                </>
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  У вас пока нет завершенных попыток теста по криптографической защите.
                </p>
              )}
            </div>

            {/* Кнопки для перехода к курсам */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => window.location.href = '/phish-course'}
                className="cta-button"
                style={{ background: 'transparent', color: '#1a1a1a', border: '1px solid #1a1a1a' }}
              >
                📧 Повторить курс по фишингу
              </button>
              <button 
                onClick={() => window.location.href = '/crypto-course'}
                className="cta-button"
                style={{ background: 'transparent', color: '#1a1a1a', border: '1px solid #1a1a1a' }}
              >
                🔐 Повторить курс по криптографии
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default StatsPage;