import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const QuizPage = ({ user, logout }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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
        const questionsData = await import('../data/better.json');
        setQuestions(questionsData.questions);
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
          percentage: percentage
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
  const isCorrect = optionIndex === questions[currentQuestion].correct;
  
  setSelectedAnswers(prev => ({
    ...prev,
    [currentQuestion]: optionIndex
  }));

  setScore(prevScore => {
    const newScore = isCorrect ? prevScore + 1 : prevScore;
    const nextQuestion = currentQuestion + 1;
    
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      // Сохраняем результат
      const percentage = Math.round((newScore / questions.length) * 100);
      handleSaveResult(newScore, questions.length, percentage);
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
    return (
      <>
        <Header user={user} logout={logout} />
        
        {/* Кнопка возврата к теории - фиксированная */}
        <Link 
          to="/phish-course" 
          className={`toc-button ${isScrolled ? 'scrolled' : ''}`}
          style={{textDecoration: 'none'}}
        >
          <span className="toc-icon">🎣</span>
          <span className="toc-text">Вернуться к теории</span>
        </Link>

        <main className="main">
          <div className="container">
            <section className="article-section">
              <div className="quiz-result">
                <h2>Результаты теста</h2>
                <div className="score-circle">
                  <span className="score-percentage">{percentage}%</span>
                  <span className="score-text">
                    {score} из {questions.length} правильных ответов
                  </span>
                </div>
                
                {percentage >= 90 ? (
                  <div className="result-message success">
                    <h3>🎉 Отлично!</h3>
                    <p>Вы эксперт в области защиты от фишинга!</p>
                  </div>
                ) : percentage >= 70 ? (
                  <div className="result-message success">
                    <h3>👍 Очень хорошо</h3>
                    <p>Вы хорошо разбираетесь в теме фишинга!</p>
                  </div>
                ) : percentage >= 50 ? (
                  <div className="result-message warning">
                    <h3>📚 Неплохо</h3>
                    <p>Хороший результат, но есть куда расти!</p>
                  </div>
                ) : (
                  <div className="result-message error">
                    <h3>💡 Есть над чем поработать</h3>
                    <p>Рекомендуем изучить материалы еще раз.</p>
                  </div>
                )}

                <div className="answers-review">
                  <h4>Разбор ответов:</h4>
                  {questions.map((q, index) => (
                    <div key={q.id} className="answer-item">
                      <p><strong>Вопрос {index + 1}:</strong> {q.question}</p>
                      <p className={`user-answer ${selectedAnswers[index] === q.correct ? 'correct' : 'incorrect'}`}>
                        Ваш ответ: {q.options[selectedAnswers[index]]}
                      </p>
                      <p className="correct-answer">
                        Правильный ответ: {q.options[q.correct]}
                      </p>
                      <p className="explanation">{q.explanation}</p>
                    </div>
                  ))}
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

  return (
    <>
      <Header user={user} logout={logout} />
      
      {/* Кнопка возврата к теории - фиксированная */}
      <Link 
        to="/phish-course" 
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
              <h2>Тест по фишингу</h2>
              <p>Проверьте свои знания о фишинговых атаках и способах защиты</p>
              <div className="quiz-progress">
                Вопрос {currentQuestion + 1} из {questions.length}
              </div>
            </div>

            <div className="quiz-content">
              <div className="question-card">
                <h3>{questions[currentQuestion].question}</h3>
                <div className="options-grid">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      className="option-button"
                    >
                      {option}
                    </button>
                  ))}
                </div>

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

export default QuizPage;