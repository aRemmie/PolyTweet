import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useProfileStore } from '../../stores/useProfileStore';
import LeftPanel from '../../components/feed/LeftPanel/LeftPanel';
import RightPanel from '../../components/feed/RightPanel/RightPanel';
import PostItem from '../../components/feed/PostItem/PostItem';
import styles from './ProfilePage.module.scss';
import { toast } from 'react-toastify';
import { usePostStore } from '../../stores/usePostStore';
import EditProfileModal from '@components/profile/EditProfileModal/EditProfileModal';

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const currentUserId = useAuthStore((state) => state.userId);
    const isAuth = useAuthStore((state) => state.isAuth);
    const deletePost = usePostStore((state) => state.deletePost);
    const profile = useProfileStore((state) => state.profile);
    const {
        userPosts,
        totalPosts,
        isLoading,
        fetchProfile,
        fetchUserPosts,
        clearProfile,
        profilesCache,
        updateProfile,
    } = useProfileStore();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const user = profilesCache[currentUserId];
    const targetUserId = id || currentUserId;
    const isOwnProfile = targetUserId === currentUserId;

    useEffect(() => {
        if (targetUserId) {
            fetchProfile(targetUserId);
            fetchUserPosts(targetUserId);
        }

        return () => clearProfile();
    }, [targetUserId, isAuth]);

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
        <div className={styles.profilePage}>
            <LeftPanel />

            <div className={styles.feed}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                    <div className={styles.headerInfo}>
                        <h1>{profile?.email?.split('@')[0] || 'Loading...'}</h1>
                        <span>{totalPosts} posts</span>
                    </div>
                </div>

                <div className={styles.scrollableContent}>
                    {isLoading && !profile ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        <>
                            <div className={styles.coverPhoto}></div>
                            <div className={styles.profileInfo}>
                                <div className={styles.avatarSection}>
                                    <div className={styles.avatar}>
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="avatar" />
                                        ) : (
                                            profile?.email?.[0]?.toUpperCase()
                                        )}
                                    </div>
                                    {isOwnProfile && (
                                        <button
                                            className={styles.editButton}
                                            onClick={() => setIsEditOpen(true)}
                                        >
                                            Edit profile
                                        </button>
                                    )}
                                    <EditProfileModal
                                        isOpen={isEditOpen}
                                        onClose={() => setIsEditOpen(false)}
                                        initialBio={profile?.bio || ''}
                                        initialAvatar={profile?.avatar_url}
                                        onSave={async (bio, file) => {
                                            await updateProfile(currentUserId, bio, file);
                                            fetchProfile(targetUserId);
                                        }}
                                    />
                                </div>
                                <div className={styles.userDetails}>
                                    <h2 className={styles.name}>{profile?.email?.split('@')[0]}</h2>
                                    <span className={styles.username}>
                                        @{currentUserId?.slice(0, 8)}
                                    </span>
                                    {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
                                </div>
                            </div>

                            <div className={styles.tabs}>
                                <div className={`${styles.tab} ${styles.active}`}>Posts</div>
                                <div className={styles.tab}>Likes</div>
                            </div>

                            <div className={styles.postsList}>
                                {userPosts.map((post) => (
                                    <PostItem
                                        key={post.id}
                                        post={post}
                                        currentUserId={currentUserId || undefined}
                                        onDelete={handleDeletePost}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <RightPanel />
        </div>
    );
};

export default ProfilePage;
