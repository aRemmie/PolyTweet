import React from 'react';
import Title from "@components/shared/Title"
import Line from '@assets/icons/registration/Line.svg'

import styles from './styles.module.scss'
import UserInput from "@components/shared/UserInput";
import Button from "@components/shared/Button";
import RegistrationForm from "@components/auth/RegistrationForm";
import {useAuthStore} from "../../stores/useAuthStore";
import {toast} from "react-toastify";


const RegistrationPage = () => {

    const register = useAuthStore(state => state.register);
    const isLoading = useAuthStore(state => state.isLoading);

    const handleRegistrationConfirm = async (email: string, password: string, group_name: string) => {
        try {
            await register(email, password, group_name);
            toast.success("Регистрация прошла успешно");
        } catch (e) {
            toast.error("Ошибка при регистрации");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title variant='primary'>123</Title>
            </div>
                <RegistrationForm isLoading={isLoading} onConfirm={(email, password, group_name) => handleRegistrationConfirm(email, password, group_name)} loginLink={''}/>
        </div>
    );
};

export default RegistrationPage;