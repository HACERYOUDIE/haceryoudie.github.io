self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    var chatUrl = `/chat?id=${event.notification.data.chat_id}`;
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.includes('/chat') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(chatUrl);
            }
        })
    );
});
