import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../../../generated/data-contracts';
import { formatRelativeTime } from '../../../utils/date.utils';
import { usePostStore } from '../../../stores/usePostStore';
import CreatePostModal from '../CreatePostModal/CreatePostModal';
import styles from './PostItem.module.scss';
import { useProfileStore } from '../../../stores/useProfileStore';

interface PostItemProps {
    post: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost;
    onDelete?: (id: string) => void;
    currentUserId?: string;
    isReply?: boolean;
    disableNavigation?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({
    post,
    onDelete,
    currentUserId,
    isReply = false,
    disableNavigation = false,
}) => {
    const { profilesCache, fetchProfile, removePost } = useProfileStore();
    const author = profilesCache[post.user_id];
    const isAuthor = currentUserId === post.user_id;

    const { likePost, unlikePost, likedPosts, createPost } = usePostStore();
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);

    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsLiked(likedPosts.has(post.id));
        if (post.user_id) {
            fetchProfile(post.user_id);
        }
    }, [likedPosts, post.id]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isLiked) {
                await unlikePost(post.id);
                setLikesCount((prev) => prev - 1);
            } else {
                await likePost(post.id);
                setLikesCount((prev) => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/profile/${post.user_id}`);
    };

    const handleReply = async (content: string, image_url?: string) => {
        try {
            await createPost(content, image_url, post.parent_id ?? post.id, post.id);
            setIsReplyModalOpen(false);
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    };

    const handlePostClick = () => {
        if (!disableNavigation) {
            navigate(`/post/${post.id}`);
        }
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        onDelete(post.id);
        removePost(post.id);
    };
    const handleReplyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsReplyModalOpen(true);
    };

    return (
        <>
            <article
                className={`${styles.tweet} ${isReply ? styles.reply : ''}`}
                onClick={handlePostClick}
                style={{ cursor: disableNavigation ? 'default' : 'pointer' }}
            >
                <div className={styles.container}>
                    <div className={styles.side}>
                        <div className={styles.avatar} onClick={handleProfileClick}>
                            {author && author.avatar_url ? (
                                <img src={author.avatar_url} alt="avatar" />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${author ? author.email.split('@')[0].slice(0, 2) : ' '}&background=1DA1F2&color=fff`}
                                    alt="Avatar"
                                />
                            )}
                        </div>
                    </div>
                    <div className={styles.main}>
                        <div className={styles.headerRow}>
                            <div className={styles.user} onClick={handleProfileClick}>
                                <span className={styles.name}>
                                    {author ? author.email.split('@')[0] : 'Loading...'}
                                </span>
                                <span className={styles.username}>
                                    @{post.user_id?.slice(0, 8)}
                                </span>
                                <span className={styles.dot}>·</span>
                                <span className={styles.time}>
                                    {formatRelativeTime(
                                        post.created_at || new Date().toISOString(),
                                    )}
                                </span>
                            </div>
                            {isAuthor && (
                                <div className={styles.menuContainer} ref={menuRef}>
                                    <button className={styles.menuButton} onClick={toggleMenu}>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <circle cx="5" cy="12" r="1" />
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                        </svg>
                                    </button>

                                    {isMenuOpen && (
                                        <div className={styles.dropdown}>
                                            <button
                                                className={styles.deleteOption}
                                                onClick={handleDeleteClick}
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                                Delete post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.content}>
                            <p>{post.content}</p>
                        </div>
                        {post.image_url && (
                            <div className={styles.media}>
                                <div className={styles.mediaContainer}>
                                    <img src={post.image_url} alt="Post media" />
                                </div>
                            </div>
                        )}
                        <div className={styles.actions}>
                            <button className={styles.actionItem} onClick={handleReplyClick}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M17 4L20 7L17 10M7 20L4 17L7 14"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M4 7H16C18 7 19 8 19 10M20 17H8C6 17 5 16 5 14"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </button>
                            <button
                                className={`${styles.actionItem} ${isLiked ? styles.liked : ''}`}
                                onClick={handleLike}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill={isLiked ? '#F4245E' : 'none'}
                                    />
                                </svg>
                                <span>{likesCount}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            <CreatePostModal
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
                onSubmit={handleReply}
                mode="reply"
                parentPostContent={post.content}
                parentPostAuthor={post.user_id?.slice(0, 8)}
            />
        </>
    );
};

export default PostItem;
