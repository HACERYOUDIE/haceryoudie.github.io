self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // استخراج الرابط من بيانات الإشعار
    const chatUrl = (event.notification.data && event.notification.data.url) 
                    ? event.notification.data.url 
                    : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // 1. محاولة العثور على نافذة مفتوحة لهذا الموقع
            for (let client of windowClients) {
                if ('focus' in client) {
                    // توجيه النافذة الحالية للمحادثة المطلوبة لضمان تحديثها
                    return client.navigate(chatUrl).then(client => client.focus());
                }
            }
            
            // 2. إذا لم توجد نافذة مفتوحة، افتح نافذة جديدة
            return clients.openWindow(chatUrl);
        })
    );
});
