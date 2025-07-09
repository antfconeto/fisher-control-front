export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormValidation {
  [fieldName: string]: ValidationRule;
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true, errors: [] };
  }

  // Min length validation
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  // Max length validation
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push('Invalid format');
  }

  // Email validation
  if (rules.email && typeof value === 'string') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      errors.push('Invalid email format');
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateForm = (data: any, validationSchema: FormValidation): { [fieldName: string]: ValidationResult } => {
  const results: { [fieldName: string]: ValidationResult } = {};

  Object.keys(validationSchema).forEach(fieldName => {
    const value = data[fieldName];
    const rules = validationSchema[fieldName];
    results[fieldName] = validateField(value, rules);
  });

  return results;
};

export const isFormValid = (validationResults: { [fieldName: string]: ValidationResult }): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Common validation rules
export const commonValidations = {
  required: { required: true },
  email: { required: true, email: true },
  password: { 
    required: true, 
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  name: { required: true, minLength: 2, maxLength: 50 },
  phone: { 
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
        return 'Invalid phone number format';
      }
      return null;
    }
  },
  url: {
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return 'URL must start with http:// or https://';
      }
      return null;
    }
  },
}; 