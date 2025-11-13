import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { downloadCertificate } from './CryptoCertificate';

const CryptoQuiz = ({ user, logout }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [multipleSelection, setMultipleSelection] = useState({});

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

  // Загрузка вопросов из JSON файла
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Импортируем вопросы напрямую как модуль
        const questionsData = await import('../data/crypto-questions.json');
        setQuestions(questionsData.questions);
        
        // Инициализируем состояние для множественного выбора
        const initialMultipleSelection = {};
        questionsData.questions.forEach((question, index) => {
          if (Array.isArray(question.correct)) {
            initialMultipleSelection[index] = [];
          }
        });
        setMultipleSelection(initialMultipleSelection);
        
      } catch (err) {
        setError('Ошибка загрузки вопросов: ' + err.message);
        console.error('Ошибка загрузки вопросов:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleSaveResult = async (score, totalQuestions, percentage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz/save/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score: score,
          total_questions: totalQuestions,
          percentage: percentage,
          course: 'crypto'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Результат сохранен:', data);
      } else {
        console.error('Ошибка сохранения результата');
      }
    } catch (error) {
      console.error('Ошибка сохранения результата:', error);
    }
  };

  const handleAnswerClick = (optionIndex) => {
    const currentQ = questions[currentQuestion];
    
    if (Array.isArray(currentQ.correct)) {
      // Множественный выбор
      const newSelection = [...(multipleSelection[currentQuestion] || [])];
      const optionIndexInArray = newSelection.indexOf(optionIndex);
      
      if (optionIndexInArray > -1) {
        // Убираем выбранный вариант
        newSelection.splice(optionIndexInArray, 1);
      } else {
        // Добавляем вариант
        newSelection.push(optionIndex);
      }
      
      setMultipleSelection(prev => ({
        ...prev,
        [currentQuestion]: newSelection
      }));
      
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestion]: newSelection
      }));
    } else {
      // Одиночный выбор
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestion]: optionIndex
      }));

      const isCorrect = optionIndex === currentQ.correct;
      
      setScore(prevScore => {
        const newScore = isCorrect ? prevScore + 1 : prevScore;
        const nextQuestion = currentQuestion + 1;
        
        if (nextQuestion >= questions.length) {
          setShowScore(true);
          const percentage = Math.round((newScore / questions.length) * 100);
          handleSaveResult(newScore, questions.length, percentage);
        } else {
          setCurrentQuestion(nextQuestion);
        }
        
        return newScore;
      });
    }
  };

  const handleMultipleChoiceSubmit = () => {
    const currentQ = questions[currentQuestion];
    const selected = multipleSelection[currentQuestion] || [];
    
    // Проверяем правильность ответа
    const isCorrect = Array.isArray(currentQ.correct) && 
                     selected.length === currentQ.correct.length &&
                     selected.every(opt => currentQ.correct.includes(opt)) &&
                     currentQ.correct.every(opt => selected.includes(opt));
    
    setScore(prevScore => {
      const newScore = isCorrect ? prevScore + 1 : prevScore;
      const nextQuestion = currentQuestion + 1;
      
      if (nextQuestion >= questions.length) {
        setShowScore(true);
        const percentage = Math.round((newScore / questions.length) * 100);
        handleSaveResult(newScore, questions.length, percentage);
      } else {
        setCurrentQuestion(nextQuestion);
      }
      
      return newScore;
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswers({});
    
    // Сбрасываем множественный выбор
    const initialMultipleSelection = {};
    questions.forEach((question, index) => {
      if (Array.isArray(question.correct)) {
        initialMultipleSelection[index] = [];
      }
    });
    setMultipleSelection(initialMultipleSelection);
  };

  // Показываем загрузку
  if (loading) {
    return (
      <>
        <Header user={user} logout={logout} />
        <main className="main">
          <div className="container">
            <section className="article-section">
              <div className="quiz-loading">
                <h2>Загрузка вопросов...</h2>
                <p>Пожалуйста, подождите</p>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <>
        <Header user={user} logout={logout} />
        <main className="main">
          <div className="container">
            <section className="article-section">
              <div className="quiz-error">
                <h2>Ошибка</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Попробовать снова
                </button>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  // Проверяем, что вопросы загружены
  if (questions.length === 0) {
    return (
      <>
        <Header user={user} logout={logout} />
        <main className="main">
          <div className="container">
            <section className="article-section">
              <div className="quiz-error">
                <h2>Вопросы не найдены</h2>
                <p>Не удалось загрузить вопросы для теста</p>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  if (showScore) {
    const percentage = Math.round((score / questions.length) * 100);

    // Функция для скачивания заключения
    const handleDownloadCertificate = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const courseStats = {
        bestScore: percentage,
        totalAttempts: 1
      };
      downloadCertificate(userData, courseStats);
    };

    return (
      <>
        <Header user={user} logout={logout} />
        
        <Link 
          to="/crypto-course" 
          className={`toc-button ${isScrolled ? 'scrolled' : ''}`}
          style={{textDecoration: 'none'}}
        >
          <span className="toc-icon">📚</span>
          <span className="toc-text">Вернуться к теории</span>
        </Link>

        <main className="main">
          <div className="container">
            <section className="article-section">
              <div className="quiz-result">
                <h2>Результаты теста по криптографической защите</h2>
                <div className="score-circle">
                  <span className="score-percentage">{percentage}%</span>
                  <span className="score-text">
                    {score} из {questions.length} правильных ответов
                  </span>
                </div>
                
                {percentage >= 90 ? (
                  <div className="result-message success">
                    <h3>🎉 Отлично!</h3>
                    <p>Вы отлично разбираетесь в криптографической защите информации!</p>
                  </div>
                ) : percentage >= 70 ? (
                  <div className="result-message success">
                    <h3>👍 Очень хорошо</h3>
                    <p>Вы хорошо знаете правила работы с СКЗИ!</p>
                  </div>
                ) : percentage >= 50 ? (
                  <div className="result-message warning">
                    <h3>📚 Неплохо</h3>
                    <p>Хороший результат, но есть над чем поработать!</p>
                  </div>
                ) : (
                  <div className="result-message error">
                    <h3>💡 Есть над чем поработать</h3>
                    <p>Рекомендуем изучить материалы еще раз.</p>
                  </div>
                )}

                {percentage >= 70 && (
                    <div style={{ 
                        background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)',
                        padding: '2.5rem',
                        borderRadius: '15px',
                        border: '2px solid #4caf50',
                        margin: '2rem 0',
                        textAlign: 'center',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.15)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Декоративные элементы */}
                        <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '150px',
                        height: '150px',
                        background: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: '50%'
                        }}></div>
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            background: '#4caf50',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '25px',
                            display: 'inline-block',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            🎓 СЕРТИФИКАТ
                        </div>

                        <h3 style={{ 
                            color: '#2e7d32', 
                            marginBottom: '1rem',
                            fontSize: '1.5rem'
                        }}>
                            Поздравляем с успешным прохождением!
                        </h3>

                        <div style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '10px',
                            margin: '1.5rem 0',
                            border: '1px solid #e0e0e0'
                        }}>
                            <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                            <strong>Ваш результат:</strong> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{percentage}%</span>
                            </p>
                            <p style={{ margin: '0', color: '#666' }}>
                            Вы успешно прошли тестирование по криптографической защите информации
                            </p>
                        </div>

                        <p style={{ 
                            fontSize: '0.95rem', 
                            color: '#666',
                            marginBottom: '1.5rem',
                            lineHeight: '1.5'
                        }}>
                            Скачайте официальный сертификат, подтверждающий вашу готовность 
                            к работе со средствами криптографической защиты информации.
                        </p>
                        
                        <button 
                            onClick={handleDownloadCertificate}
                            className="cta-button"
                            style={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                            }}
                            onMouseOver={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #333 0%, #555 100%)';
                            e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                            e.target.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)';
                            e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            📥 Скачать сертификат (PDF)
                        </button>
                        
                        <p style={{ 
                            fontSize: '0.85rem', 
                            color: '#888', 
                            marginTop: '1rem'
                        }}>
                            Сертификат будет скачан в формате PDF
                        </p>
                        </div>
                    </div>
                    )}

                <div className="answers-review">
                  <h4>Разбор ответов:</h4>
                  {questions.map((q, index) => {
                    const userAnswer = selectedAnswers[index];
                    let isCorrect = false;
                    
                    if (Array.isArray(q.correct)) {
                      // Для множественного выбора
                      isCorrect = Array.isArray(userAnswer) && 
                                 userAnswer.length === q.correct.length &&
                                 userAnswer.every(opt => q.correct.includes(opt)) &&
                                 q.correct.every(opt => userAnswer.includes(opt));
                    } else {
                      // Для одиночного выбора
                      isCorrect = userAnswer === q.correct;
                    }
                    
                    return (
                      <div key={q.id} className="answer-item">
                        <p><strong>Вопрос {index + 1}:</strong> {q.question}</p>
                        <p className={`user-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                          Ваш ответ: {Array.isArray(userAnswer) 
                            ? userAnswer.map(idx => q.options[idx]).join(', ')
                            : q.options[userAnswer]
                          }
                        </p>
                        <p className="correct-answer">
                          Правильный ответ: {Array.isArray(q.correct) 
                            ? q.correct.map(idx => q.options[idx]).join(', ')
                            : q.options[q.correct]
                          }
                        </p>
                        <p className="explanation">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem'}}>
                  <button onClick={handleRestart} className="cta-button restart-button">
                    Пройти тест еще раз
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  const currentQ = questions[currentQuestion];
  const isMultipleChoice = Array.isArray(currentQ.correct);
  const selectedOptions = isMultipleChoice ? (multipleSelection[currentQuestion] || []) : [];

  return (
    <>
      <Header user={user} logout={logout} />
      
      <Link 
        to="/crypto-course" 
        className={`toc-button ${isScrolled ? 'scrolled' : ''}`}
        style={{textDecoration: 'none'}}
      >
        <span className="toc-icon">📚</span>
        <span className="toc-text">Вернуться к теории</span>
      </Link>

      <main className="main">
        <div className="container">
          <section className="article-section">
            <div className="quiz-header">
              <h2>Тест по криптографической защите информации</h2>
              <p>Проверьте свои знания о правилах работы со средствами криптографической защиты информации</p>
              {isMultipleChoice && (
                <div style={{
                  background: '#e3f2fd',
                  padding: '1rem',
                  borderRadius: '8px',
                  margin: '1rem 0',
                  border: '1px solid #2196f3'
                }}>
                  <strong>⚠️ Вопрос с множественным выбором</strong> - выберите все правильные варианты ответа
                </div>
              )}
              <div className="quiz-progress">
                Вопрос {currentQuestion + 1} из {questions.length}
              </div>
            </div>

            <div className="quiz-content">
              <div className="question-card">
                <h3>{currentQ.question}</h3>
                <div className="options-grid">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      className={`option-button ${isMultipleChoice && selectedOptions.includes(index) ? 'selected' : ''}`}
                      style={{
                        background: isMultipleChoice && selectedOptions.includes(index) ? '#e3f2fd' : 'white',
                        borderColor: isMultipleChoice && selectedOptions.includes(index) ? '#2196f3' : '#e5e5e5'
                      }}
                    >
                      {option}
                      {isMultipleChoice && selectedOptions.includes(index) && (
                        <span style={{marginLeft: 'auto', color: '#2196f3', fontWeight: 'bold'}}>✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Кнопка подтверждения для множественного выбора */}
                {isMultipleChoice && (
                  <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
                    <button 
                      onClick={handleMultipleChoiceSubmit}
                      className="cta-button"
                      disabled={selectedOptions.length === 0}
                      style={{
                        background: selectedOptions.length === 0 ? '#e5e5e5' : '#1a1a1a',
                        color: selectedOptions.length === 0 ? '#999' : 'white',
                        cursor: selectedOptions.length === 0 ? 'not-allowed' : 'pointer',
                        border: '1px solid #1a1a1a',
                        padding: '1rem 2.5rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedOptions.length === 0 ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseOver={(e) => {
                        if (selectedOptions.length > 0) {
                          e.target.style.background = 'white';
                          e.target.style.color = '#1a1a1a';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedOptions.length > 0) {
                          e.target.style.background = '#1a1a1a';
                          e.target.style.color = 'white';
                        }
                      }}
                    >
                      Подтвердить выбор ({selectedOptions.length} выбрано)
                    </button>
                  </div>
                )}

                {/* Кнопка "Назад" для перехода к предыдущему вопросу */}
                {currentQuestion > 0 && (
                  <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
                    <button 
                      onClick={handlePreviousQuestion}
                      className="cta-button"
                      style={{
                        background: 'transparent', 
                        color: '#1a1a1a', 
                        border: '1px solid #1a1a1a',
                        padding: '0.8rem 1.5rem'
                      }}
                    >
                      ← Предыдущий вопрос
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default CryptoQuiz;