import {CSSProperties, ReactNode} from "react";

type TitleVariant = 'default' | 'primary'

export interface TitleProps {
    children: ReactNode;
    variant?: TitleVariant;
    style?: CSSProperties
}