FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Копируем React build в правильную директорию
COPY --from=frontend-builder /app/frontend/build /app/staticfiles/frontend/

# Копируем скрипт создания суперпользователя
COPY create_superuser.py .

# Создаем директории для статики
RUN mkdir -p staticfiles media

EXPOSE 8000

CMD ["sh", "-c", "python manage.py makemigrations api && python manage.py migrate && python create_superuser.py && python manage.py collectstatic --noinput && gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3"]