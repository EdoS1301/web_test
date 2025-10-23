## Технологии

- **Backend**: Django 4.2, PostgreSQL, Gunicorn
- **Frontend**: React 18, React Router
- **Web Server**: Nginx
- **Containerization**: Docker, Docker Compose

## Предварительные требования

### Установка Docker и Docker Compose

#### Для Windows:
1. Скачайте Docker Desktop с официального сайта: https://www.docker.com/products/docker-desktop/
2. Запустите установщик и следуйте инструкциям
3. После установки запустите Docker Desktop

#### Для Linux (Ubuntu/Debian):

## Установка Docker
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

## Добавление пользователя в группу docker
sudo usermod -aG docker $USER

## Установка Docker Compose
sudo apt install docker-compose-plugin


#### Для Linux (Astra):

## Добавление GPG ключа Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

## Добавление репозитория Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

## Запуск и включение Docker
sudo systemctl start docker
sudo systemctl enable docker

## Добавление пользователя в группу docker (чтобы не использовать sudo)
sudo usermod -aG docker $USER

## Перезапустите терминал или выполните:
newgrp docker

docker --version
docker-compose --version

git clone <https://github.com/EdoS1301/web_test.git>
cd phishing-course

## настройка env
DEBUG=True
DJANGO_SECRET_KEY=добавь уникальный_ключ
ALLOWED_HOSTS=localhost,127.0.0.1,web,nginx

DB_NAME=myapp
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=db
DB_PORT=5432

REACT_APP_API_URL=http://localhost:8000/api



## Сборка и запуск всех контейнеров
docker-compose up --build

## Или для запуска в фоновом режиме
docker-compose up -d --build

## Просмотр статуса контейнеров
docker-compose ps

## Просмотр логов
docker-compose logs
docker-compose logs web
docker-compose logs nginx
docker-compose logs db

## Остановка приложения
docker-compose down

## Перезапуск приложения
docker-compose restart

## Создание суперпользователя Django
docker-compose exec web python manage.py createsuperuser


### Остановка с сохранением данных
docker-compose down

### Полная остановка с удалением данных (для разработки лучше так)
docker-compose down -v