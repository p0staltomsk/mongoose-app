#!/bin/bash

PROJECT_DIR="/var/www/html/mongoose-app"

# Проверяем существование директории
[ ! -d "$PROJECT_DIR" ] && echo "Error: Directory $PROJECT_DIR does not exist!" && exit 1

# Меняем права только для основных файлов проекта, исключая node_modules и .pnpm-store
find $PROJECT_DIR \
    -not \( -path "$PROJECT_DIR/node_modules*" -prune \) \
    -not \( -path "$PROJECT_DIR/.pnpm-store*" -prune \) \
    -exec sudo chown $USER:$USER {} \+

# Устанавливаем базовые права для директорий, исключая node_modules и .pnpm-store
find $PROJECT_DIR \
    -not \( -path "$PROJECT_DIR/node_modules*" -prune \) \
    -not \( -path "$PROJECT_DIR/.pnpm-store*" -prune \) \
    -type d -exec sudo chmod 755 {} \+

# Устанавливаем базовые права для файлов, исключая node_modules и .pnpm-store
find $PROJECT_DIR \
    -not \( -path "$PROJECT_DIR/node_modules*" -prune \) \
    -not \( -path "$PROJECT_DIR/.pnpm-store*" -prune \) \
    -type f -exec sudo chmod 644 {} \+

# Только необходимые директории для записи
sudo chmod 777 $PROJECT_DIR/dist
sudo chmod 777 $PROJECT_DIR/.next
sudo chmod 777 $PROJECT_DIR/public

# Особые права для node_modules (без рекурсии)
sudo chmod 777 $PROJECT_DIR/node_modules

# SELinux проверка и настройка только для критичных директорий
if command -v getenforce >/dev/null 2>&1; then
    if [ "$(getenforce)" != "Disabled" ]; then
        sudo chcon -t httpd_sys_rw_content_t $PROJECT_DIR/dist
        sudo chcon -t httpd_sys_rw_content_t $PROJECT_DIR/.next
        sudo chcon -t httpd_sys_rw_content_t $PROJECT_DIR/public
        sudo chcon -t httpd_sys_rw_content_t $PROJECT_DIR/node_modules
    fi
fi

echo "Permissions fixed successfully!"