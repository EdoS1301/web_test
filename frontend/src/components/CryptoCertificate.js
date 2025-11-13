import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadCertificate = async (userData, courseStats, certificateType) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ru-RU');
  const currentYear = currentDate.getFullYear();
  
  const skziName = certificateType === 'cryptopro' 
    ? 'Крипто Про CSP' 
    : 'ViPNet Client';
  
  const skziFullName = certificateType === 'cryptopro'
    ? 'СКЗИ Крипто Про CSP'
    : 'СКЗИ ViPNet Client';

  // Создаем временный элемент для рендеринга
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '210mm';
  tempDiv.style.background = 'white';
  tempDiv.style.padding = '15mm';
  tempDiv.style.fontFamily = 'Times New Roman, Times, serif';
  tempDiv.style.fontSize = '12px';
  tempDiv.style.lineHeight = '1.2'; // Уменьшенный межстрочный интервал
  
  tempDiv.innerHTML = `
    <div class="document" style="max-width: 210mm; margin: 0 auto;">
      <div class="approval" style="text-align: right; margin-bottom: 30px; font-size: 11px; line-height: 1.1;">
        УТВЕРЖДАЮ<br>
        Министр цифрового развития,<br>
        информационных и телекоммуникационных<br>
        технологий Республики Адыгея<br>
        _____________________ З.Ю. Шу<br>
        «____»_____________${currentYear}
      </div>
      
      <div style="height: 20px;"></div>
      
      <div class="title" style="font-size: 14px; font-weight: bold; text-align: center; margin: 20px 0; text-transform: uppercase;">
        ЗАКЛЮЧЕНИЕ
      </div>
      <div style="text-align: center; margin-bottom: 20px; font-size: 11px;">
        о допуске пользователя СКЗИ к самостоятельной работе
      </div>
      
      <div class="user-info" style="margin: 15px 0; text-align: justify; font-size: 11px; line-height: 1.2;">
        Пользователь СКЗИ <strong>${userData.full_name || userData.email}</strong>, 
        ${userData.department || 'сотрудник'}, в соответствии с Инструкцией об организации 
        и обеспечении безопасности хранения, обработки и передачи по каналам связи 
        с использованием средств криптографической защиты информации с ограниченным 
        доступом, не содержащей сведений, составляющих государственную тайну, 
        утвержденной Приказом ФАПСИ при Президенте РФ от 13.06.2001 № 152 при 
        использовании ${skziFullName} обязуется:
      </div>
      
      <div class="obligations" style="margin: 15px 0;">
        <div class="obligation-item" style="margin: 4px 0; text-align: justify; font-size: 11px; line-height: 1.2;">- не разглашать конфиденциальную информацию, к которой допущен, рубежи ее защиты, в том числе, сведения о криптоключах;</div>
        <div class="obligation-item" style="margin: 4px 0; text-align: justify; font-size: 11px; line-height: 1.2;">- соблюдать требования к обеспечению безопасности конфиденциальной информации с использованием СКЗИ;</div>
        <div class="obligation-item" style="margin: 4px 0; text-align: justify; font-size: 11px; line-height: 1.2;">- сообщать в орган криптографической защиты о ставших ему известными попытках посторонних лиц получить сведения об используемых СКЗИ или ключевых документах к ним;</div>
        <div class="obligation-item" style="margin: 4px 0; text-align: justify; font-size: 11px; line-height: 1.2;">- сдать СКЗИ, эксплуатационную и техническую документацию к ним, ключевые документы в соответствии с установленным порядком при увольнении или отстранении от обязанностей, связанных с использованием СКЗИ;</div>
        <div class="obligation-item" style="margin: 4px 0; text-align: justify; font-size: 11px; line-height: 1.2;">- немедленно уведомлять орган криптографической защиты о фактах утраты или недостачи СКЗИ, ключевых документов к ним, ключей от помещений, хранилищ (сейфов), личных печатей и о других фактах, которые могут привести к разглашению защищаемых сведений конфиденциального характера, а также о причины и условия возможной утечки таких сведений.</div>
      </div>
      
      <div class="conclusion" style="text-align: center; margin: 20px 0; font-weight: bold; font-size: 11px;">
        Заключение: к самостоятельной работе с ${skziFullName} допущен
      </div>
      
      <div class="content" style="font-size: 11px; line-height: 1.2;">
        <strong>Результат тестирования:</strong> ${courseStats.bestScore}% правильных ответов<br>
        <strong>Дата прохождения:</strong> ${formattedDate}
      </div>
      
      <div class="signatures" style="margin-top: 40px;">
        <div class="signature-block" style="margin: 15px 0;">
          <div class="signature-user" style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div class="signature-left" style="width: 40%; font-size: 11px;">
              С заключением ознакомлен(а): ___________________
            </div>
            <div class="signature-right" style="width: 55%; text-align: right; font-size: 11px;">
              ${userData.full_name || userData.email.split('@')[0]}
            </div>
          </div>
          <div style="text-align: center; font-size: 9px; margin-top: 2px;">
            (подпись обучающегося)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(фамилия, инициалы)
          </div>
        </div>
        
        <div class="signature-block" style="font-size: 11px;">
          <div>Представитель органа криптографической</div>
          <div>защиты информации Министерства</div>
          <div style="height: 30px;"></div>
          <div class="signature-line" style="border-top: 1px solid #000; margin: 20px 0 3px 0; padding-top: 3px;"></div>
          <div style="text-align: center; font-size: 9px;">(подпись)</div>
          <div style="height: 20px;"></div>
          <div class="signature-line" style="border-top: 1px solid #000; margin: 20px 0 3px 0; padding-top: 3px;"></div>
          <div style="text-align: center; font-size: 9px;">(ФИО)</div>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Конвертируем в canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels
      windowWidth: 794,
      windowHeight: 1123
    });

    // Создаем PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Добавляем изображение в PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    
    // Сохраняем PDF
    const fileName = `Заключение_${skziName}_${userData.full_name || userData.email.split('@')[0]}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: открываем в новом окне для печати
    const certificateHTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Заключение о допуске к работе с СКЗИ</title>
    <style>
        @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 15mm;
            padding: 0;
            background: white;
            color: black;
            font-size: 11px;
            line-height: 1.2;
        }
        .document { max-width: 210mm; margin: 0 auto; }
        .approval { text-align: right; margin-bottom: 20px; }
        .title { font-size: 14px; font-weight: bold; text-align: center; margin: 15px 0; }
        .user-info, .obligation-item { text-align: justify; margin: 8px 0; }
        .signature-line { border-top: 1px solid #000; margin: 15px 0 3px 0; }
    </style>
</head>
<body>
    <div class="document">
        ${tempDiv.innerHTML}
    </div>
    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">🖨️ Печать</button>
        <button onclick="window.close()">❌ Закрыть</button>
    </div>
    <script>window.onload = () => window.print();</script>
</body>
</html>`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
  } finally {
    // Удаляем временный элемент
    document.body.removeChild(tempDiv);
  }
};

const CryptoCertificate = ({ user, courseStats, onDownload }) => {
  const [selectedCertificate, setSelectedCertificate] = useState('cryptopro');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await downloadCertificate(user, courseStats, selectedCertificate);
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const hasPassedCourse = courseStats && courseStats.bestScore >= 70;

  if (!hasPassedCourse) {
    return (
      <div style={{
        background: '#fff3e0',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #ff9800',
        margin: '2rem 0',
        textAlign: 'center'
      }}>
        <h3>📄 Заключение о допуске к работе с СКЗИ</h3>
        <p>Для получения заключения необходимо успешно пройти тест по криптографической защите информации (не менее 70% правильных ответов).</p>
        <p>Ваш лучший результат: <strong>{courseStats?.bestScore || 0}%</strong></p>
        <button 
          onClick={() => window.location.href = '/crypto-course'}
          className="cta-button"
          style={{
            marginTop: '1rem',
            background: 'transparent',
            color: '#1a1a1a',
            border: '1px solid #1a1a1a'
          }}
        >
          📚 Повторить курс
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '2.5rem',
      borderRadius: '12px',
      border: '2px solid #4caf50',
      margin: '2rem 0',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ 
        color: '#2e7d32', 
        marginBottom: '1rem',
        fontSize: '1.5rem'
      }}>
        📄 Заключение о допуске к работе с СКЗИ
      </h3>

      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1.5rem 0',
        border: '1px solid #e0e0e0'
      }}>
        <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
          <strong>Слушатель:</strong> {user.full_name || user.email}
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>Курс:</strong> Криптографическая защита информации
        </p>
        <p style={{ margin: '0' }}>
          <strong>Результат:</strong> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{courseStats.bestScore}%</span> правильных ответов
        </p>
      </div>

      <div style={{
        background: '#e8f4fd',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1.5rem 0',
        border: '1px solid #2196f3'
      }}>
        <h4 style={{ color: '#1976d2', marginBottom: '1rem' }}>
          Выберите тип СКЗИ для заключения:
        </h4>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCertificate('cryptopro')}
            className="cta-button"
            style={{
              background: selectedCertificate === 'cryptopro' ? '#4caf50' : '#1a1a1a',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Крипто Про CSP
          </button>
          
          <button
            onClick={() => setSelectedCertificate('vipnet')}
            className="cta-button"
            style={{
              background: selectedCertificate === 'vipnet' ? '#4caf50' : '#1a1a1a',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ViPNet Client
          </button>
        </div>
        
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#1976d2',
          marginTop: '1rem',
          marginBottom: '0'
        }}>
          Выбран: <strong>{selectedCertificate === 'cryptopro' ? 'Крипто Про CSP' : 'ViPNet Client'}</strong>
        </p>
      </div>

      <p style={{ 
        fontSize: '0.95rem', 
        color: '#666',
        marginBottom: '1.5rem',
        lineHeight: '1.5'
      }}>
        Поздравляем с успешным завершением обучения! Скачайте официальное заключение, 
        подтверждающее ваш допуск к работе со средствами криптографической защиты информации.
      </p>
      
      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="cta-button"
        style={{
          background: isGenerating ? '#666' : '#1a1a1a',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderRadius: '8px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
        onMouseOver={(e) => {
          if (!isGenerating) {
            e.target.style.background = '#333';
            e.target.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseOut={(e) => {
          if (!isGenerating) {
            e.target.style.background = '#1a1a1a';
            e.target.style.transform = 'translateY(0)';
          }
        }}
      >
        {isGenerating ? '⏳ Генерация PDF...' : `📥 Скачать заключение для ${selectedCertificate === 'cryptopro' ? 'Крипто Про CSP' : 'ViPNet Client'}`}
      </button>
      
      <p style={{ 
        fontSize: '0.85rem', 
        color: '#888', 
        marginTop: '1rem',
        lineHeight: '1.4'
      }}>
        Файл будет скачан в формате PDF<br/>
      </p>
    </div>
  );
};

export default CryptoCertificate;