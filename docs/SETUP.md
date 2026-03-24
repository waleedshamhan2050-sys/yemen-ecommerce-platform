# تعليمات التثبيت والإعداد (Setup Instructions)

يوضح هذا المستند الخطوات اللازمة لتثبيت وتشغيل منصة التجارة الإلكترونية اليمنية على جهازك المحلي.

## 1. المتطلبات الأساسية

تأكد من تثبيت البرامج التالية على نظامك:

-   **Node.js**: الإصدار 14.x أو أحدث. يمكنك تنزيله من [الموقع الرسمي لـ Node.js](https://nodejs.org/).
-   **npm** (مدير حزم Node.js): يأتي مثبتاً تلقائياً مع Node.js. يمكنك التحقق من إصداره باستخدام `npm -v`.
-   **Git**: للتحكم بالإصدارات واستنساخ المستودع. يمكنك تنزيله من [الموقع الرسمي لـ Git](https://git-scm.com/).
-   **محرر أكواد**: مثل [Visual Studio Code](https://code.visualstudio.com/) لتعديل ملفات المشروع.

## 2. استنساخ المستودع (Clone the Repository)

افتح سطر الأوامر (Terminal أو Command Prompt) ونفّذ الأمر التالي لاستنساخ المشروع:

```bash
git clone https://github.com/your-username/yemen-ecommerce-platform.git
cd yemen-ecommerce-platform
```

**ملاحظة**: استبدل `your-username` باسم المستخدم الخاص بك على GitHub بعد رفع المشروع.

## 3. تثبيت التبعيات (Install Dependencies)

بعد الانتقال إلى مجلد المشروع، قم بتثبيت جميع الحزم والتبعيات اللازمة للـ Backend:

```bash
npm install
```

سيقوم هذا الأمر بتثبيت الحزم المذكورة في ملف `package.json`، مثل `express`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `sqlite3`, وغيرها.

## 4. إعداد متغيرات البيئة (Environment Variables)

يستخدم المشروع ملف `.env` لتخزين المتغيرات البيئية الحساسة وإعدادات التكوين. يجب عليك إنشاء هذا الملف وتعبئته بالقيم الصحيحة.

1.  **انسخ الملف النموذجي**: قم بإنشاء نسخة من ملف `.env.example` وسمّها `.env`:
    ```bash
    cp .env.example .env
    ```

2.  **عدّل ملف `.env`**: افتح ملف `.env` باستخدام محرر الأكواد الخاص بك وقم بتحديث القيم التالية:
    ```env
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # Database
    DB_PATH=./database/yemen_ecommerce.db

    # JWT Secret - **هام: يجب تغيير هذا المفتاح في بيئة الإنتاج**
    JWT_SECRET=your_strong_jwt_secret_key_here

    # Email Configuration (لإرسال الإشعارات، اختياري)
    EMAIL_SERVICE=gmail
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASSWORD=your_app_password # استخدم كلمة مرور التطبيق إذا كنت تستخدم Gmail

    # Payment Gateway Configuration (للمحاكاة، يمكن تحديثها لاحقاً)
    MMOCHA_API_KEY=your_mmocha_api_key
    SABAFON_API_KEY=your_sabafon_api_key

    # File Upload
    UPLOAD_DIR=./uploads
    MAX_FILE_SIZE=5242880 # 5MB

    # CORS - عنوان الـ Frontend (إذا كان مختلفاً عن الخادم)
    CORS_ORIGIN=http://localhost:3000
    ```

    **ملاحظات هامة**:
    -   `JWT_SECRET`: يجب أن يكون مفتاحاً سرياً قوياً وفريداً. لا تشاركه أبداً.
    -   `EMAIL_USER` و `EMAIL_PASSWORD`: إذا كنت تستخدم Gmail، فقد تحتاج إلى إنشاء [كلمة مرور تطبيق (App Password)](https://support.google.com/accounts/answer/185833) بدلاً من كلمة مرور حسابك العادية.

## 5. إعداد قاعدة البيانات (Database Setup)

يستخدم المشروع SQLite، وسيتم إنشاء ملف قاعدة البيانات (`yemen_ecommerce.db`) والجداول تلقائياً عند تشغيل الخادم لأول مرة. لا توجد خطوات يدوية إضافية مطلوبة لإعداد قاعدة البيانات في هذه المرحلة.

## 6. تشغيل الخادم (Run the Server)

بعد تثبيت التبعيات وإعداد متغيرات البيئة، يمكنك تشغيل الخادم:

-   **لتشغيل الخادم في وضع الإنتاج (Production Mode)**:
    ```bash
    npm start
    ```

-   **لتشغيل الخادم في وضع التطوير (Development Mode)** (مع إعادة تشغيل تلقائية عند حفظ التغييرات باستخدام `nodemon`):
    ```bash
    npm run dev
    ```

    إذا لم يكن `nodemon` مثبتاً عالمياً، قد تحتاج إلى تثبيته:
    ```bash
    npm install -g nodemon
    ```

عند تشغيل الخادم بنجاح، سترى رسالة في سطر الأوامر تشير إلى أن الخادم يعمل على المنفذ المحدد (عادةً `http://localhost:5000`).

## 7. فتح التطبيق في المتصفح

افتح متصفح الويب المفضل لديك وانتقل إلى العنوان التالي للوصول إلى الواجهة الأمامية للمنصة:

```
http://localhost:5000/src/frontend/index.html
```

أو إذا كنت تستخدم خادم تطوير للواجهة الأمامية (مثل `Live Server` في VS Code)، فافتح ملف `src/frontend/index.html` مباشرة من خلاله.

## 8. اختبار واجهات برمجة التطبيقات (Testing APIs)

يمكنك استخدام أدوات مثل [Postman](https://www.postman.com/downloads/) أو [Insomnia](https://insomnia.rest/download) لاختبار نقاط نهاية API الخاصة بالـ Backend. راجع ملف [API.md](API.md) للحصول على تفاصيل حول المسارات والطلبات والاستجابات.

---

**ملاحظة**: هذا المشروع هو نقطة بداية قوية. قد تحتاج إلى إضافة المزيد من الميزات، تحسين الأداء، وتأمين النظام بشكل أكبر في بيئة الإنتاج الحقيقية.
