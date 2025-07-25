"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValidationContextType {
  fieldErrors: Set<string>;
  setFieldError: (fieldPath: string) => void;
  clearFieldError: (fieldPath: string) => void;
  clearAllErrors: () => void;
  hasFieldError: (fieldPath: string) => boolean;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export function ValidationProvider({ children }: { children: ReactNode }) {
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());

  const setFieldError = (fieldPath: string) => {
    setFieldErrors(prev => new Set([...prev, fieldPath]));
  };

  const clearFieldError = (fieldPath: string) => {
    setFieldErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldPath);
      return newSet;
    });
  };

  const clearAllErrors = () => {
    setFieldErrors(new Set());
  };

  const hasFieldError = (fieldPath: string) => {
    return fieldErrors.has(fieldPath);
  };

  return (
    <ValidationContext.Provider value={{
      fieldErrors,
      setFieldError,
      clearFieldError,
      clearAllErrors,
      hasFieldError
    }}>
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation() {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
}

// Helper hook for form fields
export function useFieldValidation(fieldPath: string) {
  const { hasFieldError, clearFieldError } = useValidation();

  const hasError = hasFieldError(fieldPath);

  const clearError = () => {
    clearFieldError(fieldPath);
  };

  return { hasError, clearError };
}