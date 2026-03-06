// داخل ملف sw.js
self.addEventListener('notificationclick', (event) => {
    // 1. إغلاق الإشعار فوراً
    event.notification.close();

    // 2. استخراج البيانات التي تم تمريرها عند إنشاء الإشعار
    // سنعتمد على أن البيانات موجودة في event.notification.data
    const data = event.notification.data || {};
    
    // بناء الرابط بناءً على chat_id المستخرج من البيانات
    const chatUrl = data.chat_id ? `/chat?id=${data.chat_id}` : '/';

    // 3. تنفيذ الإجراء
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // محاولة البحث عن نافذة مفتوحة لهذا الموقع
            let clientToFocus = null;

            for (let client of windowClients) {
                // إذا كانت النافذة مفتوحة بالفعل على نفس الرابط، ركز عليها
                if (client.url.includes(chatUrl)) {
                    clientToFocus = client;
                    break;
                }
            }

            if (clientToFocus) {
                // إذا وجدنا النافذة، ركز عليها (لن يغير العد)
                return clientToFocus.focus();
            } else {
                // إذا لم نجدها، افتح نافذة جديدة بالرابط المحدد (سيجبر المتصفح على فتح المحادثة المطلوبة)
                return clients.openWindow(chatUrl);
            }
        })
    );
});
