import React, { useState } from 'react';
import { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../../../generated/data-contracts';
import { formatRelativeTime } from '../../../utils/date.utils';
import styles from './PostItem.module.scss';

interface PostItemProps {
    post: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost;
    onDelete?: (id: string) => void;
    currentUserId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete, currentUserId }) => {
    const isAuthor = currentUserId === post.user_id;
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount] = useState(0);
    const [retweetsCount] = useState(0);

    const handleLike = () => {
        if (liked) {
            setLikesCount(prev => prev - 1);
        } else {
            setLikesCount(prev => prev + 1);
        }
        setLiked(!liked);
    };

    return (
        <article className={styles.tweet}>
            <div className={styles.container}>
                <div className={styles.side}>
                    <div className={styles.avatar}>
                        <img src={`https://ui-avatars.com/api/?name=${post.user_id?.slice(0, 2)}&background=1DA1F2&color=fff`} alt="Avatar" />
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.user}>
                        <span className={styles.name}>User {post.user_id?.slice(0, 8)}</span>
                        <span className={styles.username}>@{post.user_id?.slice(0, 8)}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.time}>{formatRelativeTime(post.created_at || new Date().toISOString())}</span>
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
                        <button className={styles.actionItem}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 6H20V18H4L4 6Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span>{commentsCount}</span>
                        </button>
                        <button className={styles.actionItem}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M17 4L20 7L17 10M7 20L4 17L7 14" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M4 7H16C18 7 19 8 19 10M20 17H8C6 17 5 16 5 14" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span>{retweetsCount}</span>
                        </button>
                        <button className={`${styles.actionItem} ${liked ? styles.liked : ''}`} onClick={handleLike}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" stroke="currentColor" strokeWidth="2" fill={liked ? "#F4245E" : "none"}/>
                            </svg>
                            <span>{likesCount}</span>
                        </button>
                        <button className={styles.actionItem}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 12L20 12M12 4L20 12L12 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                        </button>
                    </div>
                    {isAuthor && onDelete && (
                        <button className={styles.deleteButton} onClick={() => onDelete(post.id)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default PostItem;