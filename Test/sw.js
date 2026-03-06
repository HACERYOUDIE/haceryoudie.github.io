self.addEventListener('notificationclick', (event) => {
    // 1. إغلاق الإشعار بعد النقر عليه
    event.notification.close();

    // 2. استخراج رابط الدردشة من الإشعار
    const data = event.notification.data || {};
    const chatUrl = data.url ? data.url : (data.chat_id ? `/chat?id=${data.chat_id}` : '/');

    // 3. التوجيه الذكي
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let client of windowClients) {
                // إذا كان الموقع مفتوحاً (سواء بالرئيسية أو دردشة أخرى)
                if (client.url.includes(self.registration.scope)) {
                    // انتقل فوراً لدردشة الشخص الذي نقرنا على إشعاره وركز عليها
                    return client.navigate(chatUrl).then(c => c.focus());
                }
            }
            // إذا كان التطبيق مغلقاً تماماً، افتح نافذة جديدة على المحادثة
            return clients.openWindow(chatUrl);
        })
    );
});
