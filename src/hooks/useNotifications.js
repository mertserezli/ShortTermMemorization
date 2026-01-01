import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useNotifications() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  const toggle = async () => {
    if (!enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setEnabled(true);
        new Notification(t('notificationsEnabled'), {
          body: t('notificationsReminder'),
          icon: '/favicon.ico',
        });
      } else {
        alert(t('notificationsBlocked'));
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
