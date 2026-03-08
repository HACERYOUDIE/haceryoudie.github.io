self.addEventListener('notificationclick', (event) => {
    // 1. إغلاق الإشعار فوراً عند النقر
    event.notification.close();

    // 2. جلب الرابط من البيانات المرفقة
    // نتأكد من وجود url، وإذا لم يوجد نحاول بنائه من chat_id، وإذا فشل نعود للصفحة الرئيسية
    const data = event.notification.data || {};
    const targetUrl = data.url || (data.chat_id ? `/chat?id=${data.chat_id}` : '/chat?id=${data.chat_id}');

    // 3. التعامل مع النوافذ
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // البحث عن أي نافذة تابعة لتطبيقنا
            for (let client of windowClients) {
                // التحقق مما إذا كانت النافذة مفتوحة
                if ('focus' in client) {
                    // أمر النافذة بالانتقال للرابط المحدد (هذا يحل مشكلة العداد وتحديث المحادثة)
                    return client.navigate(targetUrl).then(c => c.focus());
                }
            }
            // إذا لم تكن هناك أي نافذة مفتوحة، افتح نافذة جديدة بالرابط المحدد
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
