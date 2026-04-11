import React from 'react';
import styles from './RightPanel.module.scss';

const RightPanel: React.FC = () => {
    const newsItems = [
        { category: 'ffuuuuu', time: '2 days ago', title: 'meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow', hashtag: '#cats', imageUrl: '---' },
        { category: 'Technology', time: '2 hours ago', title: 'Tech breakthrough announced in the industry today', hashtag: '#tech', imageUrl: '---' },
        { category: 'Business', time: 'Yesterday', title: 'Market analysis shows significant growth in Q4', hashtag: '#economy', imageUrl: '---' },
    ];

    const whoToFollow = [
        { name: 'aRemmie', username: 'ReA', avatar: 'B' },
        { name: 'Esther Howard', username: 'estherh', avatar: 'E' },
        { name: 'Jenny Wilson', username: 'jennyw', avatar: 'J' },
    ];

    return (
        <div className={styles.rightPanel}>
            <div className={styles.searchBar}>
                <svg width="16" height="19" viewBox="0 0 24 24" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 15L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="text" placeholder="Search Twitter" />
            </div>

            <div className={styles.newsSection}>
                <h3>What's happening</h3>
                {newsItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.newsItem}>
                            <div className={styles.text}>
                                <div className={styles.topic}>
                                    <span>{item.category}</span>
                                    <span>·</span>
                                    <span>{item.time}</span>
                                </div>
                                <div className={styles.title}>{item.title}</div>
                                <div className={styles.topic}>
                                    <span>Trending with</span>
                                    <span className={styles.hashtag}>{item.hashtag}</span>
                                </div>
                            </div>
                            <div className={styles.media}>
                                <div className={styles.thumbnail}></div>
                            </div>
                        </div>
                        {index < newsItems.length - 1 && <div className={styles.divider} />}
                    </React.Fragment>
                ))}
                <a href="#" className={styles.showMore}>Show more</a>
            </div>

            <div className={styles.followSection}>
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
                <a href="#" className={styles.showMore}>Show more</a>
            </div>

            <div className={styles.footer}>
                Terms of Service Privacy Policy Cookie Policy Ads info More © 2026 PolyTweet, Inc.
            </div>
        </div>
    );
};

export default RightPanel;