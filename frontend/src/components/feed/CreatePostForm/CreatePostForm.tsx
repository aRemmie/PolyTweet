import React, { FC, useState } from 'react';
import Button from '../../shared/Button/Button';
import TextField from '../../shared/TextField/TextField';
import { useAuthStore } from '../../../stores/useAuthStore';
import styles from './CreatePostForm.module.scss';

interface CreatePostFormProps {
    onSubmit: (content: string) => Promise<void>;
    isLoading?: boolean;
}

const CreatePostForm: FC<CreatePostFormProps> = ({ onSubmit, isLoading }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const email = useAuthStore((state) => state.email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            setError('Post content cannot be empty');
            return;
        }

        if (content.length > 280) {
            setError('Post cannot exceed 280 characters');
            return;
        }

        setError('');
        try {
            await onSubmit(content);
            setContent('');
        } catch (err) {
            setError('Failed to create post');
        }
    };

    const characterCount = content.length;
    const isOverLimit = characterCount > 280;

    return (
        <form onSubmit={handleSubmit} className={styles.createPostForm}>
            <div className={styles.avatarAndInput}>
                <div className={styles.avatar}>
                    {email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className={styles.inputWrapper}>
                    <TextField
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        textarea={true}
                        rows={3}
                        error={error}
                        touched={!!error}
                    />
                    <div className={styles.charCounter}>
                        <span className={`${styles.counter} ${isOverLimit ? styles.over : ''}`}>
                            {characterCount}/280
                        </span>
                    </div>
                </div>
            </div>
            
            <div className={styles.actions}>
                <Button 
                    type="submit" 
                    isLoading={isLoading}
                    disabled={!content.trim() || isOverLimit}
                    variant="contained"
                >
                    Post
                </Button>
            </div>
        </form>
    );
};

export default CreatePostForm;