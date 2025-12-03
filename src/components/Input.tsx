"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Search, XCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  search?: boolean;
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = "",
      disabled = false,
      required = false,
      type = "text",
      search = false,
      onSearch,
      onClear,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (search && e.key === "Enter" && onSearch) {
        onSearch(e.currentTarget.value);
      }
      props.onKeyDown?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      if (onClear) {
        onClear();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      props.onChange?.(e);
    };

    const currentValue =
      props.value !== undefined ? props.value : internalValue;

    const inputClasses = `
      w-full py-2 
      text-sm text-gray5 
      bg-white border rounded-lg 
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:bg-gray1 disabled:text-gray3 disabled:cursor-not-allowed
      ${search ? "pl-10 pr-10" : "px-3"}
      ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
          : "border-gray3 focus:border-primary focus:ring-primary/20"
      }
      ${className}
    `.trim();

    const containerClasses = fullWidth ? "w-full" : "";

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray5 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {search && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray4">
              <Search size={16} />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            className={inputClasses}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...props}
          />
          {search && currentValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray4 hover:text-gray5 transition-colors"
              aria-label="Clear search"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray4">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
