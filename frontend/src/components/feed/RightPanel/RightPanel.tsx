import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';
import { usePostStore } from '../../../stores/usePostStore';
import { PostService } from '../../../services/PostService';
import { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../../../generated/data-contracts';
import styles from './RightPanel.module.scss';
import { formatRelativeTime } from '../../../utils/date.utils';

const RightPanel: React.FC = () => {
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.userId);
    const { posts, fetchFeed } = usePostStore();

    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<
        GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[] | null
    >(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');

    // Debounce ref — search triggers 400ms after the user stops typing
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetchFeed(1, 6).catch(console.error);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        const trimmed = query.trim();
        if (!trimmed) {
            setSearchResults(null);
            setSearchError('');
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setSearchLoading(true);
            setSearchError('');
            try {
                const res = await PostService.searchPosts(trimmed);
                const posts = res.posts || [];
                if (posts.length === 0) {
                    setSearchError('Nothing found');
                    setSearchResults(null);
                } else {
                    setSearchResults(posts);
                }
            } catch {
                setSearchError('Search failed, try again');
                setSearchResults(null);
            } finally {
                setSearchLoading(false);
            }
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    const latestPosts = posts.slice(0, 6);
    const showResults = searchResults !== null || searchError || searchLoading;

    return (
        <div className={styles.rightPanel}>
            {/* Search bar */}
            <div className={styles.searchBar}>
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
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {searchLoading && (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>…</span>
                )}
            </div>

            {/* Search results */}
            {showResults && (
                <div className={styles.searchResultSection}>
                    <h3>Results</h3>
                    {searchError ? (
                        <div className={styles.errorMessage}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M12 8v4M12 16h.01"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <p>{searchError}</p>
                        </div>
                    ) : (
                        (searchResults || []).map((post, i) => (
                            <React.Fragment key={post.id}>
                                <div
                                    className={styles.newsItem}
                                    onClick={() => handlePostClick(post.id)}
                                >
                                    <div className={styles.text}>
                                        <div className={styles.topic}>
                                            <span className={styles.hashtag}>
                                                @{post.username || post.user_id?.slice(0, 8)}
                                            </span>
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
                                    </div>
                                    {post.image_url && (
                                        <div className={styles.media}>
                                            <div
                                                className={styles.thumbnail}
                                                style={{
                                                    backgroundImage: `url(${post.image_url})`,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {i < (searchResults?.length ?? 1) - 1 && (
                                    <div className={styles.divider} />
                                )}
                            </React.Fragment>
                        ))
                    )}
                </div>
            )}

            {/* Latest posts widget — hidden while searching */}
            {!showResults && (
                <div className={styles.newsSection}>
                    <h3>Latest posts</h3>
                    {latestPosts.length === 0 ? (
                        <div className={styles.emptyMessage}>No posts yet</div>
                    ) : (
                        latestPosts.map((post, i) => (
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
                                                @{post.username || post.user_id?.slice(0, 8)}
                                            </span>
                                        </div>
                                    </div>
                                    {post.image_url && (
                                        <div className={styles.media}>
                                            <div
                                                className={styles.thumbnail}
                                                style={{
                                                    backgroundImage: `url(${post.image_url})`,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {i < latestPosts.length - 1 && <div className={styles.divider} />}
                            </React.Fragment>
                        ))
                    )}
                </div>
            )}

            <div className={styles.footer}>
                Terms of Service Privacy Policy Cookie Policy Ads info More © 2026 PolyTweet, Inc.
            </div>
        </div>
    );
};

export default RightPanel;
