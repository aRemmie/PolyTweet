import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import TextField from '../shared/TextField/TextField';
import Button from '../shared/Button/Button';
import Select from '../shared/Select/Select';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from 'react-toastify';
import styles from './AuthForms.module.scss';

interface SignupFormValues {
    email: string;
    username: string;
    password: string;
    role: string;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .min(4, 'Username must be at least 4 characters')
        .max(15, 'Username must be at most 15 characters')
        .matches(USERNAME_REGEX, 'Username can only contain letters, digits and underscores')
        .required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    role: Yup.string().required('Role is required'),
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
            username: '',
            email: '',
            password: '',
            role: 'user',
        },
        validationSchema,
        onSubmit: async (values: SignupFormValues) => {
            try {
                await register(values.email, values.username, values.password, values.role);
                toast.success('Welcome to PolyTweet!');
                //navigate('/feed');
            } catch (error: any) {
                const serverMessage: string = error.response?.data?.message || error.message || '';

                if (
                    serverMessage.toLowerCase().includes('username') &&
                    (serverMessage.toLowerCase().includes('taken') ||
                        serverMessage.toLowerCase().includes('exist') ||
                        serverMessage.toLowerCase().includes('already'))
                ) {
                    formik.setFieldError('username', 'This username is already taken');
                } else if (
                    serverMessage.toLowerCase().includes('email') &&
                    (serverMessage.toLowerCase().includes('taken') ||
                        serverMessage.toLowerCase().includes('exist') ||
                        serverMessage.toLowerCase().includes('already'))
                ) {
                    formik.setFieldError('email', 'An account with this email already exists');
                } else {
                    toast.error(serverMessage || 'Registration failed. Please try again.');
                }
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={styles.form}>
            <h1 className={styles.title}>Create your account</h1>

            <TextField
                name="username"
                type="text"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.username}
                touched={formik.touched.username}
            />

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
