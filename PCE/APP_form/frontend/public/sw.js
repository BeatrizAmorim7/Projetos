self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Reminder', body: 'Please complete your form!' };
  const options = {
    body: data.body,
    icon: '/logo192.png', // Add your app icon
    data: { url: data.url || '/dashboard' }, // Redirect URL
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});