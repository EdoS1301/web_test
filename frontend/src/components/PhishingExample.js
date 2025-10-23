import React, { useState, useEffect } from 'react';

const PhishingExample = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({
    mainLogo: false,
    eosLogo: false,
    textLogo: false
  });

  // Реальные URL изображений
  const imageUrls = {
    mainLogo: 'https://delo.sovrnhmao.ru/DELO/Logo.ashx?img=DeloWeb.png&138962461661832321598231198972321792222431042493827',
    eosLogo: 'https://delo.sovrnhmao.ru/DELO/Logo.ashx?img=eos_logo.png&1201467153173379417072311171002893124469717522380',
    textLogo: 'https://delo.sovrnhmao.ru/DELO/Logo.ashx?img=deloWeb_text.png&841624142217791441572299923825375127128775825120754'
  };

  useEffect(() => {
    document.getElementById('LOGIN')?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowEducation(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleImageLoad = (imageName) => {
    console.log(`Image loaded: ${imageName}`);
    setImagesLoaded(prev => ({ ...prev, [imageName]: true }));
  };

  const handleImageError = (imageName) => {
    console.log(`Image failed to load: ${imageName}`);
    setImagesLoaded(prev => ({ ...prev, [imageName]: false }));
  };

  return (
    <div style={styles.phishingPage}>
      {/* Скрытый баннер для учебных целей */}
      <div style={styles.phishingWarning}>
        <strong>УЧЕБНЫЙ ПРИМЕР - ЭТО НЕ НАСТОЯЩАЯ СТРАНИЦА СИСТЕМЫ "ДЕЛО-WEB"!</strong>
      </div>
      
      <div style={styles.deloWebPage}>
        <form method="post" style={styles.deloWebForm} onSubmit={handleSubmit}>
          <table style={styles.mainTable}>
            <tbody>
              <tr>
                <td>
                  <div style={styles.menuLogo}>
                    {/* Главный логотип ДЕЛО-Web */}
                    <div style={styles.logoContainer}>
                      <img 
                        src={imageUrls.mainLogo}
                        alt="ДЕЛО-Web" 
                        style={{
                          ...styles.mainLogo,
                          display: imagesLoaded.mainLogo ? 'block' : 'none'
                        }}
                        onLoad={() => handleImageLoad('mainLogo')}
                        onError={() => handleImageError('mainLogo')}
                      />
                      {!imagesLoaded.mainLogo && (
                        <div style={styles.textLogoFallback}>
                          ДЕЛО-Web
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={styles.contentCell}>
                  <div style={styles.loginContainer}>
                    <table style={styles.loginContent} align="center">
                      <tbody>
                        <tr>
                          <td align="center">
                            <table style={styles.headerTable}>
                              <tbody>
                                <tr>
                                  <td rowSpan="2" style={styles.logoCell}>
                                    {/* Логотип EOS - УВЕЛИЧЕННЫЙ РАЗМЕР */}
                                    <div style={styles.smallLogoContainer}>
                                      <img 
                                        src={imageUrls.eosLogo}
                                        alt="EOS" 
                                        style={{
                                          ...styles.smallLogo,
                                          display: imagesLoaded.eosLogo ? 'block' : 'none'
                                        }}
                                        onLoad={() => handleImageLoad('eosLogo')}
                                        onError={() => handleImageError('eosLogo')}
                                      />
                                      {!imagesLoaded.eosLogo && (
                                        <div style={styles.smallLogoFallback}>
                                          EOS
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td style={styles.textLeft}>
                                    <h1 style={styles.h1}>Вход в систему</h1>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={styles.textLeft}>
                                    {/* Текстовый логотип ДЕЛО-Web - УВЕЛИЧЕННЫЙ РАЗМЕР */}
                                    <div style={styles.textLogoContainer}>
                                      <img 
                                        src={imageUrls.textLogo}
                                        alt="ДЕЛО-Web" 
                                        style={{
                                          ...styles.textLogo,
                                          display: imagesLoaded.textLogo ? 'block' : 'none'
                                        }}
                                        onLoad={() => handleImageLoad('textLogo')}
                                        onError={() => handleImageError('textLogo')}
                                      />
                                      {!imagesLoaded.textLogo && (
                                        <div style={styles.textLogoTextFallback}>
                                          ДЕЛО-Web
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <table 
                              style={styles.formTable}
                              border="0" 
                              cellSpacing="5" 
                              cellPadding="4"
                            >
                              <tbody>
                                <tr>
                                  <td style={styles.tagCell}>
                                    Имя:
                                  </td>
                                  <td style={styles.inputCell}>
                                    <input 
                                      name="LOGIN" 
                                      type="text" 
                                      id="LOGIN" 
                                      value={login}
                                      onChange={(e) => setLogin(e.target.value)}
                                      style={styles.input}
                                      autoComplete="off" 
                                      placeholder="Введите имя"
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td style={styles.tagCell}>
                                    Пароль:
                                  </td>
                                  <td style={styles.inputCell}>
                                    <input 
                                      name="pass" 
                                      type="password" 
                                      id="pass" 
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      style={styles.input}
                                      autoComplete="off" 
                                      placeholder="Введите пароль"
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    &nbsp;
                                  </td>
                                  <td style={styles.textLeft}>
                                    <input 
                                      type="submit" 
                                      name="action" 
                                      value="Войти" 
                                      style={styles.submitBtn}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2">
                                    <div style={{width: '1px', height: '5px'}}></div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center">
                            <noscript>
                              <div style={styles.errorLogin}>
                                <p>
                                  Внимание! Для работы с системой на Вашем браузере должна быть включена<br />
                                  поддержка работы JS скриптов.
                                  <br />
                                  <br />
                                  <a href="scripthelp.htm" style={styles.muted}>Подробнее...</a>
                                </p>
                              </div>
                            </noscript>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={styles.footerCell}>
                  <div style={styles.copyright}>
                    © Электронные Офисные Системы. Все права защищены, &nbsp;&nbsp;
                    <a href='http://www.eos.ru' style={styles.copyrightLink}>http://www.eos.ru</a>
                    <span style={styles.version}>версия 19.6</span>
                  </div>
                  <div id="traceDiv"></div>
                </td>
              </tr>
            </tbody>
          </table>

          {submitted && (
            <div style={styles.educationalAlert}>
              <h3>⚠️ Учебное предупреждение</h3>
              <p>Это демонстрация фишинговой атаки. В реальной ситуации введенные учетные данные были бы перехвачены злоумышленниками.</p>
            </div>
          )}
        </form>
      </div>

      {/* Обучающая информация */}
      {showEducation && (
        <div style={styles.educationOverlay}>
          <div style={styles.educationContent}>
            <h2>🎯 Вы стали жертвой учебной фишинг-атаки!</h2>
            
            <div style={styles.warningSection}>
              <h3>Как распознать фишинг на примере этой страницы:</h3>
              <ul>
                <li>✅ <strong>Проверяйте адресную строку:</strong> Должно быть <strong>https://delo.sovrnhmao.ru</strong></li>
                <li>✅ <strong>Обращайте внимание на SSL-сертификат:</strong> Настоящий сайт имеет зеленый замок</li>
                <li>✅ <strong>Проверяйте логотипы и оформление:</strong> Фишинговые сайты часто имеют мелкие отличия</li>
                <li>✅ <strong>Не переходите по ссылкам из писем:</strong> Вводите адрес вручную или используйте закладки</li>
                <li>✅ <strong>Проверяйте отправителя:</strong> Официальные письма приходят с корпоративных доменов</li>
              </ul>
            </div>

            <div style={styles.realSiteInfo}>
              <h3>Настоящий сайт системы "ДЕЛО-Web":</h3>
              <p><strong>Официальный адрес:</strong> https://delo.sovrnhmao.ru</p>
              <p><strong>Разработчик:</strong> Электронные Офисные Системы (http://www.eos.ru)</p>
              <p><strong>Телефон поддержки:</strong> Уточните у вашего системного администратора</p>
            </div>

            <div style={styles.securityRecommendations}>
              <h3>Что делать если вы подозреваете фишинг:</h3>
              <ul>
                <li>Никогда не вводите учетные данные на подозрительных страницах</li>
                <li>Немедленно сообщите о подозрительном сайте в отдел информационной безопасности</li>
                <li>Проверьте адрес через официальные источники вашей организации</li>
                <li>Используйте двухфакторную аутентификацию где это возможно</li>
                <li>Регулярно меняйте пароли и не используйте один пароль для разных систем</li>
              </ul>
            </div>

            <button onClick={handleBack} style={styles.backButton}>
              ← Вернуться к безопасному обучению
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ОБНОВЛЕННЫЕ СТИЛИ С УВЕЛИЧЕННЫМИ РАЗМЕРАМИ
const styles = {
  phishingPage: {
    fontFamily: 'Verdana, Geneva, Arial, Helvetica, sans-serif',
    width: '100%',
    height: '100vh',
    margin: 0,
    padding: 0,
    background: 'white',
    position: 'relative',
  },
  phishingWarning: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: '#ffeb3b',
    color: '#d32f2f',
    padding: '10px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: 1000,
    borderBottom: '2px solid #f44336',
  },
  deloWebPage: {
    width: '100%',
    height: '100%',
  },
  deloWebForm: {
    width: '100%',
    height: '100%',
  },
  mainTable: {
    width: '100%',
    height: '100vh',
    borderCollapse: 'collapse',
  },
  menuLogo: {
    padding: '20px',
    textAlign: 'left',
  },
  logoContainer: {
    width: '200px',
    height: '60px',
    position: 'relative',
  },
  mainLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  textLogoFallback: {
    width: '200px',
    height: '60px',
    background: '#f0f0f0',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4074A4',
    fontWeight: 'bold',
    fontSize: '20px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  contentCell: {
    height: '100%',
    verticalAlign: 'middle',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 200px)',
    width: '100%',
  },
  loginContent: {
    margin: '0 auto',
  },
  headerTable: {
    width: '250pt', // Увеличил ширину для больших логотипов
    textAlign: 'center',
  },
  logoCell: {
    width: '80pt', // Увеличил ширину ячейки для EOS логотипа
    verticalAlign: 'top',
  },
  smallLogoContainer: {
    width: '70px', // УВЕЛИЧИЛ с 40px до 70px
    height: '70px', // УВЕЛИЧИЛ с 40px до 70px
    position: 'relative',
  },
  smallLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  smallLogoFallback: {
    width: '70px', // УВЕЛИЧИЛ с 40px до 70px
    height: '70px', // УВЕЛИЧИЛ с 40px до 70px
    background: '#f0f0f0',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontWeight: 'bold',
    fontSize: '16px', // Увеличил шрифт
  },
  textLeft: {
    textAlign: 'left',
    verticalAlign: 'top',
  },
  h1: {
    fontWeight: 'bold',
    color: '#4074A4',
    fontSize: '140%', // Увеличил шрифт заголовка
    margin: '0',
    marginLeft: '10pt',
    marginBottom: '8pt', // Увеличил отступ
    marginTop: '12pt', // Увеличил отступ
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  textLogoContainer: {
    width: '180px', // УВЕЛИЧИЛ с 120px до 180px
    height: '45px', // УВЕЛИЧИЛ с 30px до 45px
    position: 'relative',
  },
  textLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  textLogoTextFallback: {
    width: '180px', // УВЕЛИЧИЛ с 120px до 180px
    height: '45px', // УВЕЛИЧИЛ с 30px до 45px
    background: '#f0f0f0',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4074A4',
    fontWeight: 'bold',
    fontSize: '18px', // Увеличил шрифт
  },
  formTable: {
    width: '350pt', // Увеличил ширину формы
    backgroundColor: 'White',
    paddingTop: '15pt', // Увеличил отступ
    border: '1px solid #E2E3E3',
    textAlign: 'center',
    verticalAlign: 'middle',
    margin: '25px auto', // Увеличил отступ
  },
  tagCell: {
    fontWeight: 'bold',
    fontSize: '80%', // Увеличил шрифт
    textAlign: 'right',
    color: '#4074A4',
    padding: '3px', // Увеличил отступ
  },
  inputCell: {
    width: '99%',
    textAlign: 'left',
  },
  input: {
    width: '90%', // Увеличил ширину поля ввода
    border: '1px solid Gray',
    fontSize: '12pt', // Увеличил шрифт
    padding: '6px 10px', // Увеличил отступы
    fontFamily: 'Verdana, Geneva, Arial, Helvetica, sans-serif',
  },
  submitBtn: {
    fontSize: '13px', // Увеличил шрифт
    padding: '6px 16px', // Увеличил отступы
    background: '#4074A4',
    color: 'white',
    border: '1px solid #2459A1',
    cursor: 'pointer',
    fontFamily: 'Verdana, Geneva, Arial, Helvetica, sans-serif',
  },
  errorLogin: {
    fontSize: 'smaller',
    color: 'Red',
    marginTop: '20pt',
    marginLeft: '10pt',
    fontWeight: 'bold',
  },
  muted: {
    color: '#024c9a',
    textDecoration: 'none',
  },
  footerCell: {
    verticalAlign: 'bottom',
    textAlign: 'left',
  },
  copyright: {
    fontSize: '9px',
    marginTop: '60px',
    marginLeft: '16px',
    marginBottom: '20px',
    color: '#666',
    fontFamily: 'Verdana, Geneva, Arial, Helvetica, sans-serif',
  },
  copyrightLink: {
    color: '#024c9a',
    textDecoration: 'none',
  },
  version: {
    float: 'right',
    marginRight: '2em',
  },
  educationalAlert: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '6px',
    padding: '20px',
    color: '#856404',
    zIndex: 1000,
    maxWidth: '500px',
    textAlign: 'center',
  },
  educationOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  educationContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  warningSection: {
    marginBottom: '20px',
  },
  realSiteInfo: {
    marginBottom: '20px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  securityRecommendations: {
    marginBottom: '20px',
  },
  backButton: {
    padding: '12px 24px',
    background: '#1a1a1a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
};

export default PhishingExample;