#!/bin/bash
set -e

echo "=== ПОЛНАЯ ПОДГОТОВКА ДЛЯ ОФФЛАЙН РАБОТЫ ==="

# 1. Сначала скачаем все базовые образы
echo "1. Скачивание базовых образов..."
docker pull python:3.11-slim
docker pull node:18-alpine
docker pull nginx:alpine
docker pull postgres:15

# 2. Собираем наши кастомные образы
echo "2. Сборка кастомных образов..."
docker compose build

# 3. Запускаем и тестируем
echo "3. Тестовый запуск..."
docker compose up -d
sleep 10

# 4. Проверяем работу
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend работает"
else
    echo "⚠️ Frontend не отвечает"
fi

docker compose down

# 5. Сохраняем ВСЕ образы которые могут понадобиться
echo "5. Сохранение всех образов..."
docker save -o all-docker-images.tar \
  python:3.11-slim \
  node:18-alpine \
  nginx:alpine \
  postgres:15 \
  $(docker images --filter "reference=*web_test*" --format "{{.Repository}}:{{.Tag}}")

echo "6. Создание оффлайн конфигурации..."
cat > docker-compose.offline.yml << 'EOF'
services:
  backend:
    image: web_test-backend
    env_file:
      - .env
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    expose:
      - "8000"
    depends_on:
      - db
    environment:
      - DEBUG=False
    restart: unless-stopped

  frontend:
    image: web_test-frontend
    ports:
      - "3000:80"
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
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
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

# 7. Создаем архив
echo "7. Создание архива..."
tar -czf complete-offline-project.tar.gz \
  all-docker-images.tar \
  docker-compose.offline.yml \
  .env \
  nginx.conf

echo "8. Проверка..."
echo "✅ Размер архива: $(du -h complete-offline-project.tar.gz | cut -f1)"
echo "✅ Образы в архиве:"
docker images | grep -E "(web_test|python|node|nginx|postgres)"

echo ""
echo "=== ГОТОВО! ==="
echo "1. Перенесите complete-offline-project.tar.gz на сервер"
echo "2. Распакуйте: tar -xzf complete-offline-project.tar.gz"
echo "3. Загрузите образы: docker load -i all-docker-images.tar"
echo "4. Запустите: docker compose -f docker-compose.offline.yml up -d"
