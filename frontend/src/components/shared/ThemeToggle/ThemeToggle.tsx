import React, { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.scss';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        const initialTheme = savedTheme || 'dark';
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button className={styles.toggle} onClick={toggleTheme} aria-label="Toggle theme">
            <div className={styles.switch}>
                <div className={`${styles.slider} ${theme === 'light' ? styles.active : ''}`}></div>
            </div>
        </button>
    );
};

export default ThemeToggle;