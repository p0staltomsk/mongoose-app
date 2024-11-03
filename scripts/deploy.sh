#!/bin/bash

# Остановить все контейнеры
docker-compose down

# Очистить старые сборки
rm -rf dist/*

# Установить зависимости
pnpm install

# Собрать приложение
pnpm build

# Запустить контейнеры
docker-compose up -d

# Проверить статус
docker ps

# Показать логи
docker logs periodic-api -f 