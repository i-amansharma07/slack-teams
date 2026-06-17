"use client";

import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
            border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
            disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400
            ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
