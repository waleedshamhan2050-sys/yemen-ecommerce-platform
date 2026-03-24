# توثيق واجهات برمجة التطبيقات (API Documentation)

هذا المستند يوضح واجهات برمجة التطبيقات (APIs) المتاحة في منصة التجارة الإلكترونية اليمنية.

## المصادقة (Authentication)

### 1. تسجيل مستخدم جديد (Register User)
- **المسار**: `POST /api/auth/register`
- **الوصف**: يقوم بإنشاء حساب مستخدم جديد (عميل أو بائع).
- **الطلب (Request Body)**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string (valid email)",
    "phone": "string (e.g., +967771234567)",
    "password": "string (min 8 chars, strong)",
    "role": "string (optional, 'customer' or 'vendor', default 'customer')"
  }
  ```
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "تم إنشاء الحساب بنجاح",
      "data": { "userId": "string", "email": "string", "role": "string" }
    }
    ```
  - **خطأ (400 Bad Request)**:
    ```json
    {
      "status": "error",
      "message": "رسالة الخطأ",
      "errors": ["قائمة الأخطاء"]
    }
    ```

### 2. تسجيل الدخول (Login User)
- **المسار**: `POST /api/auth/login`
- **الوصف**: يقوم بتسجيل دخول المستخدم وإرجاع رمز JWT.
- **الطلب (Request Body)**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "تم تسجيل الدخول بنجاح",
      "token": "string (JWT token)",
      "user": { "id": "string", "email": "string", "role": "string" }
    }
    ```
  - **خطأ (401 Unauthorized)**:
    ```json
    {
      "status": "error",
      "message": "بريد إلكتروني أو كلمة مرور غير صحيحة"
    }
    ```

## المنتجات (Products)

### 1. الحصول على جميع المنتجات (Get All Products)
- **المسار**: `GET /api/products`
- **الوصف**: يسترجع قائمة بجميع المنتجات المتاحة.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Get all products",
      "data": [
        { "id": "number", "name": "string", "price": "number", "category": "string", "image": "string" }
      ]
    }
    ```

### 2. الحصول على تفاصيل منتج (Get Product Details)
- **المسار**: `GET /api/products/:id`
- **الوصف**: يسترجع تفاصيل منتج معين بناءً على معرف المنتج.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Get product details",
      "data": { "id": "number", "name": "string", "description": "string", "price": "number" }
    }
    ```
  - **خطأ (404 Not Found)**:
    ```json
    {
      "status": "error",
      "message": "المنتج غير موجود"
    }
    ```

### 3. إضافة منتج جديد (Add New Product) - للبائعين
- **المسار**: `POST /api/vendor/products`
- **الوصف**: يسمح للبائع بإضافة منتج جديد إلى متجره.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للبائع.
- **الطلب (Request Body)**:
  ```json
  {
    "name": "string",
    "description": "string",
    "category": "string",
    "price": "number",
    "stock": "number",
    "images": ["string (URL or base64)"]
  }
  ```
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "تم إضافة المنتج بنجاح",
      "data": { "productId": "string" }
    }
    ```

## سلة التسوق (Cart)

### 1. إضافة منتج إلى السلة (Add Item to Cart)
- **المسار**: `POST /api/cart/add`
- **الوصف**: يضيف منتجًا إلى سلة تسوق المستخدم.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للمستخدم.
- **الطلب (Request Body)**:
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "تمت إضافة المنتج إلى السلة",
      "cartTotal": "number"
    }
    ```

### 2. الحصول على محتويات السلة (Get Cart Items)
- **المسار**: `GET /api/cart`
- **الوصف**: يسترجع جميع المنتجات في سلة تسوق المستخدم.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للمستخدم.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Get cart items",
      "data": [
        { "productId": "string", "name": "string", "price": "number", "quantity": "number" }
      ]
    }
    ```

## الطلبات (Orders)

### 1. إنشاء طلب جديد (Create New Order)
- **المسار**: `POST /api/orders/create`
- **الوصف**: يقوم بإنشاء طلب جديد بناءً على محتويات سلة التسوق.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للمستخدم.
- **الطلب (Request Body)**:
  ```json
  {
    "items": [
      { "productId": "string", "quantity": "number" }
    ],
    "shippingAddress": "string",
    "shippingCity": "string",
    "shippingZipCode": "string",
    "paymentMethod": "string ('cod', 'mmocha', 'sabafon', 'card')",
    "cardDetails": { /* إذا كانت طريقة الدفع 'card' */
      "cardNumber": "string",
      "cvv": "string",
      "expiryDate": "string (MM/YY)"
    }
  }
  ```
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "تم إنشاء الطلب بنجاح",
      "orderId": "string",
      "paymentStatus": "string"
    }
    ```

### 2. الحصول على طلبات المستخدم (Get User Orders)
- **المسار**: `GET /api/orders`
- **الوصف**: يسترجع قائمة بجميع الطلبات التي قام بها المستخدم الحالي.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للمستخدم.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Get user orders",
      "data": [
        { "orderId": "string", "totalAmount": "number", "orderStatus": "string", "createdAt": "datetime" }
      ]
    }
    ```

## لوحة تحكم البائع (Vendor Dashboard)

### 1. الحصول على بيانات لوحة التحكم (Get Dashboard Data)
- **المسار**: `GET /api/vendor/dashboard`
- **الوصف**: يسترجع ملخصًا لبيانات البائع (المبيعات، المنتجات، الطلبات).
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للبائع.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Vendor dashboard data",
      "data": {
        "totalSales": "number",
        "totalOrders": "number",
        "totalProducts": "number",
        "revenue": "number",
        "vendorName": "string",
        "rating": "number"
      }
    }
    ```

### 2. الحصول على منتجات البائع (Get Vendor Products)
- **المسار**: `GET /api/vendor/products`
- **الوصف**: يسترجع قائمة بالمنتجات الخاصة بالبائع الحالي.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للبائع.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Vendor products",
      "data": [
        { "id": "string", "name": "string", "price": "number", "stock": "number" }
      ]
    }
    ```

### 3. الحصول على طلبات البائع (Get Vendor Orders)
- **المسار**: `GET /api/vendor/orders`
- **الوصف**: يسترجع قائمة بالطلبات التي تخص البائع الحالي.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للبائع.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Vendor orders",
      "data": [
        { "orderId": "string", "customerName": "string", "totalAmount": "number", "status": "string" }
      ]
    }
    ```

## لوحة تحكم المسؤول (Admin Panel)

### 1. الحصول على جميع المستخدمين (Get All Users)
- **المسار**: `GET /api/admin/users`
- **الوصف**: يسترجع قائمة بجميع المستخدمين (عملاء وبائعين).
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للمسؤول.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Get all users",
      "data": [
        { "id": "string", "email": "string", "role": "string", "isActive": "boolean" }
      ]
    }
    ```

### 2. الحصول على جميع البائعين (Get All Vendors)
- **المسار**: `GET /api/admin/vendors`
- **الوصف**: يسترجع قائمة بجميع البائعين.
- **المصادقة**: مطلوب رمز JWT (Bearer Token) للمسؤول.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Get all vendors",
      "data": [
        { "id": "string", "name": "string", "email": "string", "status": "string" }
      ]
    }
    ```

## الصحة (Health Check)

### 1. التحقق من حالة الخادم (Server Health Check)
- **المسار**: `GET /api/health`
- **الوصف**: نقطة نهاية بسيطة للتحقق من أن الخادم يعمل.
- **الاستجابة (Response)**:
  - **نجاح (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Yemen E-Commerce Platform is running",
      "timestamp": "datetime"
    }
    ```
