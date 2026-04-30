import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../shared/Modal/Modal';
import Button from '../../shared/Button/Button';
import styles from './EditProfileModal.module.scss';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialBio: string;
    initialAvatar?: string;
    onSave: (bio: string, file?: File) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    initialBio,
    initialAvatar,
    onSave,
}) => {
    const [bio, setBio] = useState(initialBio);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatar || null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setBio(initialBio);
            setPreviewUrl(initialAvatar || null);
        }
    }, [isOpen, initialBio, initialAvatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(bio, selectedFile || undefined);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Edit profile</h2>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>

                <div className={styles.content}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar" className={styles.avatar} />
                            ) : (
                                <div className={styles.avatarPlaceholder} />
                            )}
                            <div
                                className={styles.overlay}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <CameraIcon />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    <div className={styles.inputField}>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            maxLength={160}
                        />
                        <span className={styles.counter}>{bio.length}/160</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const CameraIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

export default EditProfileModal;
