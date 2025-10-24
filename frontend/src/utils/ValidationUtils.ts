export const ValidationUtils = {
    validateEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePhone: (phone: string): boolean => {
        const phoneRegex = /^\+261[0-9]{9}$/;
        return phoneRegex.test(phone);
    },

    validatePassword: (password: string): boolean => {
        return password.length >= 8;
    },

    validateConfirmPassword: (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    },

    validateRequired: (value: string): boolean => {
        return !!value.trim();
    },

    validateMaxLength: (value: string, max: number): boolean => {
        return value.length <= max;
    },

    validateForm: (formData: Record<string, any>, fields: string[]): string | null => {
        for (const field of fields) {
            if (!ValidationUtils.validateRequired(formData[field])) {
                return `Le champ ${field} est requis`;
            }
        }
        return null;
    }
};