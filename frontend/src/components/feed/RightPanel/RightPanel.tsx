import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { usePostStore } from '../../../stores/usePostStore';
import { PostService } from '../../../services/PostService';
import { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../../../generated/data-contracts';
import PostItem from '../PostItem/PostItem';
import styles from './RightPanel.module.scss';
import { formatRelativeTime } from '../../../utils/date.utils';

const RightPanel: React.FC = () => {
    const navigate = useNavigate();
    const email = useAuthStore((state) => state.email);
    const userId = useAuthStore((state) => state.userId);
    const { posts, fetchFeed } = usePostStore();
    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] =
        useState<GithubComTryingmyb3StPolyTweetInternalCoreDomainPost | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                await fetchFeed(1, 6);
            } catch (error) {
                console.error('Error fetching latest posts:', error);
            }
        };
        fetchLatestPosts();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setSearchLoading(true);
        setSearchError('');
        setSearchResult(null);

        try {
            const post = await PostService.getPostById(searchId.trim());
            if (post) {
                const transformedPost: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost = {
                    id: post.id || '',
                    user_id: post.user_id || '',
                    content: post.content || '',
                    created_at: post.created_at || new Date().toISOString(),
                    parent_id: post.parent_id,
                    reply_to: post.reply_to,
                    image_url: post.image_url,
                    likes_count: post.likes_count || 0,
                };
                setSearchResult(transformedPost);
            } else {
                setSearchError('Post not found');
            }
        } catch (error) {
            console.error('Error searching post:', error);
            setSearchError('Not found, try something else');
        } finally {
            setSearchLoading(false);
        }
    };

    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    const latestPosts = posts.slice(0, 6);

    // todo: сюда бы метод для рекомендуемых пользователей
    // const currentUser = {
    //     name: email?.split('@')[0] || 'User',
    //     username: email?.split('@')[0] || 'user',
    //     avatar: email?.[0]?.toUpperCase() || 'U'
    // };

    // const whoToFollow = [currentUser, currentUser, currentUser];

    return (
        <div className={styles.rightPanel}>
            <form onSubmit={handleSearch} className={styles.searchBar}>
                <svg width="16" height="19" viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
                    <path
                        d="M15 15L21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search post by ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
            </form>

            {searchResult && (
                <div className={styles.searchResultSection}>
                    <h3>Search result</h3>
                    <div className={styles.searchResultContent}>
                        <PostItem
                            post={searchResult}
                            currentUserId={userId || undefined}
                            disableNavigation={false}
                            onDelete={() => {}}
                        />
                    </div>
                </div>
            )}

            {searchError && (
                <div className={styles.searchErrorSection}>
                    <h3>Search result</h3>
                    <div className={styles.errorMessage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path
                                d="M12 8v4M12 16h.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <p>{searchError}</p>
                    </div>
                </div>
            )}

            <div className={styles.newsSection}>
                <h3>Latest posts</h3>
                {latestPosts.length === 0 ? (
                    <div className={styles.emptyMessage}>No posts yet</div>
                ) : (
                    latestPosts.map((post) => (
                        <React.Fragment key={post.id}>
                            <div
                                className={styles.newsItem}
                                onClick={() => handlePostClick(post.id)}
                            >
                                <div className={styles.text}>
                                    <div className={styles.topic}>
                                        <span>Post</span>
                                        <span className={styles.dot}>·</span>
                                        <span className={styles.time}>
                                            {formatRelativeTime(
                                                post.created_at || new Date().toISOString(),
                                            )}
                                        </span>
                                    </div>
                                    <div className={styles.title}>
                                        {post.content.length > 100
                                            ? post.content.substring(0, 100) + '...'
                                            : post.content}
                                    </div>
                                    <div className={styles.topic}>
                                        <span>By</span>
                                        <span className={styles.hashtag}>
                                            @{post.user_id?.slice(0, 8)}
                                        </span>
                                    </div>
                                </div>
                                {post.image_url && (
                                    <div className={styles.media}>
                                        <div
                                            className={styles.thumbnail}
                                            style={{ backgroundImage: `url(${post.image_url})` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            {latestPosts.indexOf(post) < latestPosts.length - 1 && (
                                <div className={styles.divider} />
                            )}
                        </React.Fragment>
                    ))
                )}
            </div>

            {/* <div className={styles.followSection}>
                <h3>Who to follow</h3>
                {whoToFollow.map((user, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.profile}>
                            <div className={styles.avatar}>
                                {user.avatar}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.name}>{user.name}</div>
                                <div className={styles.username}>@{user.username}</div>
                            </div>
                            <button className={styles.followButton}>Follow</button>
                        </div>
                        {index < whoToFollow.length - 1 && <div className={styles.divider} />}
                    </React.Fragment>
                ))}
            </div> */}

            <div className={styles.footer}>
                Terms of Service Privacy Policy Cookie Policy Ads info More © 2026 PolyTweet, Inc.
            </div>
        </div>
    );
};

export default RightPanel;
