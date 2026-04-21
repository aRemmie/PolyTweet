import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePostStore } from '../../stores/usePostStore';
import LeftPanel from '../../components/feed/LeftPanel/LeftPanel';
import PostItem from '../../components/feed/PostItem/PostItem';
import RightPanel from '../../components/feed/RightPanel/RightPanel';
import CreatePostForm from '../../components/feed/CreatePostForm/CreatePostForm';
import { toast } from 'react-toastify';
import styles from './FeedPage.module.scss';

const FeedPage: React.FC = () => {
    const navigate = useNavigate();
    const isAuth = useAuthStore((state) => state.isAuth);
    const userId = useAuthStore((state) => state.userId);
    const { posts, isLoading, fetchFeed, createPost, deletePost } = usePostStore();
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!isAuth) {
            navigate('/auth');
            return;
        }
        fetchFeed(1, 20);
    }, [isAuth, navigate]);

    const handleCreatePost = async (content: string) => {
        setIsCreating(true);
        try {
            await createPost(content);
            toast.success('Post created!');
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (window.confirm('Delete this post?')) {
            try {
                await deletePost(id);
                toast.success('Post deleted');
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    if (!isAuth) return null;

    return (
        <div className={styles.feedPage}>
            <LeftPanel />

            <div className={styles.feed}>
                <div className={styles.header}>
                    <h1>Home</h1>
                </div>

                <div className={styles.scrollableContent}>
                    <CreatePostForm onSubmit={handleCreatePost} isLoading={isCreating} />

                    <div className={styles.spacer} />

                    {isLoading && posts.length === 0 ? (
                        <div className={styles.loading}>Loading posts...</div>
                    ) : (
                        posts.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                onDelete={handleDeletePost}
                                currentUserId={userId || undefined}
                            />
                        ))
                    )}
                </div>
            </div>

            <RightPanel />
        </div>
    );
};

export default FeedPage;
