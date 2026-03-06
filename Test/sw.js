self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // إغلاق الإشعار

    // الحصول على الرابط الذي خزنّاه في الـ data
    const chatUrl = event.notification.data ? event.notification.data.url : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // ابحث عن نافذة مفتوحة لهذا الموقع
            for (let client of windowClients) {
                if (client.url.includes(chatUrl) && 'focus' in client) {
                    return client.focus(); // إذا كانت مفتوحة، ركز عليها
                }
            }
            // إذا لم تكن مفتوحة، افتح نافذة جديدة بالرابط المحدد
            return clients.openWindow(chatUrl);
        })
    );
});
