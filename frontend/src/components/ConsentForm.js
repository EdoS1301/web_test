// components/ConsentForm.js
import React from 'react';

const ConsentForm = ({ user, logout }) => {
  const handleBack = () => {
    window.history.back();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {user && <Header user={user} logout={logout} />}
      <main className="main" style={!user ? { marginTop: '0' } : {}}>
        <div className="container">
          <div className="policy-container">
            <div className="consent-header" style={{textAlign: 'center', marginBottom: '2rem'}}>
              <h1>СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАТНЫХ</h1>
              <p style={{color: '#666', fontStyle: 'italic'}}>
                Форма согласно требованиям Федерального закона от 27.07.2006 № 152-ФЗ
              </p>
            </div>

            <div className="consent-content" style={{lineHeight: '1.6'}}>
              <div style={{marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <p style={{margin: 0, textAlign: 'center', fontWeight: 'bold'}}>
                  ____________________________<br />
                  ____________________________
                </p>
              </div>

              <p>
                Я, <strong>____________________________</strong>, 
                настоящим свободно, своей волей и в своем интересе даю согласие 
                <strong> ____________________________</strong> (далее — Оператор) 
                на обработку своих персональных данных, указанных при регистрации 
                в системе обучения по противодействию фишингу, на следующих условиях:
              </p>

              <h3>1. Перечень персональных данных, на обработку которых дается согласие:</h3>
              <ul>
                <li>Фамилия, имя, отчество</li>
                <li>Адрес электронной почты</li>
                <li>Наименование организации/учреждения</li>
                <li>Отдел/подразделение</li>
                <li>Результаты прохождения обучения и тестирования</li>
                <li>Технические данные (IP-адрес, информация из cookie-файлов, данные о браузере и устройстве)</li>
              </ul>

              <h3>2. Цели обработки персональных данных:</h3>
              <ul>
                <li>регистрации и идентификации в системе обучения по противодействию фишингу;</li>
                <li>предоставления доступа к учебным материалам и тестовым заданиям;</li>
                <li>оценки результатов обучения и тестирования;</li>
                <li>формирования статистической отчетности по результатам обучения;</li>
                <li>мониторинга эффективности программы обучения;</li>
                <li>выполнения требований законодательства Российской Федерации.</li>
              </ul>

              <h3>3. Перечень действий с персональными данными:</h3>
              <p>
                Обработка персональных данных будет осуществляться путем сбора, записи, систематизации, 
                накопления, хранения, уточнения (обновления, изменения), извлечения, использования, 
                передачи (распространения, предоставления, доступа), обезличивания, блокирования, 
                удаления, уничтожения персональных данных.
              </p>

              <h3>4. Способы обработки персональных данных:</h3>
              <p>
                Обработка персональных данных осуществляется как с использованием средств автоматизации, 
                так и без использования таких средств.
              </p>

              <h3>5. Обработка персональных данных третьими лицами:</h3>
              <p>
                Настоящим я даю согласие на передачу моих персональных данных следующим третьим лицам 
                для целей, указанных в настоящем согласии: [указать при наличии]. 
                Оператор гарантирует, что третьи лица обеспечивают конфиденциальность и безопасность 
                передаваемых персональных данных.
              </p>

              <h3>6. Срок действия согласия:</h3>
              <p>
                Согласие действует с момента его подписания и в течение 3 (трех) лет с даты 
                последнего взаимодействия с системой обучения. По истечении указанного срока 
                согласие считается отозванным.
              </p>

              <h3>7. Порядок отзыва согласия:</h3>
              <p>
                Я оставляю за собой право отозвать настоящее согласие в любое время путем 
                направления письменного заявления по адресу: [Юридический адрес оператора] 
                или на адрес электронной почты: ____________________________. 
                В случае отзыва согласия Оператор обязан прекратить обработку персональных данных 
                и уничтожить персональные данные в срок, не превышающий 30 (тридцати) дней с даты 
                поступления указанного отзыва.
              </p>

              <h3>8. Последствия отзыва согласия на обработку персональных данных:</h3>
              <p>
                В случае отзыва субъектом персональных данных согласия на обработку персональных данных 
                Оператор вправе продолжить обработку персональных данных без согласия субъекта 
                персональных данных при наличии оснований, указанных в Федеральном законе № 152-ФЗ.
              </p>

              <div className="legal-notice" style={{
                backgroundColor: '#fff3cd',
                padding: '1rem',
                borderRadius: '8px',
                margin: '1.5rem 0',
                border: '1px solid #ffeaa7',
                color: '#856404'
              }}>
                <p style={{margin: 0, fontSize: '0.9rem'}}>
                  <strong>Важное уведомление:</strong> Настоящее согласие предоставляется 
                  в соответствии с требованиями статьи 9 Федерального закона от 27.07.2006 № 152-ФЗ 
                  «О персональных данных». Отказ в предоставлении согласия может повлечь 
                  невозможность использования системы обучения по противодействию фишингу.
                </p>
              </div>

              <div className="signature-block" style={{
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '2px solid #1a1a1a'
              }}>
                <div style={{marginBottom: '2rem'}}>
                  <p><strong>С условиями обработки персональных данных ознакомлен(а):</strong></p>
                  
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                    <div style={{width: '20px', height: '20px', border: '2px solid #1a1a1a', marginRight: '10px'}}></div>
                    <span>Полностью согласен(на) со всеми условиями обработки персональных данных</span>
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                    <div style={{width: '20px', height: '20px', border: '2px solid #1a1a1a', marginRight: '10px'}}></div>
                    <span>Ознакомлен(а) с Политикой обработки персональных данных Оператора</span>
                  </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                  <div style={{flex: '1', minWidth: '200px', marginBottom: '1rem'}}>
                    <p>_________________________</p>
                    <p style={{marginTop: '-10px', fontSize: '0.9rem'}}>(Подпись)</p>
                  </div>
                  <div style={{flex: '1', minWidth: '200px', marginBottom: '1rem', textAlign: 'center'}}>
                    <p>_________________________</p>
                    <p style={{marginTop: '-10px', fontSize: '0.9rem'}}>(Фамилия И.О.)</p>
                  </div>
                  <div style={{flex: '1', minWidth: '200px', marginBottom: '1rem'}}>
                    <p>«______» ________________ 20___ г.</p>
                    <p style={{marginTop: '-10px', fontSize: '0.9rem'}}>(Дата)</p>
                  </div>
                </div>
              </div>

              <div className="operator-info" style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem',
                border: '1px solid #e5e5e5'
              }}>
                <h4 style={{marginBottom: '1rem', color: '#1a1a1a'}}>Реквизиты Оператора:</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem'}}>
                  <div>
                    <strong>Наименование:</strong><br />
                    ____________________________
                  </div>
                  <div>
                    <strong>Юридический адрес:</strong><br />
                    ____________________________
                  </div>
                  <div>
                    <strong>ИНН:</strong> _______________________<br />
                    <strong>КПП:</strong> _______________________
                  </div>
                  <div>
                    <strong>ОГРН:</strong> ________________________<br />
                    <strong>Телефон:</strong> ________________________
                  </div>
                  <div>
                    <strong>Email:</strong> ____________________________<br />
                    <strong>Ответственное лицо:</strong> ____________________________
                  </div>
                </div>
              </div>

              <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#e8f4fd', borderRadius: '8px'}}>
                <h4 style={{color: '#0568c7', marginBottom: '1rem'}}>Примечание:</h4>
                <p style={{margin: 0, fontSize: '0.9rem'}}>
                  Данная форма согласия разработана в соответствии с требованиями 
                  Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» 
                  и рекомендациями Министерства цифрового развития, связи и массовых коммуникаций Российской Федерации.
                </p>
              </div>
            </div>

            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap'}}>
              <button onClick={handlePrint} className="cta-button" style={{marginRight: '1rem'}}>
                🖨️ Распечатать форму согласия
              </button>
              <button onClick={handleBack} className="back-button">
                ← Вернуться к политике
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ConsentForm;