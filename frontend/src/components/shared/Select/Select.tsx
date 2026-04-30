import React, { FC, SelectHTMLAttributes } from 'react';
import styles from './Select.module.scss';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Array<{ value: string | number; label: string }>;
    error?: string;
    touched?: boolean;
}

const Select: FC<SelectProps> = ({ label, options, error, touched, className, ...props }) => {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            {label && <label className={styles.label}>{label}</label>}
            <select
                className={`${styles.select} ${touched && error ? styles.error : ''}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {touched && error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Select;
