import React, {FC} from 'react';
import {ButtonProps} from "./types";
import styles from './styles.module.scss'
import {SpinnerCircular} from "spinners-react";

const Button: FC<ButtonProps> = ({ label, disabled, onPress, style, variant = 'default', isLoading }) => {
    return (
        <button
            className={`${styles.buttonCustom} ${styles[variant]}`}
            disabled={disabled}
            title={label}
            onClick={onPress}
            style={style}
        >
            {isLoading ? <SpinnerCircular size={"1.6rem"}/> : label }
        </button>
    );
};

export default Button;