import React, { useState } from 'react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Некорректный формат email';
    }
    
    if (!email.toLowerCase().endsWith('.gov.ru')) {
      return 'Регистрация доступна только для email с доменом .gov.ru';
    }
    
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Пароль должен содержать не менее 8 символов';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    // Валидация пароля (только для регистрации)
    if (!isLogin) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError(passwordError);
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
          <h1>Противодействие фишингу</h1>
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
            <label htmlFor="email">Email {!isLogin && <span style={{color: '#dc2626'}}>*</span>}</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@gov.ru"
              disabled={loading}
            />
            {!isLogin && (
              <div style={{fontSize: '0.8rem', color: '#666', marginTop: '0.3rem'}}>
                Только для email с доменом @adygheya.gov.ru (например: user@adygheya.gov.ru)
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль {!isLogin && <span style={{color: '#dc2626'}}>*</span>}</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isLogin ? "Введите пароль" : "Придумайте пароль"}
              disabled={loading}
            />
            {!isLogin && (
              <div style={{fontSize: '0.8rem', color: '#666', marginTop: '0.3rem'}}>
                Пароль должен содержать не менее 8 символов
              </div>
            )}
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