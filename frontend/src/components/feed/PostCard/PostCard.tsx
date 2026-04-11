import React, { FC } from 'react';
import { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../../../generated/data-contracts';
import Button from '../../shared/Button/Button';
import { useAuthStore } from '../../../stores/useAuthStore';
import { formatRelativeTime } from '../../../utils/date.utils';
import { getInitials } from '../../../utils/string.utils';
import styles from './PostCard.module.scss';

interface PostCardProps {
    post: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost;
    onDelete?: (id: string) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onDelete }) => {
    const userId = useAuthStore(state => state.userId);
    const isAuthor = userId === post.user_id;

    return (
        <div className={styles.postCard}>
            <div className={styles.postHeader}>
                <div className={styles.authorInfo}>
                    <div className={styles.avatar}>
                        {getInitials(post.user_id || '')}
                    </div>
                    <div className={styles.authorDetails}>
                        <span className={styles.authorEmail}>
                            {`User ${post.user_id?.slice(0, 8) || 'Unknown'}`}
                        </span>
                        <span className={styles.postDate}>
                            {formatRelativeTime(post.created_at || new Date().toISOString())}
                        </span>
                    </div>
                </div>
                {isAuthor && onDelete && (
                    <Button 
                        variant="outlined" 
                        onClick={() => onDelete(post.id)}
                        className={styles.deleteButton}
                    >
                        Delete
                    </Button>
                )}
            </div>
            <p className={styles.postContent}>{post.content}</p>
        </div>
    );
};

export default PostCard;