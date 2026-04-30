import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal/Modal';
import Button from '../shared/Button/Button';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import styles from './AuthModal.module.scss';

interface AuthModalProps {
    open: boolean;
    handleClose: () => void;
    initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, handleClose, initialMode = 'signup' }) => {
    const [isSignup, setIsSignup] = useState(initialMode === 'signup');

    useEffect(() => {
        if (open) {
            setIsSignup(initialMode === 'signup');
        }
    }, [open, initialMode]);

    return (
        <Modal open={open} onClose={handleClose}>
            <div className={styles.modalContent}>
                {isSignup ? <SignupForm /> : <SigninForm />}
                <div className={styles.switchSection}>
                    <p className={styles.switchText}>
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    </p>
                    <Button variant="outlined" fullWidth onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? 'Sign in' : 'Sign up'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AuthModal;
