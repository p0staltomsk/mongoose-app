# Интеграция CustomElementCreator

## Важное замечание по уведомлениям

При интеграции компонента CustomElementCreator необходимо реализовать систему уведомлений на уровне страницы или приложения. Компонент передает сообщения об успехе или ошибке через проп `onNotify`.

Пример использования:

```jsx
const [notification, setNotification] = useState({ message: '', type: '' });

const handleNotify = (message, type) => {
  setNotification({ message, type });
  // Дополнительная логика для отображения уведомления
};

// В вашем JSX
<CustomElementCreator onSave={handleSave} onNotify={handleNotify} />

// Где-то в вашем компоненте страницы
{notification.message && (
  <div className={`notification ${notification.type}`}>
    {notification.message}
  </div>
)}