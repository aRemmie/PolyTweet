import { create } from 'zustand';
import { UserService } from '@services/UserService';
import type {
    InternalFeaturesAuthTransportHttpProfileResponse,
    GithubComTryingmyb3StPolyTweetInternalCoreDomainPost,
} from '../generated/data-contracts';
import { Profile } from '../generated/Profile';
import { ProfileService } from '@services/ProfileService';
const profileService = new Profile();

interface ProfileState {
    profile: InternalFeaturesAuthTransportHttpProfileResponse | null;
    userPosts: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
    profilesCache: Record<string, InternalFeaturesAuthTransportHttpProfileResponse>;
    totalPosts: number;
    isLoading: boolean;
    error: string | null;

    fetchProfile: (userId: string) => Promise<void>;
    fetchUserPosts: (userId: string, page?: number, pageSize?: number) => Promise<void>;
    updateProfile: (userId: string, bio: string, avatarFile?: File) => Promise<void>;
    uploadAvatar: (file: File) => Promise<string>;
    clearProfile: () => void;
    removePost: (postId: string) => void;
    addPostToState: (post: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    profilesCache: {},
    profile: null,
    userPosts: [],
    totalPosts: 0,
    isLoading: false,
    error: null,

    async fetchProfile(userId: string) {
        if (get().profilesCache[userId]) {
            set({ profile: get().profilesCache[userId] });
            return;
        }

        try {
            const data = await UserService.getProfile(userId);
            set((state) => ({
                profilesCache: {
                    ...state.profilesCache,
                    [userId]: data,
                },
            }));
        } catch (error) {
            console.error(`Failed to fetch profile for ${userId}`, error);
        }
    },

    async fetchUserPosts(userId: string, page = 1, pageSize = 15) {
        try {
            const data = await UserService.getUserPosts(userId, page, pageSize);
            set({
                userPosts: data.posts || [],
                totalPosts: data.pagination.total,
            });
        } catch (error: any) {
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

            set((state) => {
                const updatedProfile = state.profilesCache[userId]
                    ? {
                          ...state.profilesCache[userId],
                          bio,
                          avatar_url: newAvatarUrl || state.profilesCache[userId].avatar_url,
                      }
                    : null;

                return {
                    profilesCache: {
                        ...state.profilesCache,
                        ...(updatedProfile ? { [userId]: updatedProfile } : {}),
                    },
                    profile: updatedProfile || state.profile,
                    isLoading: false,
                };
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    removePost: (postId: string) => {
        set((state) => ({
            userPosts: state.userPosts.filter((post) => post.id !== postId),

            totalPosts: Math.max(0, state.totalPosts - 1),

            profilesCache: Object.fromEntries(
                Object.entries(state.profilesCache).map(([userId, profile]) => [
                    userId,
                    {
                        ...profile,
                        posts: profile.posts?.filter((p: any) => p.id !== postId),
                    },
                ]),
            ),
        }));
    },

    async uploadAvatar(file: File) {
        try {
            const response = await UserService.uploadAvatar(file);
            return response.avatar_url || '';
        } catch (error: any) {
            console.error('Avatar upload failed:', error);
            throw error;
        }
    },
    addPostToState: (post) => {
        set((state) => ({
            userPosts: [post, ...state.userPosts],
            totalPosts: state.totalPosts + 1,

            profilesCache: state.profilesCache[post.user_id]
                ? {
                      ...state.profilesCache,
                      [post.user_id]: {
                          ...state.profilesCache[post.user_id],
                          posts: [post, ...(state.profilesCache[post.user_id].posts || [])],
                      },
                  }
                : state.profilesCache,
        }));
    },
    clearProfile: () => set({ profile: null, userPosts: [], totalPosts: 0, error: null }),
}));
