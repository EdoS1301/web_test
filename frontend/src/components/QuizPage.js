import React, { useState } from 'react';

const QuizPage = ({ user }) => {
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
        "sberbank.ru",
        "adygheya.rf",
        "vk.com",
        "no-reply@google.com"
      ],
      correct: 1,
      explanation: "Адрес 'adygheya.rf' подозрителен - официальный сайт использует домен adygheya.ru"
    },
    {
      question: "Что делать при получении подозрительного письма?",
      options: [
        "Немедленно перейти по ссылке в письме",
        "Ответить отправителю",
        "Не открывать вложения и сообщить в отдел безопасности вашего учреждения",
        "Переслать письмо коллегам"
      ],
      correct: 2,
      explanation: "Не открывайте вложения и ссылки, сразу сообщите в отдел информационной безопасности."
    },
    {
      question: "Как отличить фишинговый сайт?",
      options: [
        "По наличию рекламы на странице",
        "По цветовой схеме сайта",
        "По скорости загрузки страницы",
        "По несовпадению доменного имени с официальным"
      ],
      correct: 3,
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
    },
    {
      question: "Какой элемент НЕ является признаком фишингового сайта?",
      options: [
        "Наличие SSL-сертификата (https://)",
        "Неофициальный домен с опечатками",
        "Орфографические ошибки в тексте", 
        "Отсутствие контактной информации"
      ],
      correct: 0,
      explanation: "Наличие SSL-сертификата не гарантирует безопасность - фишинговые сайты тоже могут использовать HTTPS."
    },
    {
      question: "Какой из этих методов защиты наиболее эффективен против фишинга?",
      options: [
        "Использование антивируса",
        "Многофакторная аутентификация",
        "Регулярная смена паролей",
        "Блокировка рекламы"
      ],
      correct: 1,
      explanation: "Многофакторная аутентификация защищает даже если злоумышленник получит ваши логин и пароль."
    },
    {
      question: "Что делать, если вы случайно ввели данные на фишинговом сайте?",
      options: [
        "Ничего, это не страшно",
        "Немедленно сменить пароли и сообщить в отдел безопасности своего учреждения",
        "Удалить историю браузера",
        "Перезагрузить компьютер"
      ],
      correct: 1,
      explanation: "Немедленно смените пароли на всех сервисах, где использовался тот же пароль, и сообщите в службу безопасности."
    },
    {
      question: "Какой из этих URL является подозрительным?",
      options: [
        "https://www.google.com",
        "https://mybank-secure-login.com",
        "https://mail.ru",
        "https://yandex.ru"
      ],
      correct: 1,
      explanation: "Адрес 'mybank-secure-login.com' подозрителен - настоящие банки используют свои официальные домены."
    },
    {
      question: "Что такое 'клонирование' в контексте фишинга?",
      options: [
        "Копирование внешности человека",
        "Клонирование телефонного номера",
        "Создание точной копии легитимного сайта",
        "Создание поддельного приложения"
      ],
      correct: 2,
      explanation: "Клонирование - создание точной копии легитимного сайта для обмана пользователей."
    },
    {
    question: "Может ли фишинговая ссылка быть в результатах поиска?",
    options: [
      "Да, мошенники могут создавать рекламные кампании",
      "Нет, поисковые системы блокируют такие ссылки",
      "Только в нелицензионных поисковых системах",
      "Только если это опечатка в запросе"
    ],
    correct: 0,
    explanation: "Да, фишинговые ссылки могут появляться в результатах поиска, особенно если мошенники создают рекламные кампании."
    },
    {
    question: "Под кого может замаскироваться злоумышленник во время фишинга?",
    options: [
      "Только под начальника",
      "Только под коллег",
      "Только под друзей",
      "Под любого из перечисленных - друга, коллегу или начальника"
    ],
    correct: 3,
    explanation: "Злоумышленник может замаскироваться под любого человека, которому вы доверяете - лучшего друга, коллегу по работе или даже начальника."
    },
    {
    question: "Когда нужно сообщать, что вы обнаружили фишинговое письмо?",
    options: [
      "Можно не сообщать",
      "В течение недели",
      "Сразу после обнаружения",
      "В течение дня"
    ],
    correct: 2,
    explanation: "Сообщать о фишинговом письме нужно сразу после обнаружения, чтобы предотвратить возможные атаки на других сотрудников."
    },
    {
    question: "Что может быть заражённым файлом?",
    options: [
      "Только EXE-файлы",
      "Только документы Word",
      "Таблицы, EXE-файлы, документы и изображения",
      "Только архивы"
    ],
    correct: 2,
    explanation: "Любой файл может быть заражённым - таблицы (с макросами), EXE-файлы, документы (с вредоносными скриптами) и даже изображения (с эксплойтами)."
    },
  ];

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
      // Сохраняем результат после завершения теста
      const percentage = Math.round((score / questions.length) * 100);
      handleSaveResult(score, questions.length, percentage);
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