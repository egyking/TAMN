export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

export const showNotification = (title, body, icon = '/icons/icon-192.png') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon, lang: 'ar', dir: 'rtl' });
  } catch (e) {
    // Notification not supported in this context
  }
};
