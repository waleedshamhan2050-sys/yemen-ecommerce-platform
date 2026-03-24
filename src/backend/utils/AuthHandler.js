/**
 * Authentication Handler
 * Handles user authentication, JWT token generation, and password security
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthHandler {
    /**
     * Generate JWT token
     * @param {object} user - User object
     * @returns {string} JWT token
     */
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', {
            expiresIn: '7d' // Token expires in 7 days
        });

        return token;
    }

    /**
     * Verify JWT token
     * @param {string} token - JWT token
     * @returns {object|null} Decoded token or null if invalid
     */
    static verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            return decoded;
        } catch (error) {
            return null;
        }
    }

    /**
     * Hash password
     * @param {string} password - Plain password
     * @returns {Promise<string>} Hashed password
     */
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    /**
     * Compare password with hash
     * @param {string} plainPassword - Plain password
     * @param {string} hashedPassword - Hashed password
     * @returns {Promise<boolean>} True if passwords match
     */
    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} Validation result
     */
    static validatePasswordStrength(password) {
        const errors = [];

        if (password.length < 8) {
            errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
        }

        if (!/[0-9]/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
        }

        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)');
        }

        return {
            isStrong: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Generate refresh token
     * @param {object} user - User object
     * @returns {string} Refresh token
     */
    static generateRefreshToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            type: 'refresh'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', {
            expiresIn: '30d' // Refresh token expires in 30 days
        });

        return token;
    }

    /**
     * Generate password reset token
     * @param {string} userId - User ID
     * @returns {string} Reset token
     */
    static generatePasswordResetToken(userId) {
        const payload = {
            userId: userId,
            type: 'password_reset',
            timestamp: Date.now()
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', {
            expiresIn: '1h' // Reset token expires in 1 hour
        });

        return token;
    }

    /**
     * Verify password reset token
     * @param {string} token - Reset token
     * @returns {object|null} Decoded token or null if invalid
     */
    static verifyPasswordResetToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            if (decoded.type === 'password_reset') {
                return decoded;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Generate 2FA code
     * @returns {string} 6-digit code
     */
    static generate2FACode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Verify 2FA code
     * @param {string} code - Code to verify
     * @param {string} storedCode - Stored code
     * @returns {boolean} True if codes match
     */
    static verify2FACode(code, storedCode) {
        return code === storedCode;
    }
}

module.exports = AuthHandler;
