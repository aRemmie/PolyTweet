import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import AppRouter from './router/AppRouter';
import './styles/global.scss';

const App = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        const initialTheme = savedTheme || 'dark';
        document.documentElement.setAttribute('data-theme', initialTheme);
        setTheme(initialTheme);

        const observer = new MutationObserver(() => {
            const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
            if (current) setTheme(current);
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="app">
            <ToastContainer
                position="bottom-right"
                hideProgressBar={true}
                theme={theme}
                autoClose={3000}
                closeOnClick
                pauseOnHover
                draggable={false}
                toastClassName="polytweet-toast"
            />
            <AppRouter />
        </div>
    );
};

export default App;
