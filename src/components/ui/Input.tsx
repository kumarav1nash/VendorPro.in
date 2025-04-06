import React from 'react';

export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'select';
export type InputSize = 'sm' | 'md' | 'lg';

interface BaseInputProps {
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  id?: string;
}

interface TextInputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type: Exclude<InputType, 'select'>;
  selectOptions?: never;
}

interface SelectInputProps extends BaseInputProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  type: 'select';
  selectOptions: { value: string; label: string }[];
}

type InputProps = TextInputProps | SelectInputProps;

const Input: React.FC<InputProps> = ({
  type = 'text',
  size = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  selectOptions,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const errorStyles = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';

  const iconStyles = {
    left: leftIcon ? 'pl-10' : '',
    right: rightIcon ? 'pr-10' : '',
  };

  const renderInput = () => {
    if (type === 'select' && selectOptions) {
      return (
        <select
          id={inputId}
          className={`${baseStyles} ${sizeStyles[size]} ${errorStyles} ${iconStyles.left} ${iconStyles.right} ${className}`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={inputId}
        type={type}
        className={`${baseStyles} ${sizeStyles[size]} ${errorStyles} ${iconStyles.left} ${iconStyles.right} ${className}`}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        {renderInput()}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 