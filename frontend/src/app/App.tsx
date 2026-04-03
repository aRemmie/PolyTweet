import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AppRouter from "./router/AppRouter";
import './styles/index.scss';

const App = () => {
    return (
        <div className="app dark">
            <ToastContainer
                position={"top-center"}
                hideProgressBar={true}
                theme={'dark'}
                autoClose={1000}
            />
            <AppRouter/>
        </div>
    );
};

export default App;