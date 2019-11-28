/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '1083459536124',
});

const messaging = firebase.messaging();
let notificationData = {};

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

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
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((allClients) => {
      let sendyClient = false;

      for (const client of allClients) {
        const url = new URL(client.url);
        if (url.origin === `${origin}`) {
          // Send a message to the client.
          client.focus();
          sendyClient = true;

          // From service-worker.js:
          const channel = new BroadcastChannel('sw-messages');
          channel.postMessage({
            focusStatus: true,
            focusOrder: orderNo,
          });

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
