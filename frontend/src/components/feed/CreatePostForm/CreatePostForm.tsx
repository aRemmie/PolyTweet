import React, { useState } from 'react';
import Button from '../../shared/Button/Button';
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
    const [showImageInput, setShowImageInput] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isLoading) return;

        await onSubmit(content.trim(), imageUrl || undefined);
        setContent('');
        setImageUrl('');
        setShowImageInput(false);
    };

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

            {showImageInput && (
                <div className={styles.imageInput}>
                    <input
                        type="text"
                        placeholder="Enter image URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className={styles.urlInput}
                    />
                </div>
            )}

            <div className={styles.actions}>
                <div className={styles.toolbar}>
                    <button
                        type="button"
                        className={styles.toolbarButton}
                        onClick={() => setShowImageInput(!showImageInput)}
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
                <Button
                    type="submit"
                    //variant="primary"
                    disabled={!content.trim() || isLoading}
                >
                    {isLoading ? 'Posting...' : 'Post'}
                </Button>
            </div>
        </form>
    );
};

export default CreatePostForm;
