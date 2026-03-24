/**
 * Order Model
 * Represents a customer order in the system
 */

class Order {
    constructor(data) {
        this.id = data.id || null;
        this.orderId = data.orderId || 'ORD-' + Date.now();
        this.customerId = data.customerId;
        this.items = data.items || []; // Array of {productId, quantity, price}
        this.totalAmount = data.totalAmount || 0;
        this.currency = data.currency || 'YER';
        this.shippingAddress = data.shippingAddress;
        this.shippingCity = data.shippingCity;
        this.shippingZipCode = data.shippingZipCode;
        this.shippingCost = data.shippingCost || 0;
        this.paymentMethod = data.paymentMethod; // 'cod', 'mmocha', 'sabafon', 'card'
        this.paymentStatus = data.paymentStatus || 'pending'; // pending, completed, failed
        this.orderStatus = data.orderStatus || 'pending'; // pending, confirmed, shipped, delivered, cancelled
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    /**
     * Calculate total with shipping
     * @returns {number} Total amount including shipping
     */
    getTotalWithShipping() {
        return this.totalAmount + this.shippingCost;
    }

    /**
     * Add item to order
     * @param {object} item - Item to add {productId, quantity, price}
     */
    addItem(item) {
        this.items.push(item);
        this.calculateTotal();
    }

    /**
     * Calculate order total
     */
    calculateTotal() {
        this.totalAmount = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Update order status
     * @param {string} newStatus - New status
     * @returns {boolean} Success
     */
    updateStatus(newStatus) {
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (validStatuses.includes(newStatus)) {
            this.orderStatus = newStatus;
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * Update payment status
     * @param {string} newStatus - New payment status
     * @returns {boolean} Success
     */
    updatePaymentStatus(newStatus) {
        const validStatuses = ['pending', 'completed', 'failed'];
        if (validStatuses.includes(newStatus)) {
            this.paymentStatus = newStatus;
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    /**
     * Check if order can be cancelled
     * @returns {boolean} True if can be cancelled
     */
    canBeCancelled() {
        return ['pending', 'confirmed'].includes(this.orderStatus);
    }

    /**
     * Validate order data
     * @returns {object} Validation result
     */
    validate() {
        const errors = [];

        if (!this.customerId) {
            errors.push('معرف العميل مطلوب');
        }

        if (this.items.length === 0) {
            errors.push('الطلب يجب أن يحتوي على منتج واحد على الأقل');
        }

        if (this.totalAmount <= 0) {
            errors.push('إجمالي الطلب يجب أن يكون أكبر من صفر');
        }

        if (!this.shippingAddress || this.shippingAddress.trim() === '') {
            errors.push('عنوان الشحن مطلوب');
        }

        if (!this.paymentMethod) {
            errors.push('طريقة الدفع مطلوبة');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Get order summary
     * @returns {object} Order summary
     */
    getSummary() {
        return {
            orderId: this.orderId,
            customerId: this.customerId,
            itemCount: this.items.length,
            subtotal: this.totalAmount,
            shipping: this.shippingCost,
            total: this.getTotalWithShipping(),
            currency: this.currency,
            paymentMethod: this.paymentMethod,
            orderStatus: this.orderStatus,
            paymentStatus: this.paymentStatus,
            createdAt: this.createdAt
        };
    }
}

module.exports = Order;
