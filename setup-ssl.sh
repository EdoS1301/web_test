#!/bin/bash

MAIN_SERVER="192.168.168.11"
PROXY_SERVER="192.168.168.10"
USER="react"  # ЗАМЕНИТЕ на ваше имя пользователя

echo "=== Deploying SSL Infrastructure ==="

# 1. На основном сервере
echo "1. Setting up main server..."
ssh $USER@$MAIN_SERVER << 'EOF'
    sudo mkdir -p /etc/ssl/private /etc/ssl/certs
    sudo openssl genrsa -out /etc/ssl/private/nginx-selfsigned.key 2048
    sudo openssl req -new -x509 -days 3650 -nodes \
        -key /etc/ssl/private/nginx-selfsigned.key \
        -out /etc/ssl/certs/nginx-selfsigned.crt \
        -subj "/C=RU/ST=Moscow/L=Moscow/O=Company/OU=IT/CN=192.168.168.11"
    sudo chmod 600 /etc/ssl/private/nginx-selfsigned.key
    sudo chmod 644 /etc/ssl/certs/nginx-selfsigned.crt
    echo "Main server SSL setup completed"
EOF

# 2. На прокси-сервере  
echo "2. Setting up proxy server..."
ssh $USER@$PROXY_SERVER << 'EOF'
    sudo mkdir -p /etc/ssl/private /etc/ssl/certs
    sudo openssl genrsa -out /etc/ssl/private/nginx-selfsigned.key 2048
    sudo openssl req -new -x509 -days 3650 -nodes \
        -key /etc/ssl/private/nginx-selfsigned.key \
        -out /etc/ssl/certs/nginx-selfsigned.crt \
        -subj "/C=RU/ST=Moscow/L=Moscow/O=Company/OU=IT/CN=192.168.168.10"
    sudo chmod 600 /etc/ssl/private/nginx-selfsigned.key
    sudo chmod 644 /etc/ssl/certs/nginx-selfsigned.crt
    echo "Proxy server SSL setup completed"
EOF

# 3. Копируем сертификат основного сервера на прокси
echo "3. Copying main server certificate to proxy..."
scp $USER@$MAIN_SERVER:/etc/ssl/certs/nginx-selfsigned.crt /tmp/main-server.crt
scp /tmp/main-server.crt $USER@$PROXY_SERVER:/tmp/main-server.crt

ssh $USER@$PROXY_SERVER "sudo mv /tmp/main-server.crt /etc/ssl/certs/main-server.crt && sudo chmod 644 /etc/ssl/certs/main-server.crt"

# 4. Очистка
rm /tmp/main-server.crt

echo "=== SSL Infrastructure Deployment Complete ==="
echo "Main server: https://$MAIN_SERVER"
echo "Proxy server: https://$PROXY_SERVER"
