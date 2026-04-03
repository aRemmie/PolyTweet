import React, {FC} from 'react';
import {TitleProps} from "./types";
import styles from './styles.module.scss'

const Title: FC<TitleProps> = ({children, variant, style}) => {
    return (
        <h1 style={style} className={`${styles.title} ${styles[variant]}`}>{children}</h1>
    );
};

export default Title;