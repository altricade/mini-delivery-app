"use client";

import { forwardRef, ChangeEvent } from "react";

interface PhoneInputProps {
  label: string;
  error?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
}

const formatPhoneValue = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";

  let formatted = "+7";

  if (digits.length > 1) {
    formatted += " (" + digits.slice(1, 4);
  }
  if (digits.length >= 4) {
    formatted += ") " + digits.slice(4, 7);
  }
  if (digits.length >= 7) {
    formatted += "-" + digits.slice(7, 9);
  }
  if (digits.length >= 9) {
    formatted += "-" + digits.slice(9, 11);
  }

  return formatted;
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, required, value = "", onChange, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatPhoneValue(inputValue);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
          name: props.name || "",
        },
      };

      onChange?.(syntheticEvent as ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          type="tel"
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="+7 (___) ___-__-__"
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
