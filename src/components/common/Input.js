import React from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    disabled = false,
    required = false,
    name,
    className = ''
}) => {
    const inputClasses = `
        input
        ${error ? 'input--error' : ''}
        ${className}
    `.trim();

    return (
        <div className="input-container">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                className={inputClasses}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                name={name}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default Input; 