import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import TextField from '../shared/TextField/TextField';
import Button from '../shared/Button/Button';
import Select from '../shared/Select/Select';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from 'react-toastify';
import styles from './AuthForms.module.scss';

interface SignupFormValues {
    email: string;
    password: string;
    role: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is Required ;('),
    password: Yup.string().min(6, 'Password must be at least 6 characters????').required('Password is Required :((('),
    role: Yup.string().required('Role is Required :3'),
});

const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
];

const SignupForm = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const isLoading = useAuthStore((state) => state.isLoading);

    const formik = useFormik<SignupFormValues>({
        initialValues: {
            email: '',
            password: '',
            role: 'user',
        },
        validationSchema,
        onSubmit: async (values: SignupFormValues) => {
            try {
                await register(values.email, values.password, values.role);
                toast.success('ПОБЕДАААА');
                navigate('/feed');
                formik.resetForm();
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                toast.error(errorMessage);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Create your account</h1>
            
            <TextField
                name="email"
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.email}
                touched={formik.touched.email}
            />
            
            <TextField
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.password}
                touched={formik.touched.password}
            />
            
            <Select
                name="role"
                options={roleOptions}
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.role}
                touched={formik.touched.role}
            />
            
            <Button type="submit" fullWidth isLoading={isLoading}>
                Sign up
            </Button>
        </form>
    );
};

export default SignupForm;