import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router-dom';
import TextField from '../shared/TextField/TextField';
import Button from '../shared/Button/Button';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from 'react-toastify';
import styles from './AuthForms.module.scss';

interface SigninFormValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is Required'),
    password: Yup.string().required('Password is Required'),
});

const SigninForm = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const formik = useFormik<SigninFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values: SigninFormValues) => {
            try {
                await login(values.email, values.password);
                toast.success('Login successful!');
                navigate('/feed');
            } catch (error) {
                toast.error('Login failed.');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Sign in to PolyTweet</h1>
            
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
            
            <Button type="submit" fullWidth isLoading={isLoading}>
                Sign in
            </Button>
        </form>
    );
};

export default SigninForm;