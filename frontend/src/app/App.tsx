import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import AppRouter from "./router/AppRouter";
import './styles/global.scss';

const App = () => {
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        const initialTheme = savedTheme || 'dark';
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    return (
        <div className="app">
            <ToastContainer
                position="top-center"
                hideProgressBar={true}
                theme="dark"
                autoClose={1000}
            />
            <AppRouter />
        </div>
    );
};

export default App;