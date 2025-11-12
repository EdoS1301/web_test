import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const MainPage = ({ user, logout }) => {
  const courses = [
    {
      id: 'phish-course',
      title: 'Противодействие фишингу',
      description: 'Научитесь распознавать и защищаться от фишинговых атак через почту, мессенджеры и браузер',
      icon: '🎣',
      status: 'available',
      progress: user?.stats?.phishing_progress || 0,
      duration: '30-45 минут',
      lessons: '8 разделов',
      quiz: 'Тест из 15 вопросов'
    },
    {
      id: 'social-engineering',
      title: 'Социальная инженерия',
      description: 'Изучите методы манипуляции и защиты от социальной инженерии в рабочей среде',
      icon: '👥',
      status: 'coming-soon',
      duration: '40-50 минут',
      lessons: '6 разделов',
      quiz: 'Тест из 15 вопросов'
    },
    {
      id: 'password-security',
      title: 'Безопасность паролей',
      description: 'Освойте современные методы создания и хранения надежных паролей',
      icon: '🔐',
      status: 'coming-soon',
      duration: '25-35 минут',
      lessons: '5 разделов',
      quiz: 'Тест из 12 вопросов'
    },
    {
      id: 'mobile-security',
      title: 'Мобильная безопасность',
      description: 'Защитите свои мобильные устройства от современных угроз',
      icon: '📱',
      status: 'coming-soon',
      duration: '35-45 минут',
      lessons: '7 разделов',
      quiz: 'Тест из 18 вопросов'
    }
  ];

  const getStatusBadge = (status, progress) => {
    switch (status) {
      case 'available':
        return progress > 0 ? 
          <span className="status-badge in-progress">В процессе ({progress}%)</span> :
          <span className="status-badge available">Доступно</span>;
      case 'coming-soon':
        return <span className="status-badge coming-soon">Скоро</span>;
      case 'completed':
        return <span className="status-badge completed">Завершено</span>;
      default:
        return <span className="status-badge unavailable">Недоступно</span>;
    }
  };

  const getCourseButton = (course) => {
    if (course.status === 'available') {
      return (
        <Link 
          to={`/${course.id}`} 
          className="course-button"
        >
          {course.progress > 0 ? 'Продолжить' : 'Начать обучение'}
        </Link>
      );
    } else {
      return (
        <button className="course-button disabled" disabled>
          Скоро доступно
        </button>
      );
    }
  };

  return (
    <>
      <Header user={user} logout={logout} />
      
      <main className="main">
        <div className="container">

          {/* Сетка курсов */}
          <section className="article-section">
            <h2>Доступные курсы</h2>
            <p style={{textAlign: 'center', marginBottom: '2rem', color: '#666'}}>
              Выберите курс для начала обучения. Все курсы разработаны экспертами по кибербезопасности.
            </p>

            <div className="courses-grid">
              {courses.map((course, index) => (
                <div key={course.id} className={`course-card ${course.status}`}>
                  <div className="course-header">
                    <div className="course-icon">{course.icon}</div>
                    <div className="course-title-section">
                      <h3>{course.title}</h3>
                      {getStatusBadge(course.status, course.progress)}
                    </div>
                  </div>
                  
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-details">
                    <div className="course-detail">
                      <span className="detail-icon">⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="course-detail">
                      <span className="detail-icon">📚</span>
                      <span>{course.lessons}</span>
                    </div>
                    <div className="course-detail">
                      <span className="detail-icon">🎯</span>
                      <span>{course.quiz}</span>
                    </div>
                  </div>

                  {/* Прогресс бар для доступных курсов */}
                  {course.status === 'available' && course.progress > 0 && (
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${course.progress}%`}}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress}% завершено</span>
                    </div>
                  )}

                  {getCourseButton(course)}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default MainPage;