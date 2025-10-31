#!/bin/bash
set -e

echo "=== ПОДГОТОВКА ДЛЯ ОФФЛАЙН РАБОТЫ ==="

# 1. Скачиваем базовые образы
echo "1. Скачивание базовых образов..."
docker pull python:3.11-slim
docker pull node:18-alpine
docker pull nginx:alpine
docker pull postgres:15

# 2. Собираем кастомные образы
echo "2. Сборка кастомных образов..."
docker compose build

# 3. Создаем скрипт для генерации сертификатов
echo "3. Создание скрипта generate-cert.sh..."
cat > generate-cert.sh << 'EOF'
#!/bin/bash
set -e

echo "=== ГЕНЕРАЦИЯ SSL СЕРТИФИКАТОВ ==="

# Создаем директории проекта
mkdir -p .ssl/private .ssl/certs

# Генерируем сертификат
openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
    -keyout .ssl/private/nginx.key \
    -out .ssl/certs/nginx.crt \
    -subj "/C=RU/ST=Adygheya/L=Adygheya/O=MinCifra/CN=localhost"

echo "✅ SSL сертификаты созданы в проекте:"
echo "   - .ssl/certs/nginx.crt"
echo "   - .ssl/private/nginx.key"

# Копируем на прокси-сервер если указан
if [ -n "$PROXY_SERVER" ]; then
    echo "Копируем сертификаты на прокси-сервер: $PROXY_SERVER"
    scp .ssl/certs/nginx.crt $PROXY_SERVER:/etc/ssl/certs/nginx.crt
    scp .ssl/private/nginx.key $PROXY_SERVER:/etc/ssl/private/nginx.key
    ssh $PROXY_SERVER "chmod 600 /etc/ssl/private/nginx.key && chmod 644 /etc/ssl/certs/nginx.crt"
    echo "✅ Сертификаты скопированы на прокси-сервер"
else
    echo "ℹ️  Чтобы скопировать на прокси-сервер, установи переменную:"
    echo "    export PROXY_SERVER=user@proxy-server-ip"
fi
EOF

chmod +x generate-cert.sh

# 4. Тестовый запуск
echo "4. Тестовый запуск..."
docker compose up -d
sleep 10

# 5. Проверяем работу
if curl -k -f https://localhost/health >/dev/null 2>&1; then
    echo "✅ Приложение работает"
else
    echo "⚠️ Приложение не отвечает"
fi

docker compose down

# 6. Сохраняем образы
echo "6. Сохранение Docker образов..."
docker save -o docker-images.tar \
  python:3.11-slim \
  node:18-alpine \
  nginx:alpine \
  postgres:15 \
  $(docker images --filter "reference=*web_test*" --format "{{.Repository}}:{{.Tag}}")

# 7. Создаем оффлайн docker-compose.yml
echo "7. Создание оффлайн docker-compose.yml..."
cat > docker-compose-offline.yml << 'EOF'
services:
  backend:
    image: web_test-backend
    env_file:
      - .env
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
      - ./backend/backend/settings.py:/app/backend/settings.py:rw
    expose:
      - "8000"
    depends_on:
      - db
    environment:
      - DEBUG=False
    restart: unless-stopped

  frontend:
    image: web_test-frontend
    restart: unless-stopped

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./.ssl/certs/nginx.crt:/etc/ssl/certs/nginx.crt:ro
      - ./.ssl/private/nginx.key:/etc/ssl/private/nginx.key:ro
      - static_volume:/app/staticfiles:ro
      - media_volume:/app/media:ro
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
  static_volume:
  media_volume:
EOF

# 8. Создаем архив
echo "8. Создание архива..."
tar -czf offline-project.tar.gz \
  docker-images.tar \
  docker-compose-offline.yml \
  nginx.conf \
  .env \
  backend/backend/settings.py \
  generate-cert.sh

echo "9. Проверка..."
echo "✅ Размер архива: $(du -h offline-project.tar.gz | cut -f1)"

echo ""
echo "=== ГОТОВО! ==="
echo "1. Перенесите offline-project.tar.gz на сервер"
echo "2. Распакуйте: tar -xzf offline-project.tar.gz"
echo "3. Загрузите образы: docker load -i docker-images.tar"
echo "4. Сгенерируйте SSL: ./generate-cert.sh"
echo "5. Запустите: docker compose -f docker-compose-offline.yml up -d"
echo ""
echo "ℹ️  Для копирования на прокси-сервер:"
echo "    export PROXY_SERVER=user@192.168.168.10"
echo "    ./generate-cert.sh"