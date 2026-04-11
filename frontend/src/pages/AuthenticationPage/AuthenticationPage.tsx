import React, { useState } from 'react';
import Button from '../../components/shared/Button/Button';
import AuthModal from '../../components/auth/AuthModal';
import styles from './AuthenticationPage.module.scss';

const AuthenticationPage = () => {
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [isSignup, setIsSignup] = useState(true);

    const handleOpenAuthModal = (signup: boolean) => {
        setIsSignup(signup);
        setOpenAuthModal(true);
    };

    const handleCloseAuthModal = () => setOpenAuthModal(false);

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.logoContainer}>
                    <svg className={styles.logo} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 8L9 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 8L15 14.03C15 15.118 15.882 16 16.97 16L17 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            
            <div className={styles.rightSection}>
                <h1 className={styles.mainTitle}>ЙОУ</h1>
                <h2 className={styles.subTitle}>Join PolyTweet today</h2>
                
                <div className={styles.buttonsContainer}>
                    <Button 
                        fullWidth 
                        onClick={() => handleOpenAuthModal(true)}
                    >
                        Create account
                    </Button>
                    
                    <div className={styles.loginSection}>
                        <p className={styles.loginText}>Already have an account?</p>
                        <Button 
                            variant="outlined" 
                            fullWidth
                            onClick={() => handleOpenAuthModal(false)}
                        >
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
            
            <AuthModal 
                open={openAuthModal} 
                handleClose={handleCloseAuthModal}
                initialMode={isSignup ? 'signup' : 'signin'}
            />
        </div>
    );
};

export default AuthenticationPage;