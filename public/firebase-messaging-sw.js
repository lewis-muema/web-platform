/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: '1083459536124',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
let notificationData = {};

self.addEventListener('push', (event) => {
  notificationData = JSON.parse(event.data.text());

  const { title } = notificationData.notification;
  const options = {
    body: notificationData.notification.body,
    icon: '/notification-logo.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  const { origin } = event.currentTarget.location;
  const orderNo = notificationData.data.order_no;

  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
      })
      .then((allClients) => {
        let sendyClient = false;

        for (const client of allClients) {
          const url = new URL(client.url);

          if (url.origin === `${origin}`) {
            // Excellent, let's use it!
            client.focus();
            sendyClient = true;
            event.notification.close();
            break;
          }
        }

        if (!sendyClient) {
          event.waitUntil(clients.openWindow(`${origin}/orders/tracking/${orderNo}`));
        }
        event.notification.close();
      }),
  );
});
