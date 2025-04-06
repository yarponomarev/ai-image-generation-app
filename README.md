## Веб-приложение для генерации изображений.

### Описание проекта

Это современное веб-приложение, построенное на Next.js 14, которое позволяет генерировать изображения с использованием различных AI-моделей. Приложение поддерживает интеграцию с несколькими AI-провайдерами и предоставляет удобный интерфейс для работы с ними.

### Основные возможности

- Генерация изображений с использованием различных AI-моделей
- Интеграция с OpenAI, Anthropic и Replicate
- Аутентификация пользователей через Firebase
- Хранение данных в Firebase Database и Storage
- Транскрибация аудио с помощью Deepgram
- Современный UI с использованием TailwindCSS
- Поддержка потоковой передачи ответов от AI-моделей

### Структура проекта

```
src/
├── app/                 # Next.js App Router
│   ├── api/             # API маршруты
│   │   ├── openai/      # OpenAI интеграция
│   │   ├── anthropic/   # Anthropic интеграция
│   │   ├── replicate/   # Replicate интеграция
│   │   └── deepgram/    # Deepgram интеграция
│   ├── components/      # React компоненты
│   └── lib/             # Вспомогательные модули
│       ├── contexts/    # React контексты
│       ├── hooks/       # Пользовательские хуки
│       └── firebase/    # Firebase конфигурация
```

### Начало работы

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local` в корне проекта и добавьте необходимые переменные окружения:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
REPLICATE_API_KEY=
DEEPGRAM_API_KEY=
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

### Используемые технологии

- **Frontend:**
  - Next.js 14 с App Router
  - React
  - TailwindCSS
  - Vercel AI SDK

- **Backend:**
  - Firebase (Auth, Storage, Database)
  - OpenAI API
  - Anthropic API
  - Replicate API
  - Deepgram API

### Дополнительная информация

Для создания нового проекта используйте шаблоны в папке `/paths`. Вы можете настроить подсказки Path в соответствии с вашими потребностями.

Все AI-интеграции уже настроены и готовы к использованию. Вы можете выбрать нужные провайдеры в зависимости от требований вашего проекта.