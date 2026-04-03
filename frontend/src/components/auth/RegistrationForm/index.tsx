import React, {FC, useState} from 'react';
import UserInput from "@components/shared/UserInput";
import styles from "./styles.module.scss";
import Button from "@components/shared/Button";
import {RegistrationFormProps} from "./types";
import {Link} from "react-router-dom";

const RegistrationForm: FC<RegistrationFormProps> = ({ onConfirm, loginLink, isLoading }) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [groupName, setGroupName] = useState<string>('');

    return (
        <div className={styles.mainContainer}>
            <div className={styles.inputGroup}>
                <UserInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="e-mail"
                    type="email"
                    placeholder="Введите e-mail"
                />
                <UserInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    type="password"
                    placeholder="Придумайте пароль"
                />
                <UserInput
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    name="group-name"
                    type="text"
                    placeholder="Введите номер учебной группы"
                />
            </div>
            <Button label={"Продолжить"} onPress={() => onConfirm(email, password, groupName)} isLoading={isLoading}/>
            <Link to={loginLink} className={styles.loginLink}>Уже есть аккаунт? Войти</Link>
        </div>
    );
};

export default RegistrationForm;