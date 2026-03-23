#!/bin/bash

cd /app || exit

docker compose stop nginx

sudo certbot renew --standalone

sudo cp /etc/letsencrypt/live/lephuchau.io.vn/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/lephuchau.io.vn/privkey.pem nginx/ssl/

sudo chown -R $USER:$USER nginx/ssl

docker compose start nginx
