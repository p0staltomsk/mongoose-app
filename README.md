# 3D Periodic Table Visualization 🌌

Интерактивная 3D визуализация периодической таблицы с возможностью создания пользовательских элементов.

## 🚀 Tech Stack

### Frontend
- **React 18** с TypeScript
- **Three.js** для 3D визуализации
- **Vite** для разработки
- **TailwindCSS** для стилей
- **TWEEN.js** для анимаций

### Backend
- **Python** с Flask
- **Flask-CORS** для CORS
- **PyMongo** для работы с MongoDB
- **Logging** для отладки

### Database
- **MongoDB** - основная БД
- **Mongo Express** - админ панель

### Infrastructure
- **Docker** + docker-compose
- **Nginx** для production
- **Python 3.11** в Alpine контейнере

## 🏗 Архитектура

```
project/
├── src/
│   ├── api/              # Flask API
│   ├── components/       # React компоненты
│   │   ├── ui/          # UI компоненты
│   │   └── 3d/          # Three.js компоненты
│   ├── data/            # Статичные данные
│   ├── styles/          # CSS стили
│   └── types/           # TypeScript типы
├── docker/              # Docker конфигурация
└── scripts/             # Скрипты для деплоя
```

## 🔧 API Endpoints

```
POST /api/elements
- Создание нового элемента
- Payload: { name: string, expiresAt?: Date, isPermanent?: boolean }

GET /api/elements
- Получение всех элементов

GET /health
- Проверка работоспособности API
```

## 📦 MongoDB Schema

```typescript
Element {
  name: string,          // Название элемента
  symbol: string,        // Первые 2 буквы названия
  mass: string,          // "???" по умолчанию
  number: number,        // >118, автоинкремент
  createdAt: Date,      // Дата создания
  expiresAt: Date,      // TTL для временных элементов
  isPermanent: boolean  // Флаг постоянного элемента
}
```

## 🛠 Development Setup

1. Установка зависимостей:
```bash
# Frontend
pnpm install

# Backend
pip install -r requirements.txt
```

2. Запуск инфраструктуры:
```bash
docker-compose up -d
```

3. Запуск для разработки:
```bash
# Frontend - http://localhost:5173
pnpm dev

# Backend - http://localhost:4567
python src/api/main.py

# MongoDB Admin - http://localhost:8082
```

## 🚀 Production Deployment

1. Сборка:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Запуск:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔍 Логирование

- Flask логирует все операции с БД
- Vite логирует прокси-запросы
- MongoDB логи доступны через mongo-express

## 🔒 Security

- CORS настроен для разработки
- MongoDB защищена авторизацией
- Nginx настроен с security headers

## 📈 Мониторинг

- Health check endpoint
- MongoDB метрики
- Docker healthcheck

## 🎯 Особенности реализации

- Автоматическое удаление временных элементов через MongoDB TTL индекс
- Генерация символов из названия элемента
- Автоинкремент номеров элементов
- Поддержка постоянных и временных элементов