import React, { useState, useRef } from 'react';
import Button from '../../shared/Button/Button';
import { PostService } from '@services/PostService';
import styles from './CreatePostForm.module.scss';

interface CreatePostFormProps {
    onSubmit: (content: string, image_url?: string) => Promise<void>;
    isLoading: boolean;
    placeholder?: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
    onSubmit,
    isLoading,
    placeholder = "What's happening?",
}) => {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // local preview
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
        if (!content.trim() || isLoading || isUploading) return;

        await onSubmit(content.trim(), imageUrl || undefined);
        setContent('');
        setImageUrl('');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const isBusy = isLoading || isUploading;

    return (
        <form className={styles.createPostForm} onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
                <textarea
                    className={styles.postInput}
                    placeholder={placeholder}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={280}
                    rows={3}
                />
                <div className={styles.charCount}>{content.length}/280</div>
            </div>

            {imagePreview && (
                <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                    {isUploading && <div className={styles.uploadingOverlay}>Uploading…</div>}
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
                <div className={styles.toolbar}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        className={styles.toolbarButton}
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
                            <path d="M2 16L7 11L12 16L22 6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
                <Button type="submit" disabled={!content.trim() || isBusy}>
                    {isUploading ? 'Uploading…' : isLoading ? 'Posting…' : 'Post'}
                </Button>
            </div>
        </form>
    );
};

export default CreatePostForm;
