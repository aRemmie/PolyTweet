export interface RegistrationFormProps {
    onConfirm: (email: string, password: string, group_name:string) => void;
    loginLink: string;
    isLoading?: boolean;
}