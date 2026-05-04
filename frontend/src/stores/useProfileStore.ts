import { create } from 'zustand';
import { UserService } from '@services/UserService';
import type {
    InternalFeaturesAuthTransportHttpProfileResponse,
    GithubComTryingmyb3StPolyTweetInternalCoreDomainPost,
} from '../generated/data-contracts';
import { ProfileService } from '@services/ProfileService';

interface ProfileState {
    profile: InternalFeaturesAuthTransportHttpProfileResponse | null;

    viewedProfile: InternalFeaturesAuthTransportHttpProfileResponse | null;
    userPosts: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
    totalPosts: number;

    isLoading: boolean;
    error: string | null;
    follows: string[];

    fetchMyProfile: (userId: string) => Promise<void>;
    fetchProfile: (userId: string) => Promise<void>;
    fetchUserPosts: (userId: string, page?: number, pageSize?: number) => Promise<void>;
    updateProfile: (userId: string, bio: string, avatarFile?: File) => Promise<void>;
    uploadAvatar: (file: File) => Promise<string>;

    clearProfile: () => void;
    resetStore: () => void;

    removePost: (postId: string) => void;
    addPostToState: (post: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost) => void;
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    fetchMyFollows: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    viewedProfile: null,
    userPosts: [],
    totalPosts: 0,
    isLoading: false,
    error: null,
    follows: [],

    // Fetch and cache the current user's own profile (avatar, username, etc.)
    async fetchMyProfile(userId: string) {
        try {
            const data = await UserService.getProfile(userId);
            set({ profile: data });
        } catch (error) {
            console.error('Failed to fetch own profile', error);
        }
    },

    // Fetch any user's profile for the ProfilePage view
    async fetchProfile(userId: string) {
        try {
            const data = await UserService.getProfile(userId);
            set({ viewedProfile: data });

            // If it's the current user, also update own profile cache
            const { profile } = get();
            if (!profile || profile.id === data.id) {
                set({ profile: data });
            }
        } catch (error) {
            console.error(`Failed to fetch profile for ${userId}`, error);
        }
    },

    async fetchUserPosts(userId: string, page = 1, pageSize = 15) {
        try {
            const data = await UserService.getUserPosts(userId, page, pageSize);
            set({
                userPosts: data.posts || [],
                totalPosts: data.pagination?.total ?? 0,
            });
        } catch (error) {
            console.error('Failed to fetch user posts:', error);
        }
    },

    async updateProfile(userId: string, bio: string, avatarFile?: File) {
        try {
            set({ isLoading: true });
            let newAvatarUrl = '';

            if (avatarFile) {
                const res = await ProfileService.uploadAvatar(avatarFile);
                newAvatarUrl = res.avatar_url;
            }

            await ProfileService.updateProfile({ bio });

            set((state) => ({
                profile: state.profile
                    ? {
                          ...state.profile,
                          bio,
                          avatar_url: newAvatarUrl || state.profile.avatar_url,
                      }
                    : state.profile,
                viewedProfile: state.viewedProfile
                    ? {
                          ...state.viewedProfile,
                          bio,
                          avatar_url: newAvatarUrl || state.viewedProfile.avatar_url,
                      }
                    : state.viewedProfile,
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    removePost: (postId: string) => {
        set((state) => ({
            userPosts: state.userPosts.filter((post) => post.id !== postId),
            totalPosts: Math.max(0, state.totalPosts - 1),
        }));
    },

    async uploadAvatar(file: File) {
        try {
            const response = await UserService.uploadAvatar(file);
            return response.avatar_url || '';
        } catch (error) {
            console.error('Avatar upload failed:', error);
            throw error;
        }
    },

    addPostToState: (post) => {
        set((state) => ({
            userPosts: [post, ...state.userPosts],
            totalPosts: state.totalPosts + 1,
        }));
    },

    async followUser(userId: string) {
        try {
            await UserService.followUser(userId);
            set((state) => ({ follows: [...state.follows, userId] }));
        } catch (error) {
            console.error('Failed to follow user:', error);
            throw error;
        }
    },

    async unfollowUser(userId: string) {
        try {
            await UserService.unfollowUser(userId);
            set((state) => ({ follows: state.follows.filter((id) => id !== userId) }));
        } catch (error) {
            console.error('Failed to unfollow user:', error);
            throw error;
        }
    },

    async fetchMyFollows() {
        try {
            const data = await UserService.getMyProfile();
            set({ follows: data.follows || [] });
        } catch (error) {
            console.error('Failed to fetch follows:', error);
        }
    },

    clearProfile: () => set({ viewedProfile: null, userPosts: [], totalPosts: 0, error: null }),

    resetStore: () =>
        set({
            profile: null,
            viewedProfile: null,
            userPosts: [],
            totalPosts: 0,
            error: null,
            follows: [],
        }),
}));
