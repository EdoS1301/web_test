import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
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
    <div className="app">
<header className="header">
  <div className="container">
    <h1>Фишинг: Примеры атак и защита</h1>
    <p>Полное руководство по распознаванию и противодействию фишинговым атакам</p>
  </div>
</header>

      <main className="main">
        <div className="container">
          {/* Что такое фишинг */}
          <section className="article-section">
            <h2>Что такое фишинг?</h2>
            <p>
              <strong>Фишинг</strong> (от англ. fishing - рыбалка) — это вид кибератаки, при которой злоумышленник 
              пытается выманить у вас личную информацию (логины, пароли, реквизиты) под видом официального запроса.
            </p>
            
            <div className="card">
              <h3>🎭 Социальная инженерия</h3>
              <p>
                Фишинг — это не взлом, а разновидность социальной инженерии, где злоумышленник 
                убеждает вас добровольно передать свои данные.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">91%</span>
                <span className="stat-label">кибератак начинаются с фишинга</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1 из 99</span>
                <span className="stat-label">писем является фишинговым</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">30 сек</span>
                <span className="stat-label">среднее время открытия фишинг-письма</span>
              </div>
            </div>
          </section>

          {/* Принцип фишинга */}
          <section className="article-section">
            <h2>Принцип работы фишинга</h2>
            
            <div className="techniques-grid">
              <div className="technique-card">
                <h4>📨 Получение сообщения</h4>
                <p>Вы получаете сообщение (почта, мессенджер, звонок) от человека, которому доверяете - друга, коллеги или начальника</p>
              </div>
              
              <div className="technique-card">
                <h4>⚡ Выполнение действия</h4>
                <p>В сообщении находится фишинговая ссылка на сайт-приманку, заражённые файлы или просьбы о выполнении действий</p>
              </div>
              
              <div className="technique-card">
                <h4>🔓 Ввод данных</h4>
                <p>После ввода данных или открытия файла злоумышленник получает доступ к вашей личной информации</p>
              </div>
            </div>

            <div className="card warning">
              <h3>⚠️ Цепочка атаки</h3>
              <p>
                Фишинговая атака строится на психологии доверия. Злоумышленники имитируют официальные 
                запросы, создавая ощущение срочности и важности, чтобы вы отключили бдительность.
              </p>
            </div>
          </section>

          {/* Примеры фишинга: Почта */}
          <section className="article-section">
            <h2>Примеры фишинга: Электронная почта</h2>

            <p>
              Фишинговые письма часто содержат фразы, подталкивающие к необдуманным действиям: 
              <strong> "Срочно!", "Ваш аккаунт заблокирован!", "Бесплатно!"</strong>
            </p>

            <div className="attack-type">
              <h3>📧 Реальный пример фишинг-письма</h3>
              <div className="example-card">
                <h4>🔍 Признаки мошенничества:</h4>
                <p><strong>Отправитель:</strong> info@natalsta.online</p>
                <p><strong>Ссылка:</strong> https://vk.cc/*NFGO*</p>
                <ul>
                  <li>Т-Банк отправляет письма только с домена <strong>emails.tinkoff.ru</strong></li>
                  <li>vk.cc — сервис сокращения ссылок для обхода алгоритмов защиты</li>
                  <li>Орфографические ошибки и слабый дизайн</li>
                </ul>
              </div>
              
              <div className="example-card">
                <h4>📋 Содержание письма:</h4>
                <p><strong>Задачи:</strong></p>
                <ul>
                  <li>Вы можете уйти из строя или изображения?</li>
                  <li>Установить текст поставки.</li>
                  <li>Получить 5000 рублей на один счет прямо сейчас!</li>
                </ul>
                <p><strong>Комментарии:</strong></p>
                <p>"Результат через 24 часа. Вы скажете получение до 1999 прибыли или заработать до 87 000 рублей в день."</p>
              </div>
            </div>
          </section>

          {/* Примеры фишинга: Мессенджер */}
          <section className="article-section">
            <h2>Примеры фишинга: Мессенджеры</h2>

            <div className="attack-type">
              <h3>💬 Сообщения в мессенджерах</h3>
              <p>
                Злоумышленник оформляет аккаунт под знакомого человека, используя информацию о вашей 
                организации. В сообщении может быть заражённый файл с скриптами.
              </p>

              <div className="example-card">
                <h4>📱 Пример сообщения:</h4>
                <div className="message-example">
                  <p><strong>Начальник в сети • 17 июля</strong></p>
                  <p>Проект_заработной_платы_на_2025_год.xlsx • 3,9 KB XLSX</p>
                  <p>"Добрый день, в связи с проведением обязательной ежегодной индексации заработной платы, направляю Вам копию нового расчёта вашего оклада"</p>
                </div>
              </div>
            </div>

            <div className="card warning">
              <h3>🎭 Новые угрозы</h3>
              <p>
                Современные злоумышленники используют нейросети для изменения голоса или замены лица 
                во время видеозвонков. Всегда перепроверяйте отправителя (username, id) и лично 
                проверяйте информацию до открытия файлов.
              </p>
            </div>
          </section>

          {/* Примеры фишинга: Браузер */}
          <section className="article-section">
            <h2>Примеры фишинга: Браузер</h2>

            <p>
              Фишинговые ссылки могут встречаться в результатах поиска и на обычных страницах. 
              Злоумышленники создают похожие на оригинальные ссылки, заменяя символы ("I" на "II", "l" на "1").
            </p>

            <div className="warning-signs">
              <div className="warning-sign">
                <h4>🔗 Оригинальные ссылки</h4>
                <ul>
                  <li>gosuslugi.ru</li>
                  <li>jkfj2.nalog.ru</li>
                  <li>adygheya.ru</li>
                </ul>
              </div>

              <div className="warning-sign">
                <h4>🚫 Фишинговые ссылки</h4>
                <ul>
                  <li>gоsuslugi.ru (замена символа)</li>
                  <li>nalog.rul (другой домен)</li>
                  <li>adygheya.rf (альтернативный домен)</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <h3>🔍 Рекламные кампании мошенников</h3>
              <p>
                Фишинговые сайты могут появляться в поиске выше оригинальных, если злоумышленники 
                создают рекламные кампании в поисковых системах. Всегда перепроверяйте ссылки!
              </p>
            </div>
          </section>

          {/* Как распознать фишинг */}
          <section className="article-section">
            <h2>Как распознать фишинг</h2>

            <div className="protection-grid">
              <div className="protection-card">
                <h4>🔎 Ключевые признаки</h4>
                <ul>
                  <li>Подозрительный отправитель (неверное имя, адрес)</li>
                  <li>Орфографические и грамматические ошибки</li>
                  <li>Создание срочности ("Срочно!", "Аккаунт заблокирован!")</li>
                  <li>Подозрительные ссылки (замена символов, неверный домен)</li>
                  <li>Провокационные сообщения и призывы</li>
                  <li>Темы, не относящиеся к рабочему процессу</li>
                </ul>
              </div>
            </div>

            <div className="techniques-grid">
              <div className="technique-card">
                <h4>📧 Проверка почты</h4>
                <p>Всегда проверяйте адрес отправителя и домен</p>
              </div>
              
              <div className="technique-card">
                <h4>🔗 Анализ ссылок</h4>
                <p>Наводите курсор на ссылки для просмотра реального адреса</p>
              </div>
              
              <div className="technique-card">
                <h4>📎 Осторожность с файлами</h4>
                <p>Не открывайте подозрительные вложения</p>
              </div>
            </div>
          </section>

          {/* Что делать */}
          <section className="article-section">
            <h2>Что делать при обнаружении фишинга</h2>

            <div className="attack-types">
              <div className="attack-type">
                <h3>🛡️ Если вы обнаружили фишинговое письмо</h3>
                <ul>
                  <li>Не открывайте приложенные ссылки и файлы</li>
                  <li>Сообщите сотруднику, ответственному за защиту информации в вашем учреждении</li>
                  <li>Удалите письмо</li>
                  <li>Заблокируйте отправителя</li>
                </ul>
              </div>

              <div className="attack-type">
                <h3>🚨 Если вы открыли фишинговую ссылку или файл</h3>
                <ul>
                  <li>Сообщите сотруднику, ответственному за защиту информации в вашем учреждении</li>
                  <li>Следуйте указаниям специалистов</li>
                  <li>Изолируйте зараженное устройство от сети</li>
                  <li>Смените пароли на критически важных сервисах</li>
                </ul>
              </div>
            </div>

            <div className="card success">
              <h3>✅ Профилактика лучше лечения</h3>
              <p>
                Регулярное обучение сотрудников, использование многофакторной аутентификации и 
                антифишинговых решений значительно снижают риски успешных атак.
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2025 Руководство по противодействию фишингу</p>
          <p>Статус системы: <span className="api-status">{data.status} - {data.message}</span></p>
        </div>
      </footer>
    </div>
  );
}

export default App;