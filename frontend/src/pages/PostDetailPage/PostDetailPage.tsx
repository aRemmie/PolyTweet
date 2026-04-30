import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { usePostStore } from '../../stores/usePostStore';
import { PostService } from '../../services/PostService';
import LeftPanel from '../../components/feed/LeftPanel/LeftPanel';
import PostItem from '../../components/feed/PostItem/PostItem';
import RightPanel from '../../components/feed/RightPanel/RightPanel';
import CreatePostModal from '../../components/feed/CreatePostModal/CreatePostModal';
import { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../../generated/data-contracts';
import styles from './PostDetailPage.module.scss';

const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.userId);
    const { createPost, deletePost } = usePostStore();
    const [post, setPost] = useState<GithubComTryingmyb3StPolyTweetInternalCoreDomainPost | null>(
        null,
    );
    const [replies, setReplies] = useState<GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPostAndReplies();
        }
    }, [id]);

    const fetchPostAndReplies = async () => {
        setIsLoading(true);
        try {
            const postData = await PostService.getPostById(id!);
            const transformedPost: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost = {
                id: postData.id || '',
                user_id: postData.user_id || '',
                content: postData.content || '',
                created_at: postData.created_at || new Date().toISOString(),
                parent_id: postData.parent_id,
                reply_to: postData.reply_to,
                image_url: postData.image_url,
                likes_count: postData.likes_count || 0,
            };
            setPost(transformedPost);

            const repliesData = await PostService.getReplies(1, 50);
            const postReplies: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[] = (
                repliesData.posts || []
            )
                .filter((reply) => reply.parent_id === id || reply.reply_to === id)
                .map((reply) => ({
                    id: reply.id || '',
                    user_id: reply.user_id || '',
                    content: reply.content || '',
                    created_at: reply.created_at || new Date().toISOString(),
                    parent_id: reply.parent_id,
                    reply_to: reply.reply_to,
                    image_url: reply.image_url,
                    likes_count: reply.likes_count || 0,
                }));
            setReplies(postReplies);
        } catch (error) {
            console.error('Error fetching post:', error);
            navigate('/feed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReply = async (content: string, image_url?: string) => {
        if (!id) return;
        try {
            const newReply = await createPost(content, image_url, id, id);
            if (newReply) {
                setReplies((prev) => [
                    newReply as GithubComTryingmyb3StPolyTweetInternalCoreDomainPost,
                    ...prev,
                ]);
            }
            setIsReplyModalOpen(false);
        } catch (error) {
            throw error;
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (window.confirm('Delete this post?')) {
            try {
                await deletePost(postId);
                navigate('/feed');
            } catch (error) {
                throw error;
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className={styles.postDetailPage}>
            <LeftPanel />

            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={handleGoBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <h1>Post</h1>
                </div>

                <div className={styles.postContainer}>
                    <PostItem
                        post={post}
                        onDelete={handleDeletePost}
                        currentUserId={userId || undefined}
                        disableNavigation={true}
                    />
                </div>

                <div className={styles.replySection}>
                    <button
                        className={styles.replyButton}
                        onClick={() => setIsReplyModalOpen(true)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                        <span>Reply</span>
                    </button>
                </div>

                <div className={styles.repliesList}>
                    <h3 className={styles.repliesTitle}>Replies</h3>
                    {replies.length === 0 ? (
                        <div className={styles.noReplies}>
                            No replies yet. Be the first to reply!
                        </div>
                    ) : (
                        replies.map((reply) => (
                            <PostItem
                                key={reply.id}
                                post={reply}
                                onDelete={handleDeletePost}
                                currentUserId={userId || undefined}
                                isReply={true}
                                disableNavigation={false}
                            />
                        ))
                    )}
                </div>
            </div>

            <CreatePostModal
                isOpen={isReplyModalOpen}
                onClose={() => setIsReplyModalOpen(false)}
                onSubmit={handleReply}
                mode="reply"
                parentPostContent={post.content}
                parentPostAuthor={post.user_id?.slice(0, 8)}
            />
            <RightPanel />
        </div>
    );
};

export default PostDetailPage;
