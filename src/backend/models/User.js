/**
 * User Model
 * Represents a customer or vendor user in the system
 */

const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.id = data.id || null;
        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.role = data.role || 'customer'; // 'customer', 'vendor', 'admin'
        this.address = data.address || '';
        this.city = data.city || '';
        this.country = data.country || 'Yemen';
        this.zipCode = data.zipCode || '';
        this.profileImage = data.profileImage || null;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    /**
     * Hash password using bcrypt
     * @returns {Promise<string>} Hashed password
     */
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return this.password;
    }

    /**
     * Compare password with hash
     * @param {string} plainPassword - Plain text password to compare
     * @returns {Promise<boolean>} True if passwords match
     */
    async comparePassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password);
    }

    /**
     * Get user public data (without sensitive info)
     * @returns {object} Public user data
     */
    getPublicData() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            role: this.role,
            address: this.address,
            city: this.city,
            country: this.country,
            profileImage: this.profileImage,
            createdAt: this.createdAt
        };
    }

    /**
     * Validate user data
     * @returns {object} Validation result
     */
    validate() {
        const errors = [];

        if (!this.email || !this.email.includes('@')) {
            errors.push('البريد الإلكتروني غير صحيح');
        }

        if (!this.password || this.password.length < 6) {
            errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        if (!this.firstName || this.firstName.trim() === '') {
            errors.push('الاسم الأول مطلوب');
        }

        if (!this.phone || this.phone.trim() === '') {
            errors.push('رقم الهاتف مطلوب');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

module.exports = User;
