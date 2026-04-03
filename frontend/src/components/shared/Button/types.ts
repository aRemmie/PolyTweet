import {CSSProperties} from "react";

type ButtonVariants = 'default' | 'transparent'

export interface ButtonProps {
    label: string;
    disabled?: boolean;
    onPress: () => void;
    style?: CSSProperties;
    variant?: ButtonVariants;
    isLoading?: boolean;
}