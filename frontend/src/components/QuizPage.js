import React, { useState } from 'react';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    {
      question: "Что такое фишинг?",
      options: [
        "Вид спортивной рыбалки",
        "Кибератака с целью получения личной информации",
        "Метод шифрования данных",
        "Вид компьютерного вируса"
      ],
      correct: 1,
      explanation: "Фишинг - это кибератака, при которой злоумышленник пытается выманить личную информацию под видом официального запроса."
    },
    {
      question: "Какой из этих email-адресов скорее всего является фишинговым?",
      options: [
        "security@bank-official.com",
        "support@paypal-security.com",
        "info@paypal.com",
        "no-reply@google.com"
      ],
      correct: 1,
      explanation: "Адрес 'support@paypal-security.com' подозрителен - официальный PayPal использует домен @paypal.com"
    },
    {
      question: "Что делать при получении подозрительного письма?",
      options: [
        "Немедленно перейти по ссылке в письме",
        "Ответить отправителю",
        "Не открывать вложения и сообщить в отдел безопасности",
        "Переслать письмо коллегам"
      ],
      correct: 2,
      explanation: "Не открывайте вложения и ссылки, сразу сообщите в отдел информационной безопасности."
    },
    {
      question: "Как отличить фишинговый сайт?",
      options: [
        "По наличию рекламы на странице",
        "По несовпадению доменного имени с официальным",
        "По скорости загрузки страницы",
        "По цветовой схеме сайта"
      ],
      correct: 1,
      explanation: "Фишинговые сайты часто используют домены, похожие на официальные, но с заменой символов."
    },
    {
      question: "Что такое тайпсквоттинг?",
      options: [
        "Быстрый набор текста",
        "Создание доменов-опечаток для обмана пользователей",
        "Метод шифрования паролей",
        "Вид фишинга через телефон"
      ],
      correct: 1,
      explanation: "Тайпсквоттинг - создание доменных имен, похожих на популярные, но с опечатками."
    },
    {
      question: "Какой признак НЕ характерен для фишингового письма?",
      options: [
        "Орфографические ошибки",
        "Официальный домен отправителя",
        "Создание срочности",
        "Просьба предоставить личные данные"
      ],
      correct: 1,
      explanation: "Официальный домен отправителя - признак легитимного письма, а не фишингового."
    }
  ];

  const handleAnswerClick = (optionIndex) => {
    const newSelectedAnswers = {
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    };
    setSelectedAnswers(newSelectedAnswers);

    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswers({});
  };

  if (showScore) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
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
              
              {percentage >= 80 ? (
                <div className="result-message success">
                  <h3>🎉 Отлично!</h3>
                  <p>Вы отлично разбираетесь в теме фишинга!</p>
                </div>
              ) : percentage >= 60 ? (
                <div className="result-message warning">
                  <h3>👍 Хорошо</h3>
                  <p>Неплохой результат, но есть куда расти!</p>
                </div>
              ) : (
                <div className="result-message error">
                  <h3>📚 Есть над чем поработать</h3>
                  <p>Рекомендуем изучить материалы еще раз.</p>
                </div>
              )}

              <div className="answers-review">
                <h4>Разбор ответов:</h4>
                {questions.map((q, index) => (
                  <div key={index} className="answer-item">
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

              <button onClick={handleRestart} className="restart-button">
                Пройти тест еще раз
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default QuizPage;