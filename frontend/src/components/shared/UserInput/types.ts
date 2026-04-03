import {ChangeEvent, CSSProperties, HTMLInputTypeAttribute, InputHTMLAttributes} from "react";

export interface UserInputProps {
    value?: string;
    id?: string;
    name: string;
    type: HTMLInputTypeAttribute;
    placeholder: string;
    style?: CSSProperties;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}