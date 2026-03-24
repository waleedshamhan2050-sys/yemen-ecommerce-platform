/**
 * Product Model
 * Represents a product in the e-commerce platform
 */

class Product {
    constructor(data) {
        this.id = data.id || null;
        this.vendorId = data.vendorId;
        this.name = data.name;
        this.description = data.description;
        this.category = data.category; // phones, electronics, clothing, etc.
        this.price = data.price;
        this.currency = data.currency || 'YER'; // Yemeni Riyal
        this.stock = data.stock || 0;
        this.images = data.images || [];
        this.rating = data.rating || 0;
        this.reviews = data.reviews || [];
        this.discount = data.discount || 0; // Discount percentage
        this.tags = data.tags || [];
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    /**
     * Calculate final price after discount
     * @returns {number} Final price
     */
    getFinalPrice() {
        return this.price - (this.price * this.discount / 100);
    }

    /**
     * Check if product is in stock
     * @returns {boolean} True if in stock
     */
    isInStock() {
        return this.stock > 0;
    }

    /**
     * Reduce stock quantity
     * @param {number} quantity - Quantity to reduce
     * @returns {boolean} True if successful
     */
    reduceStock(quantity) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
            return true;
        }
        return false;
    }

    /**
     * Add review to product
     * @param {object} review - Review object
     */
    addReview(review) {
        this.reviews.push({
            userId: review.userId,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date()
        });
        this.updateRating();
    }

    /**
     * Update average rating based on reviews
     */
    updateRating() {
        if (this.reviews.length === 0) {
            this.rating = 0;
            return;
        }
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating = (totalRating / this.reviews.length).toFixed(1);
    }

    /**
     * Validate product data
     * @returns {object} Validation result
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('اسم المنتج مطلوب');
        }

        if (!this.description || this.description.trim() === '') {
            errors.push('وصف المنتج مطلوب');
        }

        if (!this.category || this.category.trim() === '') {
            errors.push('فئة المنتج مطلوبة');
        }

        if (!this.price || this.price <= 0) {
            errors.push('السعر يجب أن يكون أكبر من صفر');
        }

        if (this.stock < 0) {
            errors.push('المخزون لا يمكن أن يكون سالباً');
        }

        if (this.discount < 0 || this.discount > 100) {
            errors.push('الخصم يجب أن يكون بين 0 و 100');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Get product data for API response
     * @returns {object} Product data
     */
    toJSON() {
        return {
            id: this.id,
            vendorId: this.vendorId,
            name: this.name,
            description: this.description,
            category: this.category,
            price: this.price,
            finalPrice: this.getFinalPrice(),
            discount: this.discount,
            currency: this.currency,
            stock: this.stock,
            inStock: this.isInStock(),
            images: this.images,
            rating: this.rating,
            reviewCount: this.reviews.length,
            tags: this.tags,
            createdAt: this.createdAt
        };
    }
}

module.exports = Product;
