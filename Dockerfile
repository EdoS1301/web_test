# Stage 1: Frontend build
FROM node:18-alpine as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Frontend production (отдельный контейнер)
FROM nginx:alpine as frontend-production
COPY --from=frontend-build /app/build /usr/share/nginx/html
EXPOSE 80

# Stage 3: Backend
FROM python:3.11-slim as backend
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
RUN mkdir -p staticfiles media
EXPOSE 8000
CMD ["sh", "-c", "python manage.py makemigrations api && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3"]