const publicVapidKey = 'BBVGZH7ko7dK1cU9q131CRHE8QWLAbMdbB0elFAoUyZ2tKrotDkBNiAXK9itN5rBEGwwuBWuldakroDGhl8swLE'; // Replace with your VAPID public key

// Convert base64 string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

export async function registerPushNotificationsPreferences(n_utente, notificationHour) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return;
    }
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    await fetch('http://localhost:5001/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription, n_utente, notification_hour: parseInt(notificationHour) }),
    });
    console.log('Push subscription sent with hour:', notificationHour);
  } catch (err) {
    console.error('Error setting up push notifications:', err);
  }
}