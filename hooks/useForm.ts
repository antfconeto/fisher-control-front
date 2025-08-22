"use client";
import { useState, useCallback, useRef } from 'react';
import { FormValidation, validateForm, validateField, ValidationResult } from '@/utils/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: FormValidation;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string[] };
  touched: { [K in keyof T]?: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: { [K in keyof T]?: string[] }) => void;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  validateField: (field: keyof T) => ValidationResult;
  validateForm: () => boolean;
  reset: () => void;
  submit: () => Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<{ [K in keyof T]?: string[] }>({});
  const [touched, setTouchedState] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrorsState(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback((field: keyof T, error: string) => {
    setErrorsState(prev => ({ ...prev, [field]: [error] }));
  }, []);

  const setErrors = useCallback((newErrors: { [K in keyof T]?: string[] }) => {
    setErrorsState(prev => ({ ...prev, ...newErrors }));
  }, []);

  const validateFieldValue = useCallback((field: keyof T): ValidationResult => {
    if (!validationSchema || !validationSchema[field as string]) {
      return { isValid: true, errors: [] };
    }

    const fieldValue = values[field];
    const fieldRules = validationSchema[field as string];
    return validateField(fieldValue, fieldRules);
  }, [values, validationSchema]);

  const validateFormValues = useCallback((): boolean => {
    if (!validationSchema) {
      return true;
    }

    const validationResults = validateForm(values, validationSchema);
    const newErrors: { [K in keyof T]?: string[] } = {};
    let isValid = true;

    Object.keys(validationResults).forEach(field => {
      const result = validationResults[field];
      if (!result.isValid) {
        newErrors[field as keyof T] = result.errors;
        isValid = false;
      }
    });

    setErrorsState(newErrors);
    return isValid;
  }, [values, validationSchema]);

  const handleChange = useCallback((field: keyof T) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
      setValue(field, value);
    };
  }, [setValue]);

  const handleBlur = useCallback((field: keyof T) => {
    return () => {
      setTouchedState(prev => ({ ...prev, [field]: true }));
      
      // Validate field on blur
      const result = validateFieldValue(field);
      if (!result.isValid) {
        setErrorsState(prev => ({ ...prev, [field]: result.errors }));
      } else {
        setErrorsState(prev => ({ ...prev, [field]: undefined }));
      }
    };
  }, [validateFieldValue]);

  const reset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrorsState({});
    setTouchedState({});
  }, []);

  const submit = useCallback(async () => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    
    try {
      // Mark all fields as touched
      const allTouched: { [K in keyof T]?: boolean } = {};
      Object.keys(values).forEach(key => {
        allTouched[key as keyof T] = true;
      });
      setTouchedState(allTouched);

      // Validate form
      const isValid = validateFormValues();
      
      if (isValid) {
        await onSubmit(values);
      }
    } catch (error) {

    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, values, validateFormValues]);

  // Calculate overall form validity
  const isValid = Object.keys(errors).length === 0 || Object.values(errors).every(error => !error || error.length === 0);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    setError,
    setErrors,
    handleChange,
    handleBlur,
    validateField: validateFieldValue,
    validateForm: validateFormValues,
    reset,
    submit,
  };
} 