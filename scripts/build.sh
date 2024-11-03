#!/bin/bash

# Очистить dist
rm -rf dist

# Установить зависимости
pnpm install

# Собрать API
pnpm build:api

# Собрать клиент
pnpm build:client

# Запустить контейнеры
docker-compose down
docker-compose up -d

# Показать статус
docker ps 