import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import styles from './LeftPanel.module.scss';

interface NavItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    path?: string;
    active?: boolean;
    disabled?: boolean;
}

const LogoIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M7 8H17M9 8L9 16M15 8L15 14.03C15 15.118 15.882 16 16.97 16L17 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);

const HomeIcon = ({ active }: { active?: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 4L4 10V20H9V14H15V20H20V10L12 4Z" strokeWidth="2" fill={active ? "#1DA1F2" : "none"} stroke={active ? "#1DA1F2" : "currentColor"}/>
    </svg>
);

const ExploreIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 8L14 12L12 16L10 12L12 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
);

const NotificationsIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C12 3 12 3 12 3M12 3V1M12 3C9.79 3 8 4.79 8 7V11L6 15H18L16 11V7C16 4.79 14.21 3 12 3Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19" stroke="currentColor" strokeWidth="2"/>
    </svg>
);

const MessagesIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 6L12 13L20 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
);

const ListsIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/>
        <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
        <rect x="4" y="16" width="10" height="2" rx="1" fill="currentColor"/>
    </svg>
);

const BookmarksIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M6 4H18V20L12 16L6 20V4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
);

const ProfileIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke="currentColor" strokeWidth="2"/>
    </svg>
);

const MoreIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="6" r="2" fill="currentColor"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
        <circle cx="12" cy="18" r="2" fill="currentColor"/>
    </svg>
);

const ThemeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const LeftPanel: React.FC = () => {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const email = useAuthStore(state => state.email);
    const [activeTab, setActiveTab] = useState('home');

    const navItems: NavItem[] = [
        { id: 'home', icon: <HomeIcon active={activeTab === 'home'} />, label: 'Home', path: '/feed' },
        { id: 'explore', icon: <ExploreIcon />, label: 'Explore', disabled: true },
        { id: 'notifications', icon: <NotificationsIcon />, label: 'Notifications' },
        { id: 'messages', icon: <MessagesIcon />, label: 'Messages', disabled: true },
        { id: 'bookmarks', icon: <BookmarksIcon />, label: 'Bookmarks', disabled: true },
        { id: 'lists', icon: <ListsIcon />, label: 'Lists', disabled: true },
        { id: 'profile', icon: <ProfileIcon />, label: 'Profile', path: '/profile' },
        { id: 'more', icon: <MoreIcon />, label: 'More', disabled: true },
    ];

    const handleNavigation = (id: string, path?: string, disabled?: boolean) => {
        if (disabled) return;
        setActiveTab(id);
        if (path) navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className={styles.leftPanel}>
            <div className={styles.logo}>
                <LogoIcon />
            </div>

            <button onClick={toggleTheme} className={styles.themeButton}>
                <ThemeIcon />
            </button>

            <nav className={styles.nav}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
                        onClick={() => handleNavigation(item.id, item.path, item.disabled)}
                        disabled={item.disabled}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.label}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <button className={styles.tweetButton}>Post</button>

            <div className={styles.userInfo}>
                <div className={styles.avatar}>
                    {email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={styles.userDetails}>
                    <div className={styles.name}>{email?.split('@')[0] || 'User'}</div>
                    <div className={styles.username}>@{email?.split('@')[0] || 'user'}</div>
                </div>
                <button onClick={handleLogout} className={styles.moreButton}>
                    <MoreIcon />
                </button>
            </div>
        </div>
    );
};

export default LeftPanel;