import React, {FC} from 'react';
import styles from './styles.module.scss';
import {UserInputProps} from "./types";

const UserInput: FC<UserInputProps> = ({ value, name, type, placeholder, style, id = name, onChange }) => {
    return (
        <input
           value={value}
           className={styles.field}
           style={style}
           type={type}
           placeholder={placeholder}
           id={id}
           name={name}
           required
           aria-autocomplete={"none"}
           onChange={onChange}
        />
    );
};

export default UserInput;