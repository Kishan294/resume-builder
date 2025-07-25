"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFieldValidation } from '@/lib/validation-context';
import { cn } from '@/lib/utils';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldPath: string;
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldPath: string;
}

export function ValidatedInput({ fieldPath, className, onChange, ...props }: ValidatedInputProps) {
  const { hasError, clearError } = useFieldValidation(fieldPath);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasError && e.target.value.trim()) {
      clearError();
    }
    onChange?.(e);
  };

  return (
    <Input
      {...props}
      className={cn(
        className,
        hasError && "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
      )}
      onChange={handleChange}
    />
  );
}

export function ValidatedTextarea({ fieldPath, className, onChange, ...props }: ValidatedTextareaProps) {
  const { hasError, clearError } = useFieldValidation(fieldPath);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (hasError && e.target.value.trim()) {
      clearError();
    }
    onChange?.(e);
  };

  return (
    <Textarea
      {...props}
      className={cn(
        className,
        hasError && "border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
      )}
      onChange={handleChange}
    />
  );
}