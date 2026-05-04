import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePostStore } from '../../stores/usePostStore';
import LeftPanel from '../../components/feed/LeftPanel/LeftPanel';
import PostItem from '../../components/feed/PostItem/PostItem';
import RightPanel from '../../components/feed/RightPanel/RightPanel';
import CreatePostForm from '../../components/feed/CreatePostForm/CreatePostForm';
import { toast } from 'react-toastify';
import styles from './FeedPage.module.scss';
import { useProfileStore } from '../../stores/useProfileStore';

const PAGE_SIZE = 15;

const FeedPage: React.FC = () => {
    const navigate = useNavigate();
    const isAuth = useAuthStore((state) => state.isAuth);
    const userId = useAuthStore((state) => state.userId);
    const {
        posts,
        isLoading,
        isFetchingMore,
        hasMore,
        fetchFeed,
        fetchMoreFeed,
        fetchFollowFeed,
        createPost,
        deletePost,
    } = usePostStore();
    const { addPostToState } = useProfileStore();
    const [isCreating, setIsCreating] = useState(false);
    const [feedMode, setFeedMode] = useState<'all' | 'following'>('all');

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuth) {
            navigate('/auth');
            return;
        }
        if (feedMode === 'following') {
            fetchFollowFeed();
        } else {
            fetchFeed(1, PAGE_SIZE);
        }
    }, [isAuth, navigate, feedMode]);

    const handleSentinel = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (
                entry.isIntersecting &&
                feedMode === 'all' &&
                hasMore &&
                !isFetchingMore &&
                !isLoading
            ) {
                fetchMoreFeed(PAGE_SIZE);
            }
        },
        [feedMode, hasMore, isFetchingMore, isLoading, fetchMoreFeed],
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(handleSentinel, {
            rootMargin: '200px',
        });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [handleSentinel]);

    const handleCreatePost = async (content: string, image_url?: string) => {
        setIsCreating(true);
        try {
            const newPost = await createPost(content, image_url);
            if (newPost) {
                addPostToState(newPost);
            }
            toast.success('Post created!');
        } catch {
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
            } catch {
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
                    <div className={styles.feedTabs}>
                        <button
                            className={`${styles.feedTab} ${feedMode === 'all' ? styles.feedTabActive : ''}`}
                            onClick={() => setFeedMode('all')}
                        >
                            For you
                        </button>
                        <button
                            className={`${styles.feedTab} ${feedMode === 'following' ? styles.feedTabActive : ''}`}
                            onClick={() => setFeedMode('following')}
                        >
                            Following
                        </button>
                    </div>
                </div>

                <div className={styles.scrollableContent}>
                    <CreatePostForm onSubmit={handleCreatePost} isLoading={isCreating} />

                    <div className={styles.spacer} />

                    {isLoading && posts.length === 0 ? (
                        <div className={styles.loading}>Loading posts…</div>
                    ) : (
                        <>
                            {posts.map((post) => (
                                <PostItem
                                    key={post.id}
                                    post={post}
                                    onDelete={handleDeletePost}
                                    currentUserId={userId || undefined}
                                />
                            ))}

                            {posts.length === 0 && !isLoading && (
                                <div className={styles.empty}>
                                    No posts yet. Be the first to post!
                                </div>
                            )}

                            <div ref={sentinelRef} style={{ height: 1 }} />

                            {isFetchingMore && <div className={styles.loading}>Loading more…</div>}

                            {!hasMore && posts.length > 0 && feedMode === 'all' && (
                                <div className={styles.empty}>You've reached the end</div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <RightPanel />
        </div>
    );
};

export default FeedPage;
