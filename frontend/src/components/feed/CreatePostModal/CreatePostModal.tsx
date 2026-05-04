import React, { useState, useRef } from 'react';
import Button from '../../shared/Button/Button';
import { PostService } from '@services/PostService';
import styles from './CreatePostModal.module.scss';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string, image_url?: string) => Promise<void>;
    isLoading?: boolean;
    mode?: 'post' | 'reply';
    parentPostContent?: string;
    parentPostAuthor?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading: externalLoading = false,
    mode = 'post',
    parentPostContent,
    parentPostAuthor,
}) => {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isLoading = externalLoading || internalLoading;
    const isBusy = isLoading || isUploading;

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);

        try {
            setIsUploading(true);
            const result = await PostService.uploadImage(file);
            setImageUrl(result.image_url || '');
        } catch (err) {
            console.error('Image upload failed:', err);
            setImagePreview(null);
            setImageUrl('');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isBusy) return;

        setInternalLoading(true);
        try {
            await onSubmit(content.trim(), imageUrl || undefined);
            setContent('');
            setImageUrl('');
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onClose();
        } catch (error) {
            console.error(`Error creating ${mode}:`, error);
        } finally {
            setInternalLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const getTitle = () => (mode === 'reply' ? 'Reply' : 'Create new post');
    const getPlaceholder = () => (mode === 'reply' ? 'Post your reply...' : "What's happening?");
    const getButtonText = () => {
        if (isUploading) return 'Uploading…';
        if (isLoading) return mode === 'reply' ? 'Replying…' : 'Posting…';
        return mode === 'reply' ? 'Reply' : 'Post';
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <span className={styles.modalTitle}>{getTitle()}</span>
                </div>

                {mode === 'reply' && parentPostContent && parentPostAuthor && (
                    <div className={styles.replyingTo}>
                        <span className={styles.replyingToLabel}>Replying to</span>
                        <span className={styles.replyingToUser}>@{parentPostAuthor}</span>
                        <p className={styles.replyingToContent}>{parentPostContent}</p>
                    </div>
                )}

                <form className={styles.postForm} onSubmit={handleSubmit}>
                    <textarea
                        className={styles.postInput}
                        placeholder={getPlaceholder()}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={280}
                        rows={mode === 'reply' ? 4 : 3}
                        autoFocus
                    />

                    <div className={styles.charCount}>{content.length}/280</div>

                    {imagePreview && (
                        <div className={styles.imagePreview}>
                            <img src={imagePreview} alt="Preview" />
                            {isUploading && (
                                <div className={styles.uploadingOverlay}>Uploading…</div>
                            )}
                            <button
                                type="button"
                                className={styles.removeImage}
                                onClick={handleRemoveImage}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M18 6L6 18M6 6L18 18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            className={styles.imageButton}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            title="Attach image"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <circle
                                    cx="8.5"
                                    cy="8.5"
                                    r="2.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M2 16L7 11L12 16L22 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </button>
                        <Button type="submit" disabled={!content.trim() || isBusy}>
                            {getButtonText()}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
