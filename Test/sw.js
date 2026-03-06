self.addEventListener('notificationclick', (event) => {
    // 1. إغلاق الإشعار فوراً
    event.notification.close();

    // 2. استلام الرابط الجاهز من البيانات
    // نستخدم الرابط الافتراضي '/' فقط في حال حدوث خطأ غير متوقع
    const targetUrl = (event.notification.data && event.notification.data.url) 
                      ? event.notification.data.url 
                      : '/';

    // 3. التوجيه (فتح النافذة أو التركيز عليها)
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // البحث عن نافذة مفتوحة لنفس الموقع
            for (let client of windowClients) {
                // التحقق مما إذا كانت النافذة تابعة لتطبيقنا
                if (client.url.includes(self.registration.scope)) {
                    // إجبار النافذة على الذهاب للرابط الجديد + التركيز عليها
                    return client.navigate(targetUrl).then(c => c.focus());
                }
            }
            // إذا لم توجد نافذة، افتح واحدة جديدة بالرابط الصحيح
            return clients.openWindow(targetUrl);
        })
    );
});
