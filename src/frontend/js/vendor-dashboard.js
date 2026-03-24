/**
 * Vendor Dashboard JavaScript
 * Handles vendor dashboard interactions and API calls
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ==================== DOM ELEMENTS ====================
const vendorName = document.getElementById('vendorName');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarMenu = document.querySelectorAll('.sidebar-menu .menu-item');
const contentSections = document.querySelectorAll('.content-section');
const settingsForm = document.getElementById('settingsForm');
const addProductForm = document.getElementById('addProductForm');
const addPromotionForm = document.getElementById('addPromotionForm');

// ==================== EVENT LISTENERS ====================

// Sidebar menu navigation
sidebarMenu.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        sidebarMenu.forEach(i => i.classList.remove('active'));
        contentSections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get target section
        const target = item.getAttribute('href').substring(1);
        const section = document.getElementById(target);
        if (section) {
            section.classList.add('active');
        }
    });
});

// Logout button
logoutBtn.addEventListener('click', () => {
    logout();
});

// Settings form submission
settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const settings = {
        storeName: document.getElementById('storeName').value,
        storeDescription: document.getElementById('storeDescription').value,
        storePhone: document.getElementById('storePhone').value,
        storeEmail: document.getElementById('storeEmail').value,
        storeCity: document.getElementById('storeCity').value
    };

    try {
        const response = await apiRequest('/vendor/update-settings', {
            method: 'POST',
            body: JSON.stringify(settings)
        });

        if (response.status === 'success') {
            showNotification('تم حفظ الإعدادات بنجاح', 'success');
        } else {
            showNotification('فشل حفظ الإعدادات', 'error');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showNotification('خطأ في الاتصال بالخادم', 'error');
    }
});

// Add product form submission
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(addProductForm);
    
    try {
        const response = await apiRequest('/products/create', {
            method: 'POST',
            body: formData
        });

        if (response.status === 'success') {
            showNotification('تم إضافة المنتج بنجاح', 'success');
            closeModal('addProductModal');
            addProductForm.reset();
            loadProducts();
        } else {
            showNotification('فشل إضافة المنتج', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('خطأ في الاتصال بالخادم', 'error');
    }
});

// Add promotion form submission
addPromotionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const promotion = {
        name: addPromotionForm.querySelector('input[placeholder="اسم العرض"]').value,
        discount: addPromotionForm.querySelector('input[placeholder="نسبة الخصم (%)"]').value,
        startDate: addPromotionForm.querySelector('input[placeholder="تاريخ البداية"]').value,
        endDate: addPromotionForm.querySelector('input[placeholder="تاريخ النهاية"]').value,
        products: addPromotionForm.querySelector('select').value
    };

    try {
        const response = await apiRequest('/promotions/create', {
            method: 'POST',
            body: JSON.stringify(promotion)
        });

        if (response.status === 'success') {
            showNotification('تم إضافة العرض بنجاح', 'success');
            closeModal('addPromotionModal');
            addPromotionForm.reset();
            loadPromotions();
        } else {
            showNotification('فشل إضافة العرض', 'error');
        }
    } catch (error) {
        console.error('Error adding promotion:', error);
        showNotification('خطأ في الاتصال بالخادم', 'error');
    }
});

// ==================== FUNCTIONS ====================

/**
 * Load dashboard data
 */
async function loadDashboardData() {
    try {
        const response = await apiRequest('/vendor/dashboard');
        
        if (response.status === 'success') {
            const data = response.data;
            
            // Update stats
            document.getElementById('totalSales').textContent = 
                `${data.totalSales.toLocaleString()} ريال`;
            document.getElementById('totalProducts').textContent = data.totalProducts;
            document.getElementById('totalOrders').textContent = data.totalOrders;
            document.getElementById('vendorRating').textContent = 
                `${data.rating || 0}/5`;
            
            // Update vendor name
            vendorName.textContent = data.vendorName || 'التاجر';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Load products
 */
async function loadProducts() {
    try {
        const response = await apiRequest('/vendor/products');
        
        if (response.status === 'success') {
            const productsList = document.getElementById('productsList');
            
            if (response.data.length === 0) {
                productsList.innerHTML = '<p>لا توجد منتجات</p>';
                return;
            }

            productsList.innerHTML = response.data.map(product => `
                <div class="product-item">
                    <div class="product-image">📦</div>
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>${product.category}</p>
                        <div class="product-price">${product.price} ريال</div>
                        <p>المخزون: ${product.stock}</p>
                        <div class="product-actions">
                            <button class="edit-btn" onclick="editProduct(${product.id})">تعديل</button>
                            <button class="delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

/**
 * Load orders
 */
async function loadOrders() {
    try {
        const response = await apiRequest('/vendor/orders');
        
        if (response.status === 'success') {
            const ordersTable = document.getElementById('ordersTable');
            
            if (response.data.length === 0) {
                ordersTable.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد طلبات</td></tr>';
                return;
            }

            ordersTable.innerHTML = response.data.map(order => `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.customerName}</td>
                    <td>${order.totalAmount} ريال</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td>${order.paymentMethod}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString('ar-YE')}</td>
                    <td>
                        <button class="btn btn-primary" onclick="viewOrder(${order.id})">عرض</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

/**
 * Load promotions
 */
async function loadPromotions() {
    try {
        const response = await apiRequest('/vendor/promotions');
        
        if (response.status === 'success') {
            const promotionsList = document.getElementById('promotionsList');
            
            if (response.data.length === 0) {
                promotionsList.innerHTML = '<p>لا توجد عروض حالياً</p>';
                return;
            }

            promotionsList.innerHTML = response.data.map(promo => `
                <div class="promotion-item">
                    <h3>${promo.name}</h3>
                    <p>الخصم: ${promo.discount}%</p>
                    <p>من ${new Date(promo.startDate).toLocaleDateString('ar-YE')} 
                       إلى ${new Date(promo.endDate).toLocaleDateString('ar-YE')}</p>
                    <button class="btn btn-secondary" onclick="deletePromotion(${promo.id})">حذف</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading promotions:', error);
    }
}

/**
 * Show add product form
 */
function showAddProductForm() {
    document.getElementById('addProductModal').style.display = 'block';
}

/**
 * Show add promotion form
 */
function showAddPromotionForm() {
    document.getElementById('addPromotionModal').style.display = 'block';
}

/**
 * Close modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

/**
 * Edit product
 */
function editProduct(productId) {
    showNotification('سيتم فتح صفحة تعديل المنتج قريباً', 'info');
}

/**
 * Delete product
 */
async function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        try {
            const response = await apiRequest(`/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.status === 'success') {
                showNotification('تم حذف المنتج بنجاح', 'success');
                loadProducts();
            } else {
                showNotification('فشل حذف المنتج', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('خطأ في الاتصال بالخادم', 'error');
        }
    }
}

/**
 * Delete promotion
 */
async function deletePromotion(promotionId) {
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
        try {
            const response = await apiRequest(`/promotions/${promotionId}`, {
                method: 'DELETE'
            });

            if (response.status === 'success') {
                showNotification('تم حذف العرض بنجاح', 'success');
                loadPromotions();
            } else {
                showNotification('فشل حذف العرض', 'error');
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            showNotification('خطأ في الاتصال بالخادم', 'error');
        }
    }
}

/**
 * View order details
 */
function viewOrder(orderId) {
    showNotification('سيتم فتح تفاصيل الطلب قريباً', 'info');
}

/**
 * Generate sales report
 */
function generateSalesReport() {
    showNotification('جاري إنشاء التقرير...', 'info');
}

/**
 * Generate products report
 */
function generateProductsReport() {
    showNotification('جاري إنشاء التقرير...', 'info');
}

/**
 * Generate customers report
 */
function generateCustomersReport() {
    showNotification('جاري إنشاء التقرير...', 'info');
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = '/src/frontend/index.html';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '2000';
    notification.style.maxWidth = '400px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Make API request with authentication
 */
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!localStorage.getItem('authToken')) {
        window.location.href = '/src/frontend/index.html';
        return;
    }

    // Load dashboard data
    loadDashboardData();
    loadOrders();
    loadProducts();
    loadPromotions();

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});
