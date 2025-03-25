import React from 'react';
import './Button.css';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    loading = false,
    onClick,
    type = 'button',
    fullWidth = false,
    className = ''
}) => {
    const buttonClasses = `
        button
        button--${variant}
        button--${size}
        ${fullWidth ? 'button--full-width' : ''}
        ${className}
    `.trim();

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            type={type}
        >
            {loading ? (
                <span className="button__loader"></span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button; 