/**
 * Yemen E-Commerce Platform - Main JavaScript
 * Handles navigation, modals, and general interactions
 */

// ==================== CONSTANTS ====================
const API_BASE_URL = 'http://localhost:5000/api';

// ==================== DOM ELEMENTS ====================
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const closeButtons = document.querySelectorAll('.close');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// ==================== EVENT LISTENERS ====================

// Login button
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

// Register button
registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

// Close modals
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});

// Switch between login and register
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Store token
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', email);
            
            // Update UI
            updateAuthUI(true);
            loginModal.style.display = 'none';
            
            // Show success message
            showNotification('تم تسجيل الدخول بنجاح', 'success');
            
            // Clear form
            loginForm.reset();
        } else {
            showNotification('فشل تسجيل الدخول', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('خطأ في الاتصال بالخادم', 'error');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = registerForm.querySelector('input[placeholder="الاسم الأول"]').value;
    const lastName = registerForm.querySelector('input[placeholder="الاسم الأخير"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const phone = registerForm.querySelector('input[type="tel"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;
    const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('كلمات المرور غير متطابقة', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                password
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            showNotification('تم إنشاء الحساب بنجاح', 'success');
            registerModal.style.display = 'none';
            registerForm.reset();
            
            // Auto-login
            setTimeout(() => {
                loginModal.style.display = 'block';
            }, 1500);
        } else {
            showNotification('فشل إنشاء الحساب', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('خطأ في الاتصال بالخادم', 'error');
    }
});

// ==================== FUNCTIONS ====================

/**
 * Update authentication UI based on login status
 */
function updateAuthUI(isLoggedIn) {
    if (isLoggedIn) {
        loginBtn.textContent = 'تسجيل الخروج';
        registerBtn.style.display = 'none';
        
        loginBtn.onclick = () => {
            logout();
        };
    } else {
        loginBtn.textContent = 'تسجيل الدخول';
        registerBtn.style.display = 'block';
        
        loginBtn.onclick = () => {
            loginModal.style.display = 'block';
        };
    }
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    updateAuthUI(false);
    showNotification('تم تسجيل الخروج بنجاح', 'success');
}

/**
 * Show notification message
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

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

/**
 * Get auth token
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Make API request with authentication
 */
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getAuthToken();
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
    // Check if user is already logged in
    if (isUserLoggedIn()) {
        updateAuthUI(true);
    }

    // Load products
    loadProducts();

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

/**
 * Load products from API
 */
async function loadProducts() {
    try {
        const data = await apiRequest('/products');
        if (data.status === 'success') {
            displayProducts(data.data);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

/**
 * Display products in grid
 */
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="text-center">لا توجد منتجات متاحة</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '📦'}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">${product.price.toLocaleString()} ${product.currency}</div>
                <div class="product-rating">
                    <span>⭐ ${product.rating}</span>
                    <span>(${product.reviews} تقييم)</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        أضف للسلة
                    </button>
                    <button class="view-details" onclick="viewProductDetails(${product.id})">
                        التفاصيل
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Add product to cart
 */
function addToCart(productId, productName, price) {
    if (!isUserLoggedIn()) {
        showNotification('يجب تسجيل الدخول أولاً', 'info');
        loginModal.style.display = 'block';
        return;
    }

    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }

    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    showNotification(`تمت إضافة ${productName} إلى السلة`, 'success');
}

/**
 * Update cart count in navbar
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

/**
 * View product details
 */
function viewProductDetails(productId) {
    // This would navigate to a product details page
    console.log('View details for product:', productId);
    showNotification('سيتم فتح صفحة تفاصيل المنتج قريباً', 'info');
}

// Initialize cart count on page load
updateCartCount();
