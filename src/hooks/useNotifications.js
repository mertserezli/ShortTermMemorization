import { useState } from 'react';

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);

  const toggle = async () => {
    if (!enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setEnabled(true);
        show(
          'Notifications enabled',
          "You'll get reminders when cards are due."
        );
      } else {
        alert(
          'Notifications are blocked. Please allow them in your browser settings.'
        );
      }
    } else {
      setEnabled(false);
    }
  };

  const show = (title, body) => {
    if (enabled && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  return { enabled, toggle, show };
}
