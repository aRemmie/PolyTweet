import React, { FC, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'contained' | 'outlined';
    fullWidth?: boolean;
    isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
    children,
    variant = 'contained',
    fullWidth = false,
    isLoading = false,
    disabled,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};

export default Button;
