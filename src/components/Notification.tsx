import React from 'react';

interface NotificationProps {
  notification: {
    message: string;
    type: 'success' | 'error';
  } | null;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-lg
      ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {notification.message}
    </div>
  );
};