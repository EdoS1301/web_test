// components/LoginPage.js
import React, { useState } from 'react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    department: '',
    organization: '',
    privacy_policy: false,
    pd_consent: false // НОВОЕ ПОЛЕ ДЛЯ ЯВНОГО СОГЛАСИЯ
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // ПРОВЕРКА СОГЛАСИЯ ДЛЯ РЕГИСТРАЦИИ
    if (!isLogin) {
      if (!formData.privacy_policy) {
        setError('Необходимо согласие на обработку персональных данных');
        setLoading(false);
        return;
      }
      if (!formData.pd_consent) {
        setError('Необходимо дать согласие на обработку персональных данных');
        setLoading(false);
        return;
      }
    }

    try {
      const url = isLogin ? '/api/login/' : '/api/register/';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.location.href = '/main';
        
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Курс по фишингу</h1>
          <p>Пройти обучение и тестирование по кибербезопасности</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            disabled={loading}
            type="button"
          >
            Вход
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            disabled={loading}
            type="button"
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@company.com"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="full_name">ФИО</label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Иванов Иван Иванович"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Отдел</label>
                <input
                  id="department"
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="Отдел IT"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="organization">Организация</label>
                <input
                  id="organization"
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  placeholder="Название компании"
                  disabled={loading}
                />
              </div>

              {/* СТАРОЕ СОГЛАСИЕ НА ПОЛИТИКУ */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="privacy_policy"
                    checked={formData.privacy_policy}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <span className="checkmark"></span>
                  <span>
                    Я ознакомлен(а) и согласен(на) с{' '}
                    <a 
                      href="/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: '#1a1a1a', 
                        textDecoration: 'underline',
                        fontWeight: '500'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (loading) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Политикой обработки персональных данных
                    </a>
                  </span>
                </label>
              </div>

              {/* НОВОЕ ЯВНОЕ СОГЛАСИЕ НА ОБРАБОТКУ ПДн */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="pd_consent"
                    checked={formData.pd_consent}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <span className="checkmark"></span>
                  <span>
                    <strong>Даю согласие на обработку моих персональных данных</strong><br />
                    <span style={{fontSize: '0.85rem', color: '#666'}}>
                      в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» 
                      для целей регистрации и прохождения обучения в системе
                    </span>
                  </span>
                </label>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading && <span className="spinner-small"></span>}
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button 
              type="button"
              className="link-btn" 
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;