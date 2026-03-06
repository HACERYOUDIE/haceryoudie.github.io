self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data || {};
    const chatUrl = data.chat_id ? `/chat?id=${data.chat_id}` : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // 1. البحث عن نافذة مفتوحة لنفس المحادثة
            for (let client of windowClients) {
                if (client.url.includes(`id=${data.chat_id}`)) {
                    return client.focus(); // إذا كانت مفتوحة، ركز عليها فقط
                }
            }
            // 2. إذا لم تكن مفتوحة، افتح الرابط المباشر للمحادثة
            return clients.openWindow(chatUrl);
        })
    );
});
